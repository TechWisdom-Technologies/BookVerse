import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function getSortedStoryIds(
  genre?: string,
  sort: string = "popular"
): Promise<{ ids: string[], total: number }> {
  const where: Prisma.StoryWhereInput = {
    published: true,
    author: {
      isDeactivated: false,
    }
  };

  if (genre) {
    where.OR = [
      { title: { contains: genre, mode: "insensitive" } },
      { summary: { contains: genre, mode: "insensitive" } },
    ];
  }

  // If sort is purely by "recent", we can skip the complex calculation and let the database do it.
  if (sort === "recent") {
    const stories = await prisma.story.findMany({
      where,
      select: { id: true },
      orderBy: { createdAt: "desc" }
    });
    return { ids: stories.map(s => s.id), total: stories.length };
  }

  // Otherwise, we do the full Popularity Ranking

  // 1. Fetch lightweight story index
  const stories = await prisma.story.findMany({
    where,
    select: {
      id: true,
      viewCount: true,
      reactionCount: true,
      promotionScore: true,
      createdAt: true,
      _count: {
        select: {
          comments: true,
          inlineComments: true
        }
      },
      promotions: {
        where: {
          status: 'ACTIVE',
          endDate: { gt: new Date() }
        },
        select: { tier: true, cost: true, startDate: true }
      }
    }
  });

  // 2. Fetch Reading Logs to calculate total view time
  const storyIds = stories.map(s => s.id);
  const readingLogs = await prisma.readingLog.groupBy({
    by: ['storyId'],
    _sum: { minutes: true },
    where: { storyId: { in: storyIds } }
  });

  const viewTimeMap = new Map<string, number>();
  for (const log of readingLogs) {
    if (log.storyId) {
      viewTimeMap.set(log.storyId, log._sum.minutes || 0);
    }
  }

  // 3. Calculate Popularity Score
  const scoredStories = stories.map(story => {
    const comments = story._count.comments;
    const inlineComments = story._count.inlineComments;
    const viewTime = viewTimeMap.get(story.id) || 0;

    let baseScore = 0;
    
    if (sort === "popular") {
      baseScore = story.viewCount 
        + (story.reactionCount * 2) 
        + ((comments + inlineComments) * 3) 
        + (viewTime * 1);
    } else if (sort === "reactions") {
      baseScore = story.reactionCount;
    } else if (sort === "views") {
      baseScore = story.viewCount;
    }

    // 4. Extract Promo Data for Strict Sorting
    const trendingPromo = story.promotions.find(p => p.tier === 'TRENDING');
    const promotedPromo = story.promotions.find(p => p.tier === 'PROMOTED');
    
    // We assign a tierLevel for sorting: 3 (Trending), 2 (Promoted), 1 (Organic/Featured)
    let tierLevel = 1;
    let promoCost = 0;
    let promoStartDate = new Date(0);
    const qualityScore = story.reactionCount + comments + inlineComments; // approximate quality for grids
    
    if (trendingPromo) {
      tierLevel = 3;
      promoCost = trendingPromo.cost;
      promoStartDate = trendingPromo.startDate;
    } else if (promotedPromo) {
      tierLevel = 2;
      promoCost = promotedPromo.cost;
      promoStartDate = promotedPromo.startDate;
    }

    return {
      id: story.id,
      tierLevel,
      promoCost,
      viewCount: story.viewCount,
      qualityScore,
      promoStartDate: promoStartDate.getTime(),
      score: baseScore,
      createdAt: story.createdAt.getTime()
    };
  });

  // 4. Sort
  scoredStories.sort((a, b) => {
    // 1. Tier Level dominates (Trending > Promoted > Organic)
    if (b.tierLevel !== a.tierLevel) return b.tierLevel - a.tierLevel;
    
    // 2. If it's a promoted tier (Trending or Promoted), use strict sorting
    if (a.tierLevel > 1) {
      if (b.promoCost !== a.promoCost) return b.promoCost - a.promoCost;
      if (b.viewCount !== a.viewCount) return b.viewCount - a.viewCount;
      if (b.qualityScore !== a.qualityScore) return b.qualityScore - a.qualityScore;
      if (a.promoStartDate !== b.promoStartDate) return a.promoStartDate - b.promoStartDate; // oldest first
    }
    
    // 3. If it's Organic/Featured (Tier 1), use organic score
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    
    // Fallback to newest if organic scores are identical
    return b.createdAt - a.createdAt;
  });

  return {
    ids: scoredStories.map(s => s.id),
    total: scoredStories.length
  };
}
