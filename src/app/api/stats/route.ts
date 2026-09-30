import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cacheKey = "stats_cache_global";
    let redisClient: any = null;

    try {
      const { Redis } = await import("@upstash/redis");
      redisClient = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return NextResponse.json(cached);
      }
    } catch (e) {
      console.warn("Redis cache read error:", e);
    }

    const [totalBooks, totalAuthors, totalUsers] = await Promise.all([
      prisma.book.count(),
      prisma.user.count({ where: { role: 'AUTHOR' } }),
      prisma.user.count(),
    ]);

    const responseData = { totalBooks, totalAuthors, totalUsers };

    if (redisClient) {
      try {
        await redisClient.set(cacheKey, responseData, { ex: 3600 }); // Cache for 1 hour
      } catch (e) {
        console.warn("Redis cache write error:", e);
      }
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
