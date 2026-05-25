import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storyId } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const progress = await prisma.readingProgress.findUnique({
      where: {
        userId_storyId: {
          userId: user.id,
          storyId: storyId,
        },
      },
    });

    return NextResponse.json(progress || null);
  } catch (error) {
    console.error('Error fetching reading progress:', error);
    return NextResponse.json({ error: 'Failed to fetch reading progress' }, { status: 500 });
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

    const { chapterId, percentage } = await req.json();

    if (!chapterId || typeof percentage !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const progress = await prisma.readingProgress.upsert({
      where: {
        userId_storyId: {
          userId: user.id,
          storyId: storyId,
        },
      },
      update: {
        chapterId,
        percentage,
      },
      create: {
        userId: user.id,
        storyId: storyId,
        chapterId,
        percentage,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error saving reading progress:', error);
    return NextResponse.json({ error: 'Failed to save reading progress' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: storyId } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.readingProgress.delete({
      where: {
        userId_storyId: {
          userId: user.id,
          storyId: storyId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reading progress:', error);
    return NextResponse.json({ error: 'Failed to delete reading progress' }, { status: 500 });
  }
}
