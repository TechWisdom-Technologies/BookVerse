import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const genre = searchParams.get('genre');
    const status = searchParams.get('status') || 'ACTIVE';

    let where: any = { status };

    if (genre) {
      where.genre = { contains: genre, mode: 'insensitive' };
    }

    const challenges = await prisma.readingChallenge.findMany({
      where,
      include: {
        participants: {
          select: {
            id: true,
            userId: true,
            progress: true,
            completedAt: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
      take: 50,
    });

    return NextResponse.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can create challenges - check if user is admin
    const userRecord = await prisma.user.findUnique({
      where: { id: user.uid },
      select: { role: true },
    });

    if (userRecord?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, genre, targetBooks, startDate, endDate } = body;

    if (!title || !targetBooks || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Title, target books, and dates are required' },
        { status: 400 }
      );
    }

    const challenge = await prisma.readingChallenge.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        genre: genre || 'All Genres',
        targetBooks,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'ACTIVE',
      },
    });

    return NextResponse.json(challenge, { status: 201 });
  } catch (error) {
    console.error('Error creating challenge:', error);
    return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 });
  }
}
