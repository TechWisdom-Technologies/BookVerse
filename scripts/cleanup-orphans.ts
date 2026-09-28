import { PrismaClient } from "../src/generated/client";
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { v2 as cloudinary } from "cloudinary";
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
  console.error("Missing R2 credentials.");
  process.exit(1);
}

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Missing Cloudinary credentials.");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// Helper to extract Cloudinary public_id
function extractCloudinaryId(url: string | null): string | null {
  if (!url) return null;
  if (!url.includes("res.cloudinary.com")) return null;
  // Match the version number and the path after it up to the extension
  const match = url.match(/\/v\d+\/(.+?)\.[a-zA-Z]+$/);
  return match && match[1] ? match[1] : null;
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  console.log("Fetching active files from the database...");
  
  const books = await prisma.book.findMany({ select: { fileUrl: true, coverUrl: true } });
  const stories = await prisma.story.findMany({ select: { coverUrl: true } });
  const universes = await prisma.universe.findMany({ select: { coverUrl: true } });
  const series = await prisma.series.findMany({ select: { coverUrl: true } });
  const clubs = await prisma.club.findMany({ select: { coverUrl: true } });
  const chapters = await prisma.storyChapter.findMany({ select: { illustrationUrl: true } });
  const users = await prisma.user.findMany({ select: { avatarUrl: true } });

  const activeR2Keys = new Set<string>();
  const activeCloudinaryIds = new Set<string>();

  const processUrl = (url: string | null) => {
    if (!url) return;
    if (url.includes("res.cloudinary.com")) {
      const cId = extractCloudinaryId(url);
      if (cId) activeCloudinaryIds.add(cId);
    } else if (url.includes(publicUrl.replace("https://", "")) || url.includes("r2.dev")) {
      const rKey = extractKeyFromUrl(url);
      if (rKey) activeR2Keys.add(rKey);
    }
  };

  books.forEach(b => { processUrl(b.fileUrl); processUrl(b.coverUrl); });
  stories.forEach(s => processUrl(s.coverUrl));
  universes.forEach(u => processUrl(u.coverUrl));
  series.forEach(s => processUrl(s.coverUrl));
  clubs.forEach(c => processUrl(c.coverUrl));
  chapters.forEach(c => processUrl(c.illustrationUrl));
  users.forEach(u => processUrl(u.avatarUrl));

  console.log(`\n==========================================`);
  console.log(`Database Active Assets Found:`);
  console.log(`  Cloudflare R2 : ${activeR2Keys.size} files`);
  console.log(`  Cloudinary    : ${activeCloudinaryIds.size} files`);
  console.log(`==========================================\n`);

  // ----------------------------------------------------
  // PHASE 1: CLOUDFLARE R2 CLEANUP
  // ----------------------------------------------------
  console.log("Scanning Cloudflare R2 bucket for all files...");
  let r2ContinuationToken: string | undefined = undefined;
  const allBucketKeys: string[] = [];

  do {
    const response = await r2Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: r2ContinuationToken,
      })
    );

    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key) allBucketKeys.push(obj.Key);
      }
    }
    r2ContinuationToken = response.NextContinuationToken;
  } while (r2ContinuationToken);

  console.log(`Found ${allBucketKeys.length} total files in your R2 bucket.`);

  // Find R2 orphans
  const r2Orphans = allBucketKeys.filter(key => !activeR2Keys.has(key));

  if (r2Orphans.length === 0) {
    console.log("🎉 R2 is perfectly clean! No orphaned files.");
  } else {
    console.log(`Found ${r2Orphans.length} orphaned file(s) in R2.`);
    if (isDryRun) {
      console.log("⚠️ DRY RUN: Skipping deletion for R2 orphans.");
    } else {
      console.log(`Deleting ${r2Orphans.length} orphaned file(s) from R2...`);
      const batchSize = 1000;
      for (let i = 0; i < r2Orphans.length; i += batchSize) {
        const batch = r2Orphans.slice(i, i + batchSize);
        await r2Client.send(
          new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: { Objects: batch.map(key => ({ Key: key })), Quiet: true },
          })
        );
      }
      console.log(`✅ Successfully deleted ${r2Orphans.length} orphaned file(s) from R2.`);
    }
  }

  // ----------------------------------------------------
  // PHASE 2: CLOUDINARY CLEANUP
  // ----------------------------------------------------
  console.log("\nScanning Cloudinary account for all files...");
  
  let cloudinaryNextCursor: string | undefined = undefined;
  const allCloudinaryIds: string[] = [];
  
  try {
    do {
      const response = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'bookverse/', // Our root folder
        max_results: 500,
        next_cursor: cloudinaryNextCursor,
      });

      if (response.resources) {
        response.resources.forEach((r: any) => {
          allCloudinaryIds.push(r.public_id);
        });
      }
      cloudinaryNextCursor = response.next_cursor;
    } while (cloudinaryNextCursor);

    console.log(`Found ${allCloudinaryIds.length} total files in your Cloudinary 'bookverse/' folder.`);

    // Find Cloudinary orphans
    const cloudinaryOrphans = allCloudinaryIds.filter(id => !activeCloudinaryIds.has(id));

    if (cloudinaryOrphans.length === 0) {
      console.log("🎉 Cloudinary is perfectly clean! No orphaned files.");
    } else {
      console.log(`Found ${cloudinaryOrphans.length} orphaned file(s) in Cloudinary.`);
      if (isDryRun) {
        console.log("⚠️ DRY RUN: Skipping deletion for Cloudinary orphans.");
      } else {
        console.log(`Deleting ${cloudinaryOrphans.length} orphaned file(s) from Cloudinary...`);
        // Cloudinary bulk delete takes up to 100 public_ids at a time
        const batchSize = 100;
        for (let i = 0; i < cloudinaryOrphans.length; i += batchSize) {
          const batch = cloudinaryOrphans.slice(i, i + batchSize);
          await cloudinary.api.delete_resources(batch);
        }
        console.log(`✅ Successfully deleted ${cloudinaryOrphans.length} orphaned file(s) from Cloudinary.`);
      }
    }
  } catch (err) {
    console.error("Cloudinary scan failed:", err);
  }

  console.log("\nAll Done!");
}

main()
  .catch(e => {
    console.error("Error running cleanup script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
