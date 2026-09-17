import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { calculateTotalR2Size } from "@/lib/r2";
import { unstable_cache } from "next/cache";
import { Redis } from "@upstash/redis";
import { v2 as cloudinary } from "cloudinary";

const getCachedDatabaseSize = unstable_cache(
  async () => {
    try {
      const result: any = await prisma.$queryRaw`SELECT pg_database_size(current_database()) as size;`;
      if (Array.isArray(result) && result.length > 0) {
        return Number(result[0].size);
      }
      return 0;
    } catch (error) {
      console.error("Failed to fetch database size:", error);
      return 0;
    }
  },
  ["admin-storage-db-size"],
  { revalidate: 300 }
);

const getCachedR2Size = unstable_cache(
  async () => {
    try {
      return await calculateTotalR2Size();
    } catch (error) {
      console.error("Failed to fetch R2 size:", error);
      return 0;
    }
  },
  ["admin-storage-r2-size"],
  { revalidate: 300 }
);

const getCachedRedisSize = unstable_cache(
  async () => {
    try {
      const url = process.env.UPSTASH_REDIS_REST_URL;
      const token = process.env.UPSTASH_REDIS_REST_TOKEN;
      if (!url || !token) return 0;
      
      const response = await fetch(`${url.replace(/\/$/, '')}/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(["INFO", "memory"]),
      });
      
      if (!response.ok) return 0;
      const data = await response.json();
      const info = data.result;
      const match = typeof info === 'string' ? info.match(/used_memory:(\d+)/) : null;
      return match ? parseInt(match[1], 10) : 0;
    } catch (error) {
      console.error("Failed to fetch Redis size:", error);
      return 0;
    }
  },
  ["admin-storage-redis-size"],
  { revalidate: 300 }
);

const getCachedCloudinarySize = unstable_cache(
  async () => {
    try {
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return 0;
      }
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      const usage = await cloudinary.api.usage();
      return usage?.storage?.usage || 0;
    } catch (error) {
      console.error("Failed to fetch Cloudinary size:", error);
      return 0;
    }
  },
  ["admin-storage-cloudinary-size"],
  { revalidate: 300 }
);

export async function GET(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [dbSize, r2Size, redisSize, cloudinarySize] = await Promise.all([
      getCachedDatabaseSize(),
      getCachedR2Size(),
      getCachedRedisSize(),
      getCachedCloudinarySize(),
    ]);

    return NextResponse.json({
      databaseSizeBytes: dbSize,
      r2SizeBytes: r2Size,
      redisSizeBytes: redisSize,
      cloudinarySizeBytes: cloudinarySize,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/storage error:", error);
    return NextResponse.json(
      { error: "Failed to fetch storage stats" },
      { status: 500 }
    );
  }
}
