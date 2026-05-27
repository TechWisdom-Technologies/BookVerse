import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

/**
 * GET /api/reading-logs/[userId]
 * Fetch reading logs and calculate streaks
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const user = await getAuth();
    if (!user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch reading logs for the past 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const readingLogs = await prisma.readingLog.findMany({
      where: {
        userId,
        date: {
          gte: ninetyDaysAgo,
        },
      },
      orderBy: { date: 'desc' },
    });

    // Calculate current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    // Get all unique dates with logs
    const logDates = new Set(
      readingLogs.map(log => {
        const d = new Date(log.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );

    // Calculate streaks
    for (let i = 0; i < 90; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);

      if (logDates.has(checkDate.getTime())) {
        tempStreak++;
        if (i === 0) {
          currentStreak = tempStreak;
        }
        maxStreak = Math.max(maxStreak, tempStreak);
      } else if (i > 0) {
        tempStreak = 0;
      }
    }

    // Get stats
    const totalPages = readingLogs.reduce((sum, log) => sum + log.pagesRead, 0);
    const totalMinutes = readingLogs.reduce((sum, log) => sum + log.minutes, 0);
    const avgPagesPerSession = readingLogs.length > 0 ? Math.round(totalPages / readingLogs.length) : 0;

    return NextResponse.json({
      currentStreak,
      maxStreak,
      totalPages,
      totalMinutes,
      avgPagesPerSession,
      daysRead: readingLogs.length,
      logs: readingLogs,
    });
  } catch (error) {
    console.error('Error fetching reading logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reading logs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reading-logs/[userId]
 * Log reading activity
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const user = await getAuth();
    if (!user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pagesRead = 0, minutes = 0, date, storyId } = await req.json();

    const logDate = date ? new Date(date) : new Date();
    logDate.setHours(0, 0, 0, 0);

    // Check if entry already exists for this date
    const existing = await prisma.readingLog.findUnique({
      where: {
        userId_date: {
          userId: userId,
          date: logDate,
        },
      },
    });

    let result;
    if (existing) {
      // Update existing entry
      result = await prisma.readingLog.update({
        where: {
          userId_date: {
            userId: userId,
            date: logDate,
          },
        },
        data: {
          pagesRead: Math.max(existing.pagesRead, pagesRead),
          minutes: Math.max(existing.minutes, minutes),
        },
      });
    } else {
      // Create new entry
      result = await prisma.readingLog.create({
        data: {
          userId: userId,
          date: logDate,
          pagesRead,
          minutes,
          storyId, // Optional tracking of the story
        },
      });
    }

    // Send notification to author if storyId exists and it's a new log
    if (storyId) {
      void prisma.story.findUnique({
        where: { id: storyId },
        select: { authorId: true, title: true }
      }).then((story) => {
        if (story && story.authorId !== userId) {
          createNotification({
            userId: story.authorId,
            type: 'READ',
            title: 'Someone is reading your story!',
            message: `A reader just logged a reading session for "${story.title}" (${minutes} minutes).`,
            link: `/stories/${storyId}`,
          });
        }
      });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error logging reading activity:', error);
    return NextResponse.json(
      { error: 'Failed to log reading activity' },
      { status: 500 }
    );
  }
}
