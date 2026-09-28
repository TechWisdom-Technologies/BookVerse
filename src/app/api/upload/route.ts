import { NextRequest, NextResponse } from "next/server";
import { withPerformanceLogger } from "@/lib/api-logger";
import { randomUUID } from "crypto";
import { Role } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import { uploadToR2 } from "@/lib/r2";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_COVER_SIZE = 5 * 1024 * 1024;
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const MAX_BOOK_SIZE = 100 * 1024 * 1024;
const VALID_KINDS = ["cover", "book-cover", "book", "avatar"] as const;

type UploadKind = (typeof VALID_KINDS)[number];

function sanitizeFilename(filename: string) {
  return (
    filename
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "") || "upload"
  );
}

function isAuthorOrAdmin(role: Role) {
  return role === Role.AUTHOR || role === Role.ADMIN;
}

function isUploadKind(value: string): value is UploadKind {
  return VALID_KINDS.includes(value as UploadKind);
}

function getExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

function validateFile(file: File, kind: UploadKind) {
  const extension = getExtension(file.name);

  if (kind === "cover" || kind === "book-cover") {
    if (file.size > MAX_COVER_SIZE) return "Cover image must be smaller than 5 MB.";
    if (!file.type.startsWith("image/")) return "Cover must be an image file.";
    return null;
  }

  if (kind === "avatar") {
    if (file.size > MAX_AVATAR_SIZE) return "Avatar must be smaller than 5 MB.";
    if (!file.type.startsWith("image/")) return "Avatar must be an image file.";
    return null;
  }

  if (file.size > MAX_BOOK_SIZE) return "Book file must be smaller than 100 MB.";

  const isPdf = extension === "pdf" && file.type === "application/pdf";
  const isEpub =
    extension === "epub" &&
    (file.type === "application/epub+zip" || file.type === "application/octet-stream");

  if (!isPdf && !isEpub) {
    return "Book file must be a valid PDF or EPUB.";
  }

  return null;
}

const postHandler = async (request: NextRequest) => {
  // Rate limit: 10 uploads per minute per IP
  const limitRes = await checkRateLimit(10, 60000);
  if (limitRes.limited) return limitRes.response;

  try {
    const { dbUser } = await verifyToken();

    const formData = await request.formData();
    const file = formData.get("file");
    const kindValue = String(formData.get("kind") || "book");

    // Avatar uploads allowed for all authenticated users
    // Book/cover uploads require AUTHOR or ADMIN role
    if (kindValue !== "avatar" && kindValue !== "cover" && !isAuthorOrAdmin(dbUser.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!isUploadKind(kindValue)) {
      return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
    }

    const validationError = validateFile(file, kindValue);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const fileName = sanitizeFilename(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());

    let url: string;
    let key: string;

    if (kindValue === "avatar") {
      // Avatars go to Cloudinary for optimized image delivery
      const publicId = `${dbUser.id}-${Date.now()}`;
      url = await uploadToCloudinary(buffer, "bookverse/avatars", publicId);
      key = `bookverse/avatars/${publicId}`;
    } else if (kindValue === "cover") {
      // Story/club/universe/series covers go to Cloudinary
      const publicId = `cover-${dbUser.id}-${Date.now()}`;
      url = await uploadToCloudinary(buffer, "bookverse/covers", publicId);
      key = `bookverse/covers/${publicId}`;
    } else {
      // Books (PDF/EPUB) and book-covers go to Cloudflare R2
      const folder = kindValue === "book-cover" ? "covers" : "books";
      key = `${folder}/${dbUser.id}/${Date.now()}-${randomUUID()}-${fileName}`;
      url = await uploadToR2(key, buffer, file.type || "application/octet-stream");
    }

    return NextResponse.json({ url, key }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("POST /api/upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
};

export const POST = withPerformanceLogger(postHandler as any, "/api/upload");
