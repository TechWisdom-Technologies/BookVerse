import { PrismaClient, FileType } from "@prisma/client";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import os from "os";
import { execFileSync } from "child_process";
import { randomUUID } from "crypto";
import { uploadToR2 } from "../src/lib/r2";

// Load environment variables (supports .env.local and .env)
config({ path: ".env.local" });
config({ path: ".env" });

const prisma = new PrismaClient();
let successCount = 0;
let skipCount = 0;
let errorCount = 0;

function sanitizeFilename(filename: string) {
  return (
    filename
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "") || "upload"
  );
}

function extractMetadataLocal(
  filename: string,
  pdfMetadata: { title?: string; author?: string; subject?: string },
  extractedText: string
): { title: string; authorName: string; genre: string; description: string } {
  let title = pdfMetadata.title?.trim();
  let authorName = pdfMetadata.author?.trim();
  let description = pdfMetadata.subject?.trim();
  let genre = "Fiction"; // Default genre

  const filenameWithoutExt = filename.replace(/\.[^/.]+$/, "");

  // Fallback to "Author - Title" format if metadata is missing
  if ((!title || !authorName) && filenameWithoutExt.includes("-")) {
    const parts = filenameWithoutExt.split("-").map(p => p.trim());
    if (parts.length >= 2) {
      if (!authorName) authorName = parts[0];
      if (!title) title = parts.slice(1).join(" ");
    }
  }

  // Final fallbacks
  if (!title) title = filenameWithoutExt;
  if (!authorName) authorName = "Unknown Author";
  if (!description) {
    if (extractedText && extractedText.trim().length > 0) {
      const cleanText = extractedText.replace(/\s+/g, " ").trim();
      description = cleanText.substring(0, 500) + (cleanText.length > 500 ? "..." : "");
    } else {
      description = "Uploaded book from bulk import.";
    }
  }

  return { title, authorName, genre, description };
}

async function main() {
  let dirPath = "./books_to_upload";
  let email = "";

  // Parse arguments manually
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === "--dir") {
      dirPath = process.argv[i + 1];
    }
    if (process.argv[i] === "--email") {
      email = process.argv[i + 1];
    }
  }

  console.log(`Scanning directory: ${dirPath}`);
  
  if (!fs.existsSync(dirPath)) {
    console.error(`Error: Directory not found at ${dirPath}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dirPath).filter(file => file.toLowerCase().endsWith(".pdf"));
  if (files.length === 0) {
    console.log("No PDF files found in the directory.");
    process.exit(0);
  }

  console.log(`Found ${files.length} book(s) to process.`);

  // Find target user to associate with uploads
  let user = null;
  if (email) {
    user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.warn(`Warning: User with email '${email}' not found. Falling back to role-based selection.`);
    }
  }

  if (!user) {
    user = await prisma.user.findFirst({
      where: {
        role: { in: ["ADMIN", "AUTHOR"] }
      }
    });
  }

  if (!user) {
    user = await prisma.user.findFirst();
  }

  if (!user) {
    console.error("Error: No users found in the database. Please create a user or run seeds first.");
    process.exit(1);
  }

  console.log(`Books will be associated with user: ${user.username} (${user.email})`);

  for (let idx = 0; idx < files.length; idx++) {
    const file = files[idx];
    const pdfPath = path.join(dirPath, file);
    console.log(`\n========================================`);
    console.log(`[${idx + 1}/${files.length}] Processing: ${file}`);
    console.log(`========================================`);

    const tempCoverPath = path.join(os.tmpdir(), `cover-${Date.now()}-${randomUUID().slice(0, 8)}.png`);

    try {
      // 1. Run python helper for PDF extraction & rendering
      console.log("Extracting PDF cover and first-page text...");
      const pythonScriptPath = path.join(__dirname, "extract_pdf.py");
      
      const pythonOutput = execFileSync("python", [
        pythonScriptPath,
        "--file",
        pdfPath,
        "--out-cover",
        tempCoverPath
      ], { encoding: "utf-8" });

      const extractionResult = JSON.parse(pythonOutput);
      if (!extractionResult.success) {
        throw new Error(extractionResult.error || "Failed to parse PDF");
      }

      console.log("PDF parsed successfully. Characters extracted:", extractionResult.text.length);

      // 2. Extract metadata locally
      const metadata = extractMetadataLocal(file, extractionResult.pdfMetadata, extractionResult.text);
      console.log("Extracted Metadata:");
      console.log(`  - Title: ${metadata.title}`);
      console.log(`  - Author: ${metadata.authorName}`);
      console.log(`  - Genre: ${metadata.genre}`);
      console.log(`  - Description: ${metadata.description}`);

      // 3. Check for duplicate BEFORE uploading to R2 (to avoid wasting bandwidth)
      const existingBook = await prisma.book.findFirst({
        where: {
          title: { equals: metadata.title, mode: "insensitive" },
          authorName: { equals: metadata.authorName, mode: "insensitive" }
        }
      });

      if (existingBook) {
        console.warn(`⏭️  SKIPPED: "${metadata.title}" by "${metadata.authorName}" already exists in database.`);
        skipCount++;
        continue;
      }

      // 4. Upload PDF and cover to R2
      console.log("Uploading files to Cloudflare R2...");
      const pdfBuffer = fs.readFileSync(pdfPath);
      const coverBuffer = fs.readFileSync(tempCoverPath);

      const sanitizedPdfName = sanitizeFilename(file);
      const pdfKey = `books/${user.id}/${Date.now()}-${randomUUID()}-${sanitizedPdfName}`;
      const coverKey = `covers/${user.id}/${Date.now()}-${randomUUID()}-${sanitizedPdfName.replace(".pdf", "")}.png`;

      console.log("  Uploading PDF...");
      const pdfUrl = await uploadToR2(pdfKey, pdfBuffer, "application/pdf");
      console.log(`  PDF URL: ${pdfUrl}`);

      console.log("  Uploading Cover...");
      const coverUrl = await uploadToR2(coverKey, coverBuffer, "image/png");
      console.log(`  Cover URL: ${coverUrl}`);

      // 5. Save to PostgreSQL database via Prisma
      console.log("Registering book in database...");

      const book = await prisma.book.create({
        data: {
          title: metadata.title,
          authorName: metadata.authorName,
          coverUrl: coverUrl,
          fileUrl: pdfUrl,
          fileType: FileType.PDF,
          genre: metadata.genre,
          language: "English",
          description: metadata.description,
          uploadedById: user.id
        }
      });

      console.log(`✅ Successfully registered book (ID: ${book.id}) in database.`);
      successCount++;


    } catch (e: any) {
      console.error(`❌ Error processing book ${file}:`, e.message || e);
      errorCount++;
    } finally {
      // Clean up temp cover file
      if (fs.existsSync(tempCoverPath)) {
        try { fs.unlinkSync(tempCoverPath); } catch {}
      }
    }
  }

  console.log("\n========================================");
  console.log("Bulk upload processing finished.");
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ⏭️  Skipped (duplicates): ${skipCount}`);
  console.log(`  ❌ Errors: ${errorCount}`);
  console.log(`  📚 Total processed: ${files.length}`);
  console.log("========================================");
}

main()
  .catch((e) => {
    console.error("Critical execution error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
