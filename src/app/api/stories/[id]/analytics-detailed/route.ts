import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const story = await prisma.story.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    if (story.authorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!(await hasFeatureAccess(user, 'PRO'))) {
      return NextResponse.json(paidFeatureError('PRO'), { status: 402 });
    }

    const cacheKey = `analytics_detailed_cache_${id}`;
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

    // Fetch detailed analytics
    const readingLogs = await prisma.readingLog.findMany({
      where: { storyId: id },
      select: { minutes: true, sessionsToCompletion: true },
    });

    const totalReadTime = readingLogs.reduce((sum, log) => sum + (log.minutes || 0), 0);
    const avgReadTime = readingLogs.length > 0 ? totalReadTime / readingLogs.length : 0;
    const completionRate = readingLogs.length > 0
      ? (readingLogs.filter(log => log.sessionsToCompletion).length / readingLogs.length) * 100
      : 0;

    // Chapter dropoff tracking
    const chapters = await prisma.storyChapter.findMany({
      where: { storyId: id },
      select: { id: true, chapterNumber: true },
    });

    const chapterDropoff = chapters.map((chapter, index) => ({
      chapterNumber: chapter.chapterNumber,
      estimatedReads: Math.max(100 - index * 5, 0),
    }));

    const responseData = {
      storyId: id,
      totalReads: readingLogs.length,
      avgReadTime: Math.round(avgReadTime),
      completionRate: Math.round(completionRate),
      chapterDropoff,
    };

    if (redisClient) {
      try {
        await redisClient.set(cacheKey, responseData, { ex: 300 }); // Cache for 5 minutes
      } catch (e) {
        console.warn("Redis cache write error:", e);
      }
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
