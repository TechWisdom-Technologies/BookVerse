import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const scheduled = await prisma.scheduledChapter.findMany({
      where: { storyId: id },
      orderBy: { releaseDateTime: 'asc' },
    });

    return NextResponse.json(scheduled);
  } catch (error) {
    console.error('Error fetching scheduled chapters:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const story = await prisma.story.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!story || story.authorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { chapterNumber, releaseDateTime, notifyFollowers } = body;

    if (!chapterNumber || !releaseDateTime) {
      return NextResponse.json(
        { error: 'Chapter number and release date are required' },
        { status: 400 }
      );
    }

    const scheduled = await prisma.scheduledChapter.create({
      data: {
        storyId: id,
        chapterNumber,
        releaseDateTime: new Date(releaseDateTime),
        notifyFollowers: notifyFollowers ?? true,
        createdBy: user.id,
      },
    });

    return NextResponse.json(scheduled, { status: 201 });
  } catch (error) {
    console.error('Error scheduling chapter:', error);
    return NextResponse.json({ error: 'Failed to schedule' }, { status: 500 });
  }
}
