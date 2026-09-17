import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { listAllR2ObjectsWithMetadata } from "@/lib/r2";
import { v2 as cloudinary } from "cloudinary";

export type StorageFile = {
  id: string;
  name: string;
  sizeBytes: number;
  type: "image" | "video" | "document" | "database" | "other";
  source: "r2" | "cloudinary" | "postgres";
  lastModified?: Date | string;
};

function getFileTypeFromExtension(filename: string): StorageFile["type"] {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) return 'video';
  if (['pdf', 'epub', 'txt', 'md', 'doc', 'docx'].includes(ext)) return 'document';
  return 'other';
}

export async function GET(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allFiles: StorageFile[] = [];

    // 1. Fetch DB Tables
    try {
      const dbTables: any = await prisma.$queryRaw`
        SELECT relname::text as name, pg_total_relation_size(relid) as size
        FROM pg_catalog.pg_statio_user_tables
      `;
      if (Array.isArray(dbTables)) {
        for (const table of dbTables) {
          allFiles.push({
            id: `db-${table.name}`,
            name: `${table.name} (Table)`,
            sizeBytes: Number(table.size) || 0,
            type: "database",
            source: "postgres",
          });
        }
      }
    } catch (e) {
      console.error("Failed to fetch DB tables:", e);
    }

    // 2. Fetch R2 Objects
    try {
      const r2Objects = await listAllR2ObjectsWithMetadata();
      for (const obj of r2Objects) {
        allFiles.push({
          id: `r2-${obj.key}`,
          name: obj.key,
          sizeBytes: obj.size,
          type: getFileTypeFromExtension(obj.key),
          source: "r2",
          lastModified: obj.lastModified,
        });
      }
    } catch (e) {
      console.error("Failed to fetch R2 objects:", e);
    }

    // 3. Fetch Cloudinary Files
    try {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        
        // Fetch images and videos
        const [imageRes, videoRes] = await Promise.all([
          cloudinary.api.resources({ resource_type: "image", max_results: 500 }),
          cloudinary.api.resources({ resource_type: "video", max_results: 500 })
        ]);

        const processCloudinary = (resources: any[], type: StorageFile["type"]) => {
          for (const res of resources) {
            allFiles.push({
              id: `cloudinary-${res.public_id}`,
              name: `${res.public_id}.${res.format}`,
              sizeBytes: res.bytes,
              type: type,
              source: "cloudinary",
              lastModified: res.created_at,
            });
          }
        };

        if (imageRes?.resources) processCloudinary(imageRes.resources, "image");
        if (videoRes?.resources) processCloudinary(videoRes.resources, "video");
      }
    } catch (e) {
      console.error("Failed to fetch Cloudinary files:", e);
    }

    // Sort by size descending
    allFiles.sort((a, b) => b.sizeBytes - a.sizeBytes);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Return paginated slice
    const paginatedFiles = allFiles.slice(startIndex, endIndex);

    return NextResponse.json({ files: paginatedFiles, total: allFiles.length });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/storage/files error:", error);
    return NextResponse.json(
      { error: "Failed to fetch storage files" },
      { status: 500 }
    );
  }
}
