import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/achievements/user/[userId]
 * Fetch achievements earned by a specific user
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { earnedAt: 'desc' },
    });

    // Calculate total points
    const totalPoints = userAchievements.reduce(
      (sum, ua) => sum + ua.achievement.points,
      0
    );

    return NextResponse.json({
      achievements: userAchievements,
      totalPoints,
      count: userAchievements.length,
    });
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}
