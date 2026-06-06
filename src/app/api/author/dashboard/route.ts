import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';

export async function GET() {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Entitlement gate check (AUTHOR plan or Admin or Founding user)
    if (!(await hasFeatureAccess(user, 'AUTHOR'))) {
      return NextResponse.json(paidFeatureError('AUTHOR'), { status: 402 });
    }

    // 1. Fetch pending invitations where the logged-in user is the invited collaborator
    const pendingInvites = await prisma.universeCollaborator.findMany({
      where: {
        userId: user.id,
        status: 'PENDING',
      },
      include: {
        universe: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Fetch universes owned by the user, including all co-authors and their works
    const myUniverses = await prisma.universe.findMany({
      where: { userId: user.id },
      include: {
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        stories: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 2.2 Fetch universes where user is a co-author (accepted collaborator, not owner)
    const collabUniverses = await prisma.universe.findMany({
      where: {
        userId: { not: user.id },
        collaborators: {
          some: {
            userId: user.id,
            status: 'ACCEPTED'
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          }
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        stories: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 2.5 Fetch series owned by the user
    const mySeries = await prisma.series.findMany({
      where: { userId: user.id },
      include: {
        stories: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Fetch fan book requests submitted for user's universes or series
    const bookRequests = await prisma.bookRequest.findMany({
      where: {
        OR: [
          { universe: { userId: user.id } },
          { series: { userId: user.id } },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        universe: { select: { id: true, name: true } },
        series: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 15,
    });

    // 4. Fetch overall aggregated metrics for quick display
    const [
      storiesCount,
      viewsAggregate,
      reactionsCount,
      commentsCount,
      newsletterCount,
      followersCount,
    ] = await Promise.all([
      prisma.story.count({ where: { authorId: user.id } }),
      prisma.story.aggregate({
        where: { authorId: user.id },
        _sum: { viewCount: true },
      }),
      prisma.storyReaction.count({ where: { story: { authorId: user.id } } }),
      prisma.comment.count({ where: { story: { authorId: user.id } } }),
      prisma.newsletterSubscriber.count({ where: { authorId: user.id } }),
      prisma.follow.count({ where: { followingId: user.id } }),
    ]);

    // ==========================================
    // 5 NEW FEATURES DB TELEMETRY DATA
    // ==========================================

    // Feature 1: Chapter Polls & Votes Telemetry
    const activePolls = await prisma.poll.findMany({
      where: {
        chapter: { story: { authorId: user.id } },
      },
      include: {
        chapter: {
          select: {
            title: true,
            story: { select: { title: true } },
          },
        },
        options: {
          include: {
            votes: { select: { id: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Feature 2: Beta Reader Squad
    const betaReaders = await prisma.betaReader.findMany({
      where: {
        story: { authorId: user.id },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        story: {
          select: { title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Feature 3: Scheduled Release Trajectory Timeline
    const scheduledChapters = await prisma.scheduledChapter.findMany({
      where: { createdBy: user.id },
      orderBy: { releaseDateTime: 'asc' },
      take: 5,
    });

    // Resolve scheduled stories title manually for correct rendering
    const scheduledStoryIds = scheduledChapters.map(c => c.storyId);
    const scheduledStoriesResolved = await prisma.story.findMany({
      where: { id: { in: scheduledStoryIds } },
      select: { id: true, title: true },
    });

    const scheduledTimeline = scheduledChapters.map(sc => {
      const resolved = scheduledStoriesResolved.find(s => s.id === sc.storyId);
      return {
        ...sc,
        storyTitle: resolved ? resolved.title : 'Unknown Manuscript',
      };
    });

    // ==========================================
    // 5 MORE ADVANCED DASHBOARD FEATURES (API)
    // ==========================================

    // Feature 1: Target Audience & Content Warnings Audit
    const myStoriesMeta = await prisma.story.findMany({
      where: { authorId: user.id },
      select: {
        id: true,
        title: true,
        contentWarnings: true,
        ageRating: true,
        subGenres: true,
        genre: true,
      }
    });

    const warningsSummary = myStoriesMeta.reduce((acc: Record<string, number>, story) => {
      story.contentWarnings.forEach(w => {
        const key = w.toUpperCase();
        acc[key] = (acc[key] || 0) + 1;
      });
      return acc;
    }, {});

    const avgAgeRating = myStoriesMeta.length > 0
      ? myStoriesMeta.reduce((sum, s) => sum + (s.ageRating || 0), 0) / myStoriesMeta.length
      : 13; // default recommendation

    // Feature 3: Gift Memberships Registry
    const dbGifts = await prisma.giftMembership.findMany({
      where: { sentBy: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const giftMemberships = dbGifts.map(g => ({
      id: g.id,
      code: g.code,
      tier: g.tier,
      duration: g.duration,
      recipientEmail: g.recipientEmail,
      value: g.value,
      status: g.status,
      expiresAt: g.expiresAt.toISOString(),
      redeemedAt: g.redeemedAt?.toISOString() || null
    }));

    // NEW FEATURE: Advertising & Promotions Registry
    const dbPromotions = await prisma.storyPromotion.findMany({
      where: { story: { authorId: user.id } },
      include: {
        story: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const activePromotions = dbPromotions.map(p => ({
      id: p.id,
      storyTitle: p.story.title,
      tier: p.tier,
      cost: p.cost,
      status: p.status,
      startDate: p.startDate.toISOString(),
      endDate: p.endDate.toISOString(),
      createdAt: p.createdAt.toISOString()
    }));

    // Feature 4: Safety, Integrity & Content Flags Board
    const dbReports = await prisma.contentReport.findMany({
      where: { storyId: { in: myStoriesMeta.map(s => s.id) } },
      include: {
        reporter: { select: { displayName: true, username: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const dbDmca = await prisma.dMCANotice.findMany({
      where: { storyId: { in: myStoriesMeta.map(s => s.id) } },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const integrityReports = [
      ...dbReports.map(r => ({
        id: r.id,
        type: 'CONTENT_REPORT',
        storyTitle: myStoriesMeta.find(s => s.id === r.storyId)?.title || 'My Story',
        reason: r.reason,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
        reporter: r.reporter.displayName || r.reporter.username
      })),
      ...dbDmca.map(d => ({
        id: d.id,
        type: 'DMCA_NOTICE',
        storyTitle: myStoriesMeta.find(s => s.id === d.storyId)?.title || 'My Story',
        reason: `DMCA claim: "${d.originalWorkTitle}" by ${d.originalWorkAuthor || 'Unknown'}`,
        status: d.status,
        createdAt: d.createdAt.toISOString(),
        reporter: d.copyrightHolder
      }))
    ];

    const safetyReports = integrityReports;

    // Feature 5: Onboarding Genre Matchmaker & Under-Served Niches
    const onboardingQuizzes = await prisma.onboardingQuiz.findMany({
      take: 50,
      select: { genrePreferences: true }
    });

    const preferenceCounts: Record<string, number> = {};
    onboardingQuizzes.forEach(q => {
      q.genrePreferences.forEach(g => {
        preferenceCounts[g] = (preferenceCounts[g] || 0) + 1;
      });
    });

    const myGenres = new Set(myStoriesMeta.map(s => s.genre || 'Fiction'));
    const matchedNiches = Object.entries(preferenceCounts)
      .map(([genre, count]) => ({
        genre,
        readersInterested: count,
        servedByAuthor: myGenres.has(genre),
        marketNicheScore: count * (myGenres.has(genre) ? 0.3 : 1.0)
      }))
      .sort((a, b) => b.marketNicheScore - a.marketNicheScore)
      .slice(0, 5);

    const genreMatchmaker = matchedNiches;

    // Feature 4: Audience Sentiment Distribution
    const sentimentGroups = await prisma.storyReaction.groupBy({
      by: ['reactionType'],
      where: { story: { authorId: user.id } },
      _count: { id: true },
    });

    // Feature 5: Reader Progress Indices
    const readingProgressStats = await prisma.readingProgress.aggregate({
      where: {
        storyId: { in: myStoriesMeta.map(s => s.id) },
      },
      _avg: { percentage: true },
    });

    const readingProgressCount = await prisma.readingProgress.count({
      where: {
        storyId: { in: myStoriesMeta.map(s => s.id) },
      },
    });

    return NextResponse.json({
      pendingInvites,
      myUniverses,
      collabUniverses,
      mySeries,
      bookRequests,
      stats: {
        totalStories: storiesCount,
        totalViews: viewsAggregate._sum?.viewCount || 0,
        totalReactions: reactionsCount,
        totalComments: commentsCount,
        totalSubscribers: newsletterCount,
        totalFollowers: followersCount,
      },
      // 5 New Advanced Feeds
      activePolls: activePolls.map(p => ({
        id: p.id,
        question: p.question,
        storyTitle: p.chapter.story.title,
        chapterTitle: p.chapter.title,
        totalVotes: p.options.reduce((sum, opt) => sum + opt.votes.length, 0),
        options: p.options.map(o => ({
          id: o.id,
          text: o.text,
          votes: o.votes.length,
        })),
      })),
      betaReaders,
      scheduledTimeline,
      sentimentDistribution: sentimentGroups,
      readingCompletion: {
        averageProgress: readingProgressStats._avg?.percentage || 0,
        trackedReaders: readingProgressCount,
      },
      // New Dashboard Telemetries
      warningsAudit: { warningsSummary, avgAgeRating },
      giftMemberships,
      safetyReports,
      genreMatchmaker,
      activePromotions,
      myStories: myStoriesMeta.map(s => ({ id: s.id, title: s.title }))
    });
  } catch (error) {
    console.error('Error fetching creator dashboard analytics:', error);
    return NextResponse.json({ error: 'Failed to retrieve dashboard metrics' }, { status: 500 });
  }
}
