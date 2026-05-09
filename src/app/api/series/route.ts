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

    const series = await prisma.series.findMany({
      where,
      include: {
        books: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            sequenceNumber: true,
          },
          orderBy: { sequenceNumber: 'asc' },
        },
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(series);
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, genre } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Series name is required' }, { status: 400 });
    }

    const series = await prisma.series.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        genre: genre?.trim() || 'Fiction',
        userId: user.uid,
      },
      include: {
        books: {
          select: {
            id: true,
            title: true,
            sequenceNumber: true,
          },
        },
      },
    });

    return NextResponse.json(series, { status: 201 });
  } catch (error) {
    console.error('Error creating series:', error);
    return NextResponse.json({ error: 'Failed to create series' }, { status: 500 });
  }
}
