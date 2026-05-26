import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');
    const onlyMine = searchParams.get('onlyMine') === 'true';

    let where: any = {};

    if (userId) {
      where.userId = userId;
    } else if (onlyMine) {
      const user = await getAuth();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      where.userId = user.id;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const seriesList = await prisma.series.findMany({
      where,
      include: {
        stories: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            viewCount: true,
            genre: true,
            summary: true,
          },
          orderBy: { sequenceNumber: 'asc' },
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

    return NextResponse.json(seriesList);
  } catch (error) {
    console.error('Error fetching series list:', error);
    return NextResponse.json({ error: 'Failed to fetch series list' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, coverUrl } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Series name is required' }, { status: 400 });
    }

    const series = await prisma.series.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        coverUrl: coverUrl?.trim() || null,
        userId: user.id,
      },
      include: {
        stories: true,
      },
    });

    return NextResponse.json(series, { status: 201 });
  } catch (error: any) {
    console.error('CREATE SERIES ERROR:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return NextResponse.json({
      error: 'Failed to create series',
      details: error.message
    }, { status: 500 });
  }
}
