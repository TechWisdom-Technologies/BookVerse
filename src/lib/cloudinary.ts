import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary once on module load
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a buffer to Cloudinary.
 * @param buffer  The file buffer to upload.
 * @param folder  The Cloudinary folder (e.g. "bookverse/avatars").
 * @param publicId  Optional public_id (without folder prefix). Auto-generated if omitted.
 * @returns The secure URL of the uploaded image.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  publicId?: string
): Promise<string> {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("Cloudinary is not configured (missing env vars).");
  }

  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        ...(publicId ? { public_id: publicId } : {}),
        resource_type: "image",
        overwrite: true,
        timeout: 60000,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        if (!result?.secure_url) {
          return reject(new Error("Cloudinary upload returned no URL."));
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by its public_id.
 * @param publicId  The full public_id (including folder, e.g. "bookverse/avatars/abc123").
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return; // Silently skip if not configured
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
  }
}

export { cloudinary };
