import { PrismaClient } from "../src/generated/client";
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand, ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });
config({ path: ".env" });

const prisma = new PrismaClient();

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || "";

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
  console.error("Missing R2 credentials. Please make sure CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY, and CLOUDFLARE_R2_BUCKET_NAME are set in your environment.");
  process.exit(1);
}

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

// Helper to extract Key from a URL
function extractKeyFromUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const publicBase = publicUrl.replace(/\/+$/, "");
    if (publicBase && url.startsWith(publicBase)) {
      return url.slice(publicBase.length + 1);
    }
    const parsed = new URL(url);
    return parsed.pathname.replace(/^\/+/, "");
  } catch {
    return null;
  }
}

async function main() {
  console.log("Fetching active files from the database...");
  
  const books = await prisma.book.findMany({ select: { fileUrl: true, coverUrl: true } });
  const stories = await prisma.story.findMany({ select: { coverUrl: true } });
  const universes = await prisma.universe.findMany({ select: { coverUrl: true } });
  const series = await prisma.series.findMany({ select: { coverUrl: true } });
  const clubs = await prisma.club.findMany({ select: { coverUrl: true } });
  const chapters = await prisma.storyChapter.findMany({ select: { illustrationUrl: true } });

  const activeKeys = new Set<string>();

  const addKey = (url: string | null) => {
    const key = extractKeyFromUrl(url);
    if (key) activeKeys.add(key);
  };

  books.forEach(b => { addKey(b.fileUrl); addKey(b.coverUrl); });
  stories.forEach(s => addKey(s.coverUrl));
  universes.forEach(u => addKey(u.coverUrl));
  series.forEach(s => addKey(s.coverUrl));
  clubs.forEach(c => addKey(c.coverUrl));
  chapters.forEach(c => addKey(c.illustrationUrl));

  console.log(`Found ${activeKeys.size} total active R2 files registered across all tables.`);

  console.log("Scanning Cloudflare R2 bucket for all files...");
  let continuationToken: string | undefined = undefined;
  const allBucketKeys: string[] = [];

  do {
    const response: ListObjectsV2CommandOutput = await r2Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: continuationToken,
      })
    );


    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key) {
          allBucketKeys.push(obj.Key);
        }
      }
    }
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  console.log(`Found ${allBucketKeys.length} total files in your R2 bucket.`);

  // Find orphans
  const orphans = allBucketKeys.filter(key => {
    // Only check files in books/ or covers/ to avoid deleting other potential app files
    if (!key.startsWith("books/") && !key.startsWith("covers/")) {
      return false;
    }
    return !activeKeys.has(key);
  });

  if (orphans.length === 0) {
    console.log("🎉 No orphaned files found! All files in your R2 bucket are connected to active books in the database.");
    return;
  }

  console.log(`Found ${orphans.length} orphaned file(s) in R2:`);
  orphans.forEach(key => console.log(`  - [Orphan] ${key}`));

  // Ask for confirmation (when executing directly we can prompt, or default to dry-run vs live-run)
  const isDryRun = process.argv.includes("--dry-run");

  if (isDryRun) {
    console.log("\n⚠️  DRY RUN: No files were actually deleted. Run without '--dry-run' to execute the delete operations.");
  } else {
    console.log(`\nDeleting ${orphans.length} orphaned file(s) from R2...`);
    
    // R2 allows deleting objects in batches of up to 1000
    const batchSize = 1000;
    for (let i = 0; i < orphans.length; i += batchSize) {
      const batch = orphans.slice(i, i + batchSize);
      await r2Client.send(
        new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: {
            Objects: batch.map(key => ({ Key: key })),
            Quiet: true,
          },
        })
      );
    }
    console.log(`✅ Successfully deleted ${orphans.length} orphaned file(s) from Cloudflare R2.`);
  }
}

main()
  .catch(e => {
    console.error("Error running cleanup script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export {};

