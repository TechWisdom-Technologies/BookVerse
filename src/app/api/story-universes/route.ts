import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const universes = await prisma.storyUniverse.findMany({
      include: {
        creator: {
          select: { id: true, username: true, displayName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Fetch story details manually since 'stories' is a scalar array of IDs
    const universesWithStories = await Promise.all(
      universes.map(async (u) => {
        const storyDetails = await prisma.story.findMany({
          where: { id: { in: u.stories } },
          select: {
            id: true,
            title: true,
            viewCount: true,
            author: { select: { id: true, displayName: true } },
          },
        });
        return { ...u, stories: storyDetails };
      })
    );

    return NextResponse.json(universesWithStories);
  } catch (error) {
    console.error('Error fetching universes:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, genre } = body;

    if (!name) {
      return NextResponse.json({ error: 'Universe name required' }, { status: 400 });
    }

    const universe = await prisma.storyUniverse.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        genre: genre || 'Fiction',
        creatorId: user.id,
      },
    });

    return NextResponse.json(universe, { status: 201 });
  } catch (error) {
    console.error('Error creating universe:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
