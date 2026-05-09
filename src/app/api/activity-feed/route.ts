import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/activity-feed
 * Fetch activity feed for the current user
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get users that the current user follows
    const following = await prisma.follow.findMany({
      where: { followerId: user.id },
      select: { followingId: true },
    });

    const followingIds = following.map(f => f.followingId);

    // Fetch recent activities from followed users
    const activities = [];

    // Recent stories from followed authors
    const recentStories = await prisma.story.findMany({
      where: {
        authorId: { in: followingIds },
        published: true,
      },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    activities.push(
      ...recentStories.map(story => ({
        id: `story-${story.id}`,
        type: 'story_published',
        timestamp: story.createdAt,
        actor: story.author,
        content: {
          title: story.title,
          id: story.id,
        },
        description: `published a new story: "${story.title}"`,
      }))
    );

    // Recent achievements of followed users
    const recentAchievements = await prisma.userAchievement.findMany({
      where: {
        userId: { in: followingIds },
      },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        achievement: {
          select: { name: true, icon: true },
        },
      },
      orderBy: { earnedAt: 'desc' },
      take: 10,
    });

    activities.push(
      ...recentAchievements.map(achievement => ({
        id: `achievement-${achievement.id}`,
        type: 'achievement_earned',
        timestamp: achievement.earnedAt,
        actor: achievement.user,
        content: {
          achievementName: achievement.achievement.name,
        },
        description: `earned the "${achievement.achievement.name}" achievement`,
      }))
    );

    // Recent tips sent to followed users
    const recentTips = await prisma.tip.findMany({
      where: {
        receiverId: { in: followingIds },
        status: 'COMPLETED',
      },
      include: {
        receiver: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        story: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    activities.push(
      ...recentTips.map(tip => ({
        id: `tip-${tip.id}`,
        type: 'tip_received',
        timestamp: tip.createdAt,
        actor: tip.receiver,
        content: {
          amount: tip.amount,
          storyId: tip.story?.id,
          storyTitle: tip.story?.title,
        },
        description: `received a $${tip.amount} tip${tip.story ? ` for "${tip.story.title}"` : ''}`,
      }))
    );

    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Take top 50
    const paginatedActivities = activities.slice(0, 50);

    return NextResponse.json({
      activities: paginatedActivities,
      count: paginatedActivities.length,
    });
  } catch (error) {
    console.error('Error fetching activity feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity feed' },
      { status: 500 }
    );
  }
}
