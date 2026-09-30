import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { dbUser } = await verifyToken();

    const url = new URL(request.url);
    const genre = url.searchParams.get("genre");
    const excludeGenre = url.searchParams.get("excludeGenre");

    const cacheKey = `author_stories_cache_${dbUser.id}_${genre || 'all'}_${excludeGenre || 'none'}`;
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

    const whereClause: any = { authorId: dbUser.id };
    
    if (genre) {
      whereClause.genre = genre;
    } else if (excludeGenre) {
      whereClause.OR = [
        { genre: { not: excludeGenre } },
        { genre: null }
      ];
    }

    const stories = await prisma.story.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            chapters: true,
            reactions: true,
            comments: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const responseData = { stories };

    if (redisClient) {
      try {
        await redisClient.set(cacheKey, responseData, { ex: 30 }); // 30 seconds for author dashboard
      } catch (e) {
        console.warn("Redis cache write error:", e);
      }
    }

    return NextResponse.json(responseData);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/users/me/stories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
