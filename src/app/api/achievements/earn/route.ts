import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/achievements/earn
 * Award an achievement to the current user
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { achievementName } = await req.json();

    if (!achievementName) {
      return NextResponse.json(
        { error: 'Achievement name required' },
        { status: 400 }
      );
    }

    // Find achievement by name
    const achievement = await prisma.achievement.findUnique({
      where: { name: achievementName },
    });

    if (!achievement) {
      return NextResponse.json(
        { error: 'Achievement not found' },
        { status: 404 }
      );
    }

    // Check if user already has this achievement
    const existing = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: user.id,
          achievementId: achievement.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json({
        message: 'User already has this achievement',
        achievement: existing,
      });
    }

    // Award the achievement
    const userAchievement = await prisma.userAchievement.create({
      data: {
        userId: user.id,
        achievementId: achievement.id,
      },
      include: { achievement: true },
    });

    return NextResponse.json(userAchievement, { status: 201 });
  } catch (error) {
    console.error('Error earning achievement:', error);
    return NextResponse.json(
      { error: 'Failed to earn achievement' },
      { status: 500 }
    );
  }
}
