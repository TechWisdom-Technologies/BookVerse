import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';

type ReadingChallengeDelegate = {
  findMany(args: unknown): Promise<unknown[]>;
  create(args: unknown): Promise<unknown>;
};

type UserDelegate = {
  findUnique(args: unknown): Promise<{ role: string } | null>;
};

type ChallengePrisma = {
  readingChallenge: ReadingChallengeDelegate;
  user: UserDelegate;
};

export async function GET(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!(await hasFeatureAccess(user, 'PRO'))) {
      return NextResponse.json(paidFeatureError('PRO'), { status: 402 });
    }

    const { searchParams } = new URL(req.url);
    const genre = searchParams.get('genre');
    const status = searchParams.get('status') || 'ACTIVE';

    const where: Record<string, unknown> = { status };

    if (genre) {
      where.genre = { contains: genre, mode: 'insensitive' };
    }

    const anyPrisma = prisma as unknown as ChallengePrisma;
    const challenges = await anyPrisma.readingChallenge.findMany({
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
    if (!(await hasFeatureAccess(user, 'PRO'))) {
      return NextResponse.json(paidFeatureError('PRO'), { status: 402 });
    }

    // Only admins can create challenges - check if user is admin
    const anyPrisma = prisma as unknown as ChallengePrisma;
    const userRecord = await anyPrisma.user.findUnique({
      where: { id: user.id },
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

    const challenge = await anyPrisma.readingChallenge.create({
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
