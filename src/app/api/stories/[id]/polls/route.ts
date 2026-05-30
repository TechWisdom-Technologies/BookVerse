import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storyId } = await params;
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get('chapterId');

    if (!chapterId) {
      return NextResponse.json({ error: 'Chapter ID is required' }, { status: 400 });
    }

    // Fetch polls for this chapter
    const polls = await prisma.poll.findMany({
      where: { chapterId },
      include: {
        options: {
          include: {
            votes: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(polls);
  } catch (error) {
    console.error('Error fetching polls:', error);
    return NextResponse.json({ error: 'Failed to fetch polls' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storyId } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { hasFeatureAccess, paidFeatureError } = await import('@/lib/entitlements');
    if (!(await hasFeatureAccess(user, 'CREATOR'))) {
      return NextResponse.json(paidFeatureError('CREATOR'), { status: 402 });
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    if (story.authorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { chapterId, question, options, expiresAt } = await req.json();

    if (!chapterId || !question || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Check if chapter exists and belongs to this story
    const chapter = await prisma.storyChapter.findFirst({
      where: { id: chapterId, storyId },
    });

    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    // Create poll along with options
    const poll = await prisma.poll.create({
      data: {
        chapterId,
        question,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        options: {
          create: options.map((opt: string) => ({ text: opt })),
        },
      },
      include: {
        options: {
          include: {
            votes: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(poll);
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 });
  }
}
