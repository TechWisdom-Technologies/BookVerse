import { S3Client, ListObjectsV2Command, GetObjectCommand, ListObjectsV2CommandOutput, GetObjectCommandOutput } from "@aws-sdk/client-s3";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { pipeline } from "stream/promises";

// Load environment variables
config({ path: ".env.local" });
config({ path: ".env" });

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { 
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!, 
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY! 
  },
});
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  console.log("Starting full media extraction (Cloudflare R2 & Cloudinary)...");

  // Create timestamped directory
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupRoot = path.join(process.cwd(), "backups");
  if (!fs.existsSync(backupRoot)) fs.mkdirSync(backupRoot);

  const mediaBackupDir = path.join(backupRoot, `media-backup-${timestamp}`);
  fs.mkdirSync(mediaBackupDir);
  
  const r2Dir = path.join(mediaBackupDir, "cloudflare-r2");
  const cloudDir = path.join(mediaBackupDir, "cloudinary");
  fs.mkdirSync(r2Dir);
  fs.mkdirSync(cloudDir);

  console.log(`\n========================================`);
  console.log(`[1/2] Backing up Cloudflare R2...`);
  console.log(`========================================`);
  
  let r2ContinuationToken: string | undefined = undefined;
  const allR2Keys: string[] = [];
  do {
    const response: ListObjectsV2CommandOutput = await r2Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: r2ContinuationToken,
      })
    );
    if (response.Contents) {
      for (const obj of response.Contents) {
        if (obj.Key) allR2Keys.push(obj.Key);
      }
    }
    r2ContinuationToken = response.NextContinuationToken;
  } while (r2ContinuationToken);

  console.log(`Found ${allR2Keys.length} files in R2.`);

  for (let i = 0; i < allR2Keys.length; i++) {
    const key = allR2Keys[i];
    console.log(`  -> Downloading [${i + 1}/${allR2Keys.length}]: ${key}`);
    try {
      const response: GetObjectCommandOutput = await r2Client.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));
      
      // Ensure nested directories exist
      const filePath = path.join(r2Dir, key);
      const fileDir = path.dirname(filePath);
      if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir, { recursive: true });
      }

      if (response.Body) {
        // @ts-ignore - S3 streams are compatible with Node pipelines
        await pipeline(response.Body, fs.createWriteStream(filePath));
      }
    } catch (err) {
      console.error(`     [ERROR] Failed to download ${key}:`, err);
    }
  }

  console.log(`\n========================================`);
  console.log(`[2/2] Backing up Cloudinary...`);
  console.log(`========================================`);
  
  const cloudinaryFiles: any[] = [];
  let cloudCursor: string | undefined = undefined;

  do {
    const result = await cloudinary.api.resources({
      max_results: 500,
      next_cursor: cloudCursor,
    });
    cloudinaryFiles.push(...result.resources);
    cloudCursor = result.next_cursor;
  } while (cloudCursor);

  console.log(`Found ${cloudinaryFiles.length} files in Cloudinary.`);

  for (let i = 0; i < cloudinaryFiles.length; i++) {
    const file = cloudinaryFiles[i];
    const fileName = `${file.public_id}.${file.format}`; // e.g. folder/image.jpg
    console.log(`  -> Downloading [${i + 1}/${cloudinaryFiles.length}]: ${fileName}`);
    
    try {
      const filePath = path.join(cloudDir, fileName.replace(/\//g, "-")); // Flatten folders for simplicity or create dirs
      const res = await fetch(file.secure_url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
    } catch (err) {
      console.error(`     [ERROR] Failed to download ${fileName}:`, err);
    }
  }

  console.log(`\n========================================`);
  console.log(`✅ Media Backup Completed!`);
  console.log(`Files stored in: /backups/media-backup-${timestamp}`);
  console.log(`========================================\n`);
}

main().catch((e) => {
  console.error("Backup failed!", e);
  process.exit(1);
});
