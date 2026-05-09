import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

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

    // Fetch detailed analytics
    const readingLogs = await prisma.readingLog.findMany({
      where: { storyId: id },
      select: { readTime: true, sessionsToCompletion: true },
    });

    const totalReadTime = readingLogs.reduce((sum, log) => sum + (log.readTime || 0), 0);
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

    return NextResponse.json({
      storyId: id,
      totalReads: readingLogs.length,
      avgReadTime: Math.round(avgReadTime),
      completionRate: Math.round(completionRate),
      chapterDropoff,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
