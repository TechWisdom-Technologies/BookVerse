import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function PATCH(
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
    const { title, summary, coverUrl, genre, tags, published } = body;

    const updated = await prisma.story.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(summary !== undefined && { summary }),
        ...(coverUrl !== undefined && { coverUrl }),
        ...(genre && { genre }),
        ...(tags && { tags }),
        ...(published !== undefined && { published }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating story metadata:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const story = await prisma.story.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        summary: true,
        coverUrl: true,
        genre: true,
        tags: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: { id: true, username: true, displayName: true },
        },
      },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error fetching story metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
