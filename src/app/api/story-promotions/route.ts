import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const promotions = await prisma.storyPromotion.findMany({
      where: { status: 'ACTIVE' },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            viewCount: true,
          },
        },
      },
      orderBy: { endDate: 'asc' },
      take: 20,
    });

    return NextResponse.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { dbUser } = await verifyToken();
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { storyId, duration, tier } = body;

    if (!storyId || !duration || !tier) {
      return NextResponse.json(
        { error: 'Story ID, duration, and tier required' },
        { status: 400 }
      );
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true },
    });

    if (!story || story.authorId !== dbUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tierCosts: Record<string, number> = {
      FEATURED: 29.99,
      PROMOTED: 49.99,
      TRENDING: 99.99,
    };

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

    const promotion = await prisma.storyPromotion.create({
      data: {
        storyId,
        tier,
        startDate,
        endDate,
        cost: tierCosts[tier] || 29.99,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
