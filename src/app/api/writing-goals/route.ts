import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());

    const goals = await prisma.writingGoal.findMany({
      where: {
        userId: user.uid,
        year,
        month,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate progress for each goal
    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {
        const wordCount = await prisma.story.aggregate({
          where: {
            userId: user.uid,
            createdAt: {
              gte: new Date(year, month - 1, 1),
              lt: new Date(year, month, 1),
            },
          },
          _sum: {
            wordCount: true,
          },
        });

        return {
          ...goal,
          progress: wordCount._sum.wordCount || 0,
          percentage: Math.min(100, ((wordCount._sum.wordCount || 0) / goal.targetWords) * 100),
        };
      })
    );

    return NextResponse.json(goalsWithProgress);
  } catch (error) {
    console.error('Error fetching writing goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, targetWords, year, month, frequency } = body;

    if (!title || !targetWords || targetWords <= 0) {
      return NextResponse.json(
        { error: 'Title and positive target words are required' },
        { status: 400 }
      );
    }

    const goal = await prisma.writingGoal.create({
      data: {
        userId: user.uid,
        title: title.trim(),
        targetWords,
        year: year || new Date().getFullYear(),
        month: month || new Date().getMonth() + 1,
        frequency: frequency || 'MONTHLY',
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error('Error creating writing goal:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}
