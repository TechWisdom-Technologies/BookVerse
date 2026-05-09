import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/achievements
 * Fetch all available achievements
 */
export async function GET(req: NextRequest) {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { points: 'desc' },
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/achievements
 * Create a new achievement (Admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getAuth();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, icon, points } = await req.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description required' },
        { status: 400 }
      );
    }

    const achievement = await prisma.achievement.create({
      data: {
        name,
        description,
        icon: icon || null,
        points: points || 10,
      },
    });

    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json(
      { error: 'Failed to create achievement' },
      { status: 500 }
    );
  }
}
