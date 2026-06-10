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
        inlineComments: {
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
    const totalComments = stories.reduce((sum, s) => sum + s.comments.length + (s.inlineComments?.length || 0), 0);
    const totalTipsAmount = stories.reduce(
      (sum, s) => sum + s.tips.reduce((tipSum, t) => tipSum + t.amount, 0),
      0
    ) / 100;
    const totalTips = stories.reduce((sum, s) => sum + s.tips.length, 0);

    // Fetch collections
    const universes = await prisma.universe.findMany({
      where: { userId: user.id },
      include: {
        stories: {
          select: { viewCount: true, reactions: { select: { id: true } }, comments: { select: { id: true } } }
        }
      }
    });

    const seriesList = await prisma.series.findMany({
      where: { userId: user.id },
      include: {
        stories: {
          select: { viewCount: true, reactions: { select: { id: true } }, comments: { select: { id: true } } }
        }
      }
    });

    const universeAnalytics = universes.map(u => ({
      id: u.id,
      name: u.name,
      views: u.stories.reduce((sum, s) => sum + s.viewCount, 0),
      reactions: u.stories.reduce((sum, s) => sum + s.reactions.length, 0),
      comments: u.stories.reduce((sum, s) => sum + s.comments.length, 0)
    })).sort((a, b) => b.views - a.views);

    const seriesAnalytics = seriesList.map(s => ({
      id: s.id,
      name: s.name,
      views: s.stories.reduce((sum, s) => sum + s.viewCount, 0),
      reactions: s.stories.reduce((sum, s) => sum + s.reactions.length, 0),
      comments: s.stories.reduce((sum, s) => sum + s.comments.length, 0)
    })).sort((a, b) => b.views - a.views);

    const totalUniverseViews = universeAnalytics.reduce((sum, u) => sum + u.views, 0);
    const totalSeriesViews = seriesAnalytics.reduce((sum, s) => sum + s.views, 0);

    // Get subscriber count
    const subscribers = await prisma.newsletterSubscriber.count({
      where: { authorId: user.id },
    });

    // Get follower count
    const followers = await prisma.follow.count({
      where: { followingId: user.id },
    });

    const isCreator = await hasFeatureAccess(user, 'CREATOR');
    let detailedFollowers = undefined;
    let detailedSubscribers = undefined;
    let detailedTippers = undefined;

    if (isCreator) {
      const dbFollowers = await prisma.follow.findMany({
        where: { followingId: user.id },
        include: { follower: { select: { id: true, username: true, displayName: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      detailedFollowers = dbFollowers.map(f => f.follower);

      const dbSubs = await prisma.newsletterSubscriber.findMany({
        where: { authorId: user.id },
        include: { subscriber: { select: { id: true, username: true, displayName: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      detailedSubscribers = dbSubs.map(s => s.subscriber);

      const dbTips = await prisma.tip.findMany({
        where: { receiverId: user.id, status: 'COMPLETED' },
        include: { sender: { select: { id: true, username: true, displayName: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      detailedTippers = dbTips.map(t => ({
        amount: t.amount,
        sender: t.sender || { username: 'Anonymous' },
        createdAt: t.createdAt,
      }));
    }

    // Top performing stories
    const topStories = stories
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map(s => ({
        id: s.id,
        title: s.title,
        views: s.viewCount,
        reactions: s.reactions.length,
        comments: s.comments.length + (s.inlineComments?.length || 0),
        tips: s.tips.reduce((sum, t) => sum + t.amount, 0) / 100,
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
      select: { minutes: true }
    });

    const totalLogsCount = dbReadingLogs.length;
    const avgMinutesRead = totalLogsCount > 0
      ? dbReadingLogs.reduce((sum, log) => sum + log.minutes, 0) / totalLogsCount
      : 0;

    // Calculate Average Chapters Read
    const totalReadingProgressCount = await prisma.readingProgress.count({
      where: { storyId: { in: stories.map(s => s.id) } }
    });
    
    const uniqueReaders = await prisma.readingProgress.groupBy({
      by: ['userId'],
      where: { storyId: { in: stories.map(s => s.id) } }
    });
    
    const avgChaptersRead = uniqueReaders.length > 0 
      ? totalReadingProgressCount / uniqueReaders.length 
      : 0;

    // Calculate Focus Score (Session Intensity) based on Chapters vs Minutes
    // Intensity = (Chapters Read per Hour) relative to a benchmark (e.g., 4 chapters/hour = 100%)
    const totalMinutesRead = dbReadingLogs.reduce((sum, log) => sum + log.minutes, 0);
    const chaptersPerHour = totalMinutesRead > 0 ? (totalReadingProgressCount / (totalMinutesRead / 60)) : 0;
    const focusScore = totalLogsCount > 0 ? Math.min(100, Math.max(0, (chaptersPerHour / 4) * 100)) : 0;

    const focusIndex = {
      avgChaptersRead: avgChaptersRead,
      avgMinutesPerSession: avgMinutesRead,
      focusScore,
      totalLogsCount
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
      select: { id: true, chapterOrder: true, title: true, storyId: true },
      orderBy: { chapterOrder: 'asc' }
    });

    const dbReadingProgress = await prisma.readingProgress.findMany({
      where: { storyId: { in: stories.map(s => s.id) } },
      select: { chapterId: true, storyId: true }
    });

    const progressChapters = dbReadingProgress.map(rp => {
      const match = authorChapters.find(ch => ch.id === rp.chapterId);
      return match ? match.chapterOrder : null;
    }).filter((order): order is number => order !== null);

    const maxChapterOrder = authorChapters.reduce((max, ch) => Math.max(max, ch.chapterOrder), 1);

    const calculateRetention = (storyId: string | null) => {
      const filteredChapters = storyId ? authorChapters.filter(c => c.storyId === storyId) : authorChapters;
      const filteredProgress = storyId ? dbReadingProgress.filter(p => p.storyId === storyId) : dbReadingProgress;

      const progressChapters = filteredProgress.map(rp => {
        const match = filteredChapters.find(ch => ch.id === rp.chapterId);
        return match ? match.chapterOrder : null;
      }).filter((order): order is number => order !== null);

      const localMaxChapterOrder = filteredChapters.reduce((max, ch) => Math.max(max, ch.chapterOrder), 1);
      const retentionCohorts = [];

      const baseCount = progressChapters.filter(order => order >= 1).length;

      for (let order = 1; order <= Math.min(6, localMaxChapterOrder); order++) {
        const reachedCount = progressChapters.filter(o => o >= order).length;
        const rate = baseCount > 0 ? Math.round((reachedCount / baseCount) * 100) : 0;

        const chapterTitle = filteredChapters.find(ch => ch.chapterOrder === order)?.title || `Chapter ${order}`;
        retentionCohorts.push({
          chapter: `Ch ${order}: ${chapterTitle}`,
          rate
        });
      }
      return retentionCohorts;
    };

    const cohortRetention = calculateRetention(null);
    const retentionByStory: Record<string, any[]> = {};
    for (const s of stories) {
      retentionByStory[s.id] = calculateRetention(s.id);
    }

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

    // Feature 6: Promotion Analytics Engine
    const dbPromotions = await prisma.storyPromotion.findMany({
      where: { story: { authorId: user.id } },
      include: {
        story: { select: { title: true, authorId: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    const promotionAnalytics = await Promise.all(dbPromotions.map(async (promo) => {
      const timeWindow = { gte: promo.startDate, lte: promo.endDate };

      // --- EXISTING: Reactions & Comments ---
      const promoReactions = await prisma.storyReaction.count({
        where: { storyId: promo.storyId, createdAt: timeWindow }
      });
      const promoComments = await prisma.comment.count({
        where: { storyId: promo.storyId, createdAt: timeWindow }
      });

      const totalEngagements = promoReactions + promoComments;
      const cpe = totalEngagements > 0 ? (promo.cost / totalEngagements).toFixed(2) : String(promo.cost);
      const cpv = promo.promotionViews > 0 ? (promo.cost / promo.promotionViews).toFixed(2) : String(promo.cost);

      let roiRating = "Low";
      if (totalEngagements > 50 || promo.promotionViews > 500) roiRating = "Excellent";
      else if (totalEngagements > 10 || promo.promotionViews > 100) roiRating = "Good";
      else if (totalEngagements > 0 || promo.promotionViews > 0) roiRating = "Average";

      // --- METRIC 1: Daily Engagement Velocity ---
      const campaignDays = Math.max(1, Math.ceil((promo.endDate.getTime() - promo.startDate.getTime()) / (1000 * 60 * 60 * 24)));
      const dailyEngagementVelocity = parseFloat((totalEngagements / campaignDays).toFixed(2));

      // --- METRIC 2: Follower Conversion ---
      const followersGained = await prisma.follow.count({
        where: { followingId: promo.story.authorId, createdAt: timeWindow }
      });

      // --- METRIC 3: Financial Yield (Tips) ---
      const promoTips = await prisma.tip.findMany({
        where: { storyId: promo.storyId, status: 'COMPLETED', createdAt: timeWindow },
        select: { amount: true }
      });
      const tipsEarned = promoTips.reduce((sum, t) => sum + t.amount, 0) / 100;
      const tipCount = promoTips.length;

      // --- METRIC 4: Reach Expansion (Shares) ---
      const promoShares = await prisma.shareActivity.count({
        where: { storyId: promo.storyId, createdAt: timeWindow }
      });

      // --- METRIC 5: Interaction Rate (CTR) ---
      const interactionRate = promo.promotionViews > 0
        ? parseFloat(((totalEngagements / promo.promotionViews) * 100).toFixed(2))
        : 0;

      // --- METRIC 6: Sentiment Conversion ---
      const sentimentReactions = await prisma.storyReaction.groupBy({
        by: ['reactionType'],
        where: { storyId: promo.storyId, createdAt: timeWindow },
        _count: true
      });
      const positiveTypes = ['LIKE', 'LOVE', 'FIRE', 'WOW'];
      const positiveCount = sentimentReactions.filter(r => positiveTypes.includes(r.reactionType)).reduce((s, r) => s + r._count, 0);
      const negativeCount = sentimentReactions.filter(r => !positiveTypes.includes(r.reactionType)).reduce((s, r) => s + r._count, 0);
      const sentimentScore = promoReactions > 0
        ? parseFloat(((positiveCount / promoReactions) * 100).toFixed(1))
        : 0;

      // --- METRIC 7: Library Saves (Retention) ---
      const librarySaves = await prisma.bookSave.count({
        where: { bookId: promo.storyId, createdAt: timeWindow }
      });

      // --- METRIC 8: Reading Time Generated ---
      const readingLogs = await prisma.readingLog.findMany({
        where: { storyId: promo.storyId, createdAt: timeWindow },
        select: { minutes: true }
      });
      const totalReadingMinutes = readingLogs.reduce((sum, l) => sum + l.minutes, 0);

      // --- METRIC 9: Cost Per Minute (Attention Value) ---
      const costPerMinute = totalReadingMinutes > 0
        ? parseFloat((promo.cost / totalReadingMinutes).toFixed(2))
        : promo.cost;

      // --- METRIC 10: Deep Engagement (Inline Comments) ---
      const inlineCommentsCount = await prisma.inlineComment.count({
        where: { storyId: promo.storyId, createdAt: timeWindow }
      });

      return {
        id: promo.id,
        storyTitle: promo.story.title,
        tier: promo.tier,
        cost: promo.cost,
        status: promo.status,
        startDate: promo.startDate.toISOString(),
        endDate: promo.endDate.toISOString(),
        campaignDays,
        // Existing
        promotionViews: promo.promotionViews,
        reactionsGenerated: promoReactions,
        commentsGenerated: promoComments,
        totalEngagements,
        costPerEngagement: cpe,
        costPerView: cpv,
        roiRating,
        // 10 Advanced Metrics
        dailyEngagementVelocity,
        followersGained,
        tipsEarned,
        tipCount,
        promoShares,
        interactionRate,
        sentimentScore,
        positiveReactions: positiveCount,
        negativeReactions: negativeCount,
        librarySaves,
        totalReadingMinutes,
        costPerMinute,
        inlineCommentsCount
      };
    }));

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
      creatorInsights: isCreator ? {
        followers: detailedFollowers,
        subscribers: detailedSubscribers,
        tippers: detailedTippers,
      } : undefined,
      topStories,
      stories: stories.map(s => ({
        id: s.id,
        title: s.title,
        published: s.published,
        views: s.viewCount,
        reactions: s.reactions.length,
        comments: s.comments.length + (s.inlineComments?.length || 0),
        chapters: s.chapters.length,
        tips: s.tips.reduce((sum, t) => sum + t.amount, 0) / 100,
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
      cohortRetention,
      retentionByStory,
      collections: {
        totalUniverseViews,
        totalSeriesViews,
        universes: universeAnalytics,
        series: seriesAnalytics,
      },
      promotionAnalytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
