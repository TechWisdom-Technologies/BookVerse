import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';

/**
 * GET /api/author/analytics
 * Fetch analytics for the current author
 */
export async function GET() {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!(await hasFeatureAccess(user, 'CREATOR'))) {
      return NextResponse.json(paidFeatureError('CREATOR'), { status: 402 });
    }

    // Get author's stories with analytics
    const stories = await prisma.story.findMany({
      where: { authorId: user.id },
      include: {
        chapters: {
          select: { id: true },
        },
        reactions: {
          select: { id: true },
        },
        comments: {
          select: { id: true },
        },
        tips: {
          where: { status: 'COMPLETED' },
          select: { amount: true },
        },
      },
    });

    // Calculate analytics
    const totalViews = stories.reduce((sum, s) => sum + s.viewCount, 0);
    const totalStories = stories.length;
    const totalChapters = stories.reduce((sum, s) => sum + s.chapters.length, 0);
    const totalReactions = stories.reduce((sum, s) => sum + s.reactions.length, 0);
    const totalComments = stories.reduce((sum, s) => sum + s.comments.length, 0);
    const totalTipsAmount = stories.reduce(
      (sum, s) => sum + s.tips.reduce((tipSum, t) => tipSum + t.amount, 0),
      0
    );
    const totalTips = stories.reduce((sum, s) => sum + s.tips.length, 0);

    // Get subscriber count
    const subscribers = await prisma.newsletterSubscriber.count({
      where: { authorId: user.id },
    });

    // Get follower count
    const followers = await prisma.follow.count({
      where: { followingId: user.id },
    });

    // Top performing stories
    const topStories = stories
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map(s => ({
        id: s.id,
        title: s.title,
        views: s.viewCount,
        reactions: s.reactions.length,
        comments: s.comments.length,
        tips: s.tips.reduce((sum, t) => sum + t.amount, 0),
      }));

    // ==========================================
    // ADVANCED METRICS QUERY FOR ANALYTICS
    // ==========================================

    // ==========================================
    // 5 MORE ADVANCED ANALYTICS FEATURES (API)
    // ==========================================

    // Feature 1: Share Platforms & Amplification (100% Dynamic & Genuine)
    const dbShares = await prisma.shareActivity.findMany({
      where: { story: { authorId: user.id } },
      select: { platform: true }
    });

    const shareCounts = dbShares.reduce((acc: Record<string, number>, share) => {
      const p = share.platform.toUpperCase();
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {});

    const viralAmplification = {
      shares: {
        Twitter: shareCounts.TWITTER || 0,
        Instagram: shareCounts.INSTAGRAM || 0,
        Facebook: shareCounts.FACEBOOK || 0,
        TikTok: shareCounts.TIKTOK || 0
      },
      totalShares: dbShares.length,
      amplificationScore: totalViews > 0 ? (dbShares.length / totalViews) * 100 : 0
    };

    // Feature 2: Reading Session Durations & Focus Indexes (100% Dynamic & Genuine)
    const dbReadingLogs = await prisma.readingLog.findMany({
      where: {
        storyId: { in: stories.map(s => s.id) }
      },
      select: { pagesRead: true, minutes: true }
    });

    const totalLogsCount = dbReadingLogs.length;
    const avgPagesRead = totalLogsCount > 0 
      ? dbReadingLogs.reduce((sum, log) => sum + log.pagesRead, 0) / totalLogsCount 
      : 0;
    const avgMinutesRead = totalLogsCount > 0 
      ? dbReadingLogs.reduce((sum, log) => sum + log.minutes, 0) / totalLogsCount 
      : 0;

    const focusScore = avgMinutesRead > 0 ? Math.min(100, Math.max(0, (avgPagesRead / avgMinutesRead) * 100)) : 0;

    const focusIndex = {
      avgPagesPerSession: avgPagesRead,
      avgMinutesPerSession: avgMinutesRead,
      focusScore
    };

    // Feature 3: Reader Annotation Heatmaps (100% Dynamic & Genuine)
    const dbAnnotations = await prisma.bookAnnotation.findMany({
      where: {
        bookId: { in: stories.map(s => s.id) }
      },
      select: { type: true, highlightColor: true }
    });

    const annotationCounts = dbAnnotations.reduce((acc: Record<string, number>, ann) => {
      acc[ann.type] = (acc[ann.type] || 0) + 1;
      return acc;
    }, {});

    const highlightColors = dbAnnotations.reduce((acc: Record<string, number>, ann) => {
      if (ann.highlightColor) {
        const c = ann.highlightColor.toLowerCase();
        acc[c] = (acc[c] || 0) + 1;
      }
      return acc;
    }, {});

    const annotationsHeatmap = {
      bookmarks: annotationCounts.BOOKMARK || 0,
      highlights: annotationCounts.HIGHLIGHT || 0,
      notes: annotationCounts.NOTE || 0,
      totalAnnotations: dbAnnotations.length,
      colors: {
        yellow: highlightColors.yellow || 0,
        green: highlightColors.green || 0,
        blue: highlightColors.blue || 0,
        pink: highlightColors.pink || 0,
      }
    };

    // Feature 4: Interactive Cohort Retention Attrition Matrix (100% Dynamic & Genuine)
    const authorChapters = await prisma.storyChapter.findMany({
      where: { story: { authorId: user.id } },
      select: { id: true, chapterOrder: true, title: true },
      orderBy: { chapterOrder: 'asc' }
    });

    const dbReadingProgress = await prisma.readingProgress.findMany({
      where: { storyId: { in: stories.map(s => s.id) } },
      select: { chapterId: true }
    });

    const progressChapters = dbReadingProgress.map(rp => {
      const match = authorChapters.find(ch => ch.id === rp.chapterId);
      return match ? match.chapterOrder : null;
    }).filter((order): order is number => order !== null);

    const maxChapterOrder = authorChapters.reduce((max, ch) => Math.max(max, ch.chapterOrder), 1);
    const retentionCohorts = [];

    const baseCount = progressChapters.filter(order => order >= 1).length;

    for (let order = 1; order <= Math.min(6, maxChapterOrder); order++) {
      const reachedCount = progressChapters.filter(o => o >= order).length;
      const rate = baseCount > 0 ? Math.round((reachedCount / baseCount) * 100) : 0;
      
      const chapterTitle = authorChapters.find(ch => ch.chapterOrder === order)?.title || `Chapter ${order}`;
      retentionCohorts.push({
        chapter: `Ch ${order}: ${chapterTitle}`,
        rate
      });
    }

    const cohortRetention = retentionCohorts;

    // Feature 4: Sentiment Distribution Grouping
    const sentimentGroups = await prisma.storyReaction.groupBy({
      by: ['reactionType'],
      where: { story: { authorId: user.id } },
      _count: { id: true },
    });

    // Feature 5: Reading Completion Progress
    const readingProgressStats = await prisma.readingProgress.aggregate({
      where: {
        storyId: { in: stories.map(s => s.id) },
      },
      _avg: { percentage: true },
    });

    const readingProgressCount = await prisma.readingProgress.count({
      where: {
        storyId: { in: stories.map(s => s.id) },
      },
    });

    return NextResponse.json({
      stats: {
        totalViews,
        totalStories,
        totalChapters,
        totalReactions,
        totalComments,
        totalTipsAmount,
        totalTips,
        subscribers,
        followers,
      },
      topStories,
      stories: stories.map(s => ({
        id: s.id,
        title: s.title,
        published: s.published,
        views: s.viewCount,
        reactions: s.reactions.length,
        comments: s.comments.length,
        chapters: s.chapters.length,
        tips: s.tips.reduce((sum, t) => sum + t.amount, 0),
      })),
      sentimentDistribution: sentimentGroups,
      readingCompletion: {
        averageProgress: readingProgressStats._avg?.percentage || 0,
        trackedReaders: readingProgressCount,
      },
      // New Analytical Telemetries
      viralAmplification,
      focusIndex,
      annotationsHeatmap,
      cohortRetention
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
