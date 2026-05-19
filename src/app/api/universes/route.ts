import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');

    let where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const universes = await prisma.universe.findMany({
      where,
      include: {
        stories: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            stories: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(universes);
  } catch (error) {
    console.error('Error fetching universes:', error);
    return NextResponse.json({ error: 'Failed to fetch universes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, genre, coverUrl } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Universe name is required' }, { status: 400 });
    }

    const universe = await prisma.universe.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        genre: genre?.trim() || 'Fiction',
        coverUrl: coverUrl?.trim() || null,
        userId: user.id,
      },
      include: {
        stories: true,
      },
    });

    return NextResponse.json(universe, { status: 201 });
  } catch (error: any) {
    console.error('CREATE UNIVERSE ERROR:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return NextResponse.json({
      error: 'Failed to create universe',
      details: error.message
    }, { status: 500 });
  }
}
