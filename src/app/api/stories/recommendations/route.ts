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

    // Serialize dates for Client Component safety
    const serialized = recommendedStories.map((story) => ({
      ...story,
      createdAt: story.createdAt.toISOString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Error fetching story recommendations:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
