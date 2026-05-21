import { PrismaClient, FileType } from "@prisma/client";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import os from "os";
import { execFileSync } from "child_process";
import { randomUUID } from "crypto";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import OpenAI from "openai";
import { uploadToR2 } from "../src/lib/r2";
import { indexBook } from "../src/lib/meilisearch";

// Load environment variables (supports .env.local and .env)
config({ path: ".env.local" });
config({ path: ".env" });

const prisma = new PrismaClient();

// Rate limit: wait between AI API calls to avoid 429 errors
const AI_DELAY_MS = 3000; // 3 seconds between each AI call
let successCount = 0;
let skipCount = 0;
let errorCount = 0;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sanitizeFilename(filename: string) {
  return (
    filename
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "") || "upload"
  );
}

async function extractMetadata(
  filename: string,
  pdfMetadata: { title?: string; author?: string; subject?: string },
  extractedText: string
): Promise<{ title: string; authorName: string; genre: string; description: string }> {
  const prompt = `You are a professional librarian. Extract metadata for a book using the provided sources (which may include text from the book's first few pages, PDF metadata properties, and the file name).

Sources:
- File Name: "${filename}"
- PDF Properties Metadata: ${JSON.stringify(pdfMetadata)}
- Extracted Book Text:
---
${extractedText}
---

Your task is to extract:
1. Title of the book (key: "title"). Rely heavily on the file name and PDF metadata properties if the extracted book text is empty or sparse. Clean up any file extensions (like .pdf) or formatting in the title.
2. Author's name (key: "authorName"). If unknown, use "Unknown".
3. Genre (key: "genre"). Pick one of the following genres: Mystery, Sci-Fi, Fantasy, Romance, Epic Fantasy, Psychology, Historical Fiction, Cyberpunk, Thriller, Horror, Biography, Self-Help, Business, Non-Fiction, Fiction.
4. Description (key: "description") - a short 1-2 sentence summary of the book. If you have no text, write a brief, general description based on the title and genre.

Respond ONLY with a JSON object. No markdown formatting, no backticks, no comments.
Format:
{
  "title": "...",
  "authorName": "...",
  "genre": "...",
  "description": "..."
}
`;

  // 1. Try Groq (Llama-3.3-70b-versatile)
  if (process.env.GROQ_API_KEY) {
    try {
      console.log("Using Groq API to extract metadata...");
      const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
      const { text } = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        system: "You are a professional librarian AI. You extract structured book metadata. Always respond with pure JSON and nothing else.",
        prompt,
      });
      return parseJsonString(text);
    } catch (e: any) {
      // If rate limited, wait and retry once
      if (e?.statusCode === 429 || e?.cause?.statusCode === 429 || e?.data?.error?.code === "rate_limit_exceeded") {
        const retryAfter = parseInt(e?.responseHeaders?.["retry-after"] || "60", 10);
        console.warn(`Groq rate limited. Waiting ${retryAfter + 5} seconds before retry...`);
        await sleep((retryAfter + 5) * 1000);
        try {
          const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
          const { text } = await generateText({
            model: groq("llama-3.3-70b-versatile"),
            system: "You are a professional librarian AI. You extract structured book metadata. Always respond with pure JSON and nothing else.",
            prompt,
          });
          return parseJsonString(text);
        } catch (retryErr) {
          console.warn("Groq retry also failed, trying OpenAI fallback...");
        }
      } else {
        console.warn("Groq metadata extraction failed, trying OpenAI fallback...", e.message || e);
      }
    }
  }

  // 2. Fallback to OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      console.log("Using OpenAI API to extract metadata...");
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a professional librarian AI. You extract structured book metadata. Always respond with pure JSON and nothing else." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });
      const text = response.choices[0]?.message?.content || "{}";
      return parseJsonString(text);
    } catch (e) {
      console.error("OpenAI metadata extraction failed as well.", e);
    }
  }

  throw new Error("No configured AI providers (Groq or OpenAI) available or all failed.");
}

function parseJsonString(text: string) {
  const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const obj = JSON.parse(clean);
  if (!obj.title) obj.title = "Unknown Title";
  if (!obj.authorName) obj.authorName = "Unknown Author";
  if (!obj.genre) obj.genre = "Fiction";
  if (!obj.description) obj.description = "";
  return obj;
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

      // 2. Call LLM for metadata (with rate limiting delay)
      await sleep(AI_DELAY_MS);
      const metadata = await extractMetadata(file, extractionResult.pdfMetadata, extractionResult.text);
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

      // 6. Index in Meilisearch
      try {
        await indexBook({
          id: book.id,
          title: book.title,
          authorName: book.authorName,
          genre: book.genre,
          language: book.language,
          description: book.description,
          coverUrl: book.coverUrl,
          fileType: book.fileType,
          createdAt: book.createdAt.toISOString(),
          downloadCount: book.downloadCount,
        });
      } catch (meiliError) {
        // Meilisearch is optional, don't fail the whole upload
      }

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
