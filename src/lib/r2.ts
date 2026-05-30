import { DeleteObjectCommand, DeleteObjectsCommand, PutObjectCommand, S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME;
const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

function requireEnv(name: string, value: string | undefined) {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

if (process.env.NODE_ENV === "development") {
  console.log("R2 Config Check:", {
    hasAccountId: !!accountId,
    hasAccessKeyId: !!accessKeyId,
    hasSecretAccessKey: !!secretAccessKey,
    hasBucket: !!bucket,
    hasPublicUrl: !!publicUrl,
  });
}

const r2Client =
  accountId && accessKeyId && secretAccessKey
    ? new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
      })
    : null;

if (!r2Client && process.env.NODE_ENV === "development") {
  console.error("R2 Client initialization failed: Missing required credentials.");
}

export function getR2Url(key: string) {
  if (!publicUrl) throw new Error("Missing env var: CLOUDFLARE_R2_PUBLIC_URL");
  return `${publicUrl.replace(/\/+$/, "")}/${key.replace(/^\/+/, "")}`;
}

export async function uploadToR2(key: string, body: Uint8Array | Buffer, contentType: string) {
  if (!r2Client) throw new Error("R2 client not configured (missing env vars).");
  const Bucket = requireEnv("CLOUDFLARE_R2_BUCKET_NAME", bucket);

  try {
    await r2Client.send(
      new PutObjectCommand({
        Bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );
  } catch (error) {
    console.error("R2 Upload Error:", error);
    throw error;
  }

  return getR2Url(key);
}

export async function deleteFromR2(key: string) {
  if (!r2Client) throw new Error("R2 client not configured (missing env vars).");
  const Bucket = requireEnv("CLOUDFLARE_R2_BUCKET_NAME", bucket);

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket,
      Key: key,
    })
  );
}

export async function deleteMultipleFromR2(keys: string[]) {
  if (!r2Client) throw new Error("R2 client not configured (missing env vars).");
  if (keys.length === 0) return;
  const Bucket = requireEnv("CLOUDFLARE_R2_BUCKET_NAME", bucket);

  // AWS S3 allows deleting max 1000 objects per request
  for (let i = 0; i < keys.length; i += 1000) {
    const chunk = keys.slice(i, i + 1000);
    await r2Client.send(
      new DeleteObjectsCommand({
        Bucket,
        Delete: {
          Objects: chunk.map((Key) => ({ Key })),
          Quiet: true,
        },
      })
    );
  }
}

export async function listAllR2Objects(): Promise<string[]> {
  if (!r2Client) throw new Error("R2 client not configured (missing env vars).");
  const Bucket = requireEnv("CLOUDFLARE_R2_BUCKET_NAME", bucket);

  const keys: string[] = [];
  let isTruncated = true;
  let continuationToken: string | undefined = undefined;

  while (isTruncated) {
    const response: any = await r2Client.send(
      new ListObjectsV2Command({
        Bucket,
        ContinuationToken: continuationToken,
      })
    );

    if (response.Contents) {
      for (const item of response.Contents) {
        if (item.Key) keys.push(item.Key);
      }
    }

    isTruncated = response.IsTruncated ?? false;
    continuationToken = response.NextContinuationToken;
  }

  return keys;
}
