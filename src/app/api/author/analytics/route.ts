import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/author/analytics
 * Fetch analytics for the current author
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
