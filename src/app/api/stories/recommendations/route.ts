import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getAuth();
    let recommendedStories: any[] = [];
    const limit = 6;

    const selectFields = {
      id: true,
      title: true,
      coverUrl: true,
      summary: true,
      viewCount: true,
      createdAt: true,
      genre: true,
      subGenres: true,
      sequenceNumber: true,
      series: { select: { name: true } },
      universe: { select: { name: true } },
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          chapters: true,
          reactions: true,
          comments: true,
          inlineComments: true,
          shareActivities: true
        },
      },
    };

    if (user) {
      // 1. Get onboarding preferences
      const quiz = await prisma.onboardingQuiz.findUnique({
        where: { userId: user.id },
      });

      // 2. Get user's reacted stories to find preferred genres/authors
      const userReactions = await prisma.storyReaction.findMany({
        where: { userId: user.id },
        include: {
          story: {
            select: {
              genre: true,
              authorId: true,
            },
          },
        },
      });

      const reactedGenres = Array.from(
        new Set(
          userReactions
            .map((r) => r.story.genre)
            .filter((g): g is string => !!g)
        )
      );

      const reactedAuthors = Array.from(
        new Set(userReactions.map((r) => r.story.authorId))
      );

      const preferredGenres = Array.from(
        new Set([...(quiz?.genrePreferences || []), ...reactedGenres])
      );

      // 3. Find matching published stories (excluding user's own)
      const matchingStories = await prisma.story.findMany({
        where: {
          published: true,
          authorId: { not: user.id },
          author: { isDeactivated: false },
          OR: [
            { genre: { in: preferredGenres } },
            { authorId: { in: reactedAuthors } },
          ],
        },
        select: selectFields,
        orderBy: [
          { viewCount: 'desc' },
          { createdAt: 'desc' },
        ],
        take: limit,
      });

      recommendedStories = matchingStories;
    }

    // 4. Fallback/Backfill with overall trending/popular stories if not enough recommended
    if (recommendedStories.length < limit) {
      const excludedIds = recommendedStories.map((s) => s.id);
      if (user) {
        excludedIds.push(...(await prisma.story.findMany({
          where: { authorId: user.id },
          select: { id: true },
        })).map((s) => s.id));
      }

      const popularStories = await prisma.story.findMany({
        where: {
          published: true,
          id: { notIn: excludedIds },
          author: { isDeactivated: false },
        },
        select: selectFields,
        orderBy: [
          { viewCount: 'desc' },
          { reactionCount: 'desc' },
        ],
        take: limit - recommendedStories.length,
      });

      recommendedStories = [...recommendedStories, ...popularStories];
    }

    // Prioritize and sort active FEATURED promotions within recommendations list
    try {
      const activeFeaturedPromotions = await prisma.storyPromotion.findMany({
        where: {
          tier: 'FEATURED',
          status: 'ACTIVE',
          endDate: { gt: new Date() },
          story: { published: true }
        },
        select: { storyId: true, cost: true, startDate: true }
      });
      
      const featuredPromoMap = new Map();
      activeFeaturedPromotions.forEach(p => {
        if (!featuredPromoMap.has(p.storyId) || p.cost > featuredPromoMap.get(p.storyId).cost) {
          featuredPromoMap.set(p.storyId, p);
        }
      });

      // Sort so featured stories come first, preserving secondary viewCount/popularity ordering
      recommendedStories.sort((a, b) => {
        const promoA = featuredPromoMap.get(a.id);
        const promoB = featuredPromoMap.get(b.id);
        
        if (promoA && !promoB) return -1;
        if (!promoA && promoB) return 1;
        if (promoA && promoB) {
          if (promoB.cost !== promoA.cost) return promoB.cost - promoA.cost;
          if (b.viewCount !== a.viewCount) return b.viewCount - a.viewCount;
          
          const qualityA = (a._count?.reactions || 0) + (a._count?.comments || 0) + (a._count?.inlineComments || 0) + (a._count?.shareActivities || 0);
          const qualityB = (b._count?.reactions || 0) + (b._count?.comments || 0) + (b._count?.inlineComments || 0) + (b._count?.shareActivities || 0);
          if (qualityB !== qualityA) return qualityB - qualityA;
          
          return new Date(promoA.startDate).getTime() - new Date(promoB.startDate).getTime();
        }
        return 0;
      });
    } catch (err) {
      console.error('Error sorting featured recommendations:', err);
    }

    // Fetch only FEATURED promotions to populate badges as per strict isolation rules
    let activePromotions: { storyId: string; tier: string }[] = [];
    try {
      activePromotions = await prisma.storyPromotion.findMany({
        where: {
          tier: 'FEATURED',
          status: 'ACTIVE',
          endDate: { gt: new Date() },
        },
        select: {
          storyId: true,
          tier: true,
        },
      });
    } catch (err) {
      console.error('Error fetching active promotions for badges:', err);
    }

    // Serialize dates and attach promotion flags for Client Component safety
    const serialized = recommendedStories.map((story) => {
      const isFeatured = activePromotions.some((ap) => ap.storyId === story.id);
      return {
        ...story,
        createdAt: story.createdAt.toISOString(),
        isTrendingPromo: false,
        isPromotedPromo: false,
        isFeaturedPromo: isFeatured,
      };
    });

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Error fetching story recommendations:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
