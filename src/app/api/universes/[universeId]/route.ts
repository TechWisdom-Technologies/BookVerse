import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ universeId: string }> }
) {
  try {
    const { universeId } = await params;
    const universe = await prisma.universe.findUnique({
      where: { id: universeId },
      include: {
        stories: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            viewCount: true,
            genre: true,
            summary: true,
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
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
      },
    });

    if (!universe) {
      return NextResponse.json({ error: 'Universe not found' }, { status: 404 });
    }

    return NextResponse.json(universe);
  } catch (error) {
    console.error('Error fetching universe:', error);
    return NextResponse.json({ error: 'Failed to fetch universe' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ universeId: string }> }
) {
  try {
    const { universeId } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const universe = await prisma.universe.findUnique({
      where: { id: universeId },
    });

    if (!universe) {
      return NextResponse.json({ error: 'Universe not found' }, { status: 404 });
    }

    if (universe.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, genre, coverUrl } = body;

    const updated = await prisma.universe.update({
      where: { id: universeId },
      data: {
        name: name?.trim() || universe.name,
        description: description !== undefined ? (description?.trim() || null) : universe.description,
        genre: genre?.trim() || universe.genre,
        coverUrl: coverUrl !== undefined ? (coverUrl?.trim() || null) : universe.coverUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating universe:', error);
    return NextResponse.json({ error: 'Failed to update universe' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ universeId: string }> }
) {
  try {
    const { universeId } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const universe = await prisma.universe.findUnique({
      where: { id: universeId },
    });

    if (!universe) {
      return NextResponse.json({ error: 'Universe not found' }, { status: 404 });
    }

    if (universe.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Remove from stories
    await prisma.story.updateMany({
      where: { universeId },
      data: { universeId: null },
    });

    await prisma.universe.delete({
      where: { id: universeId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting universe:', error);
    return NextResponse.json({ error: 'Failed to delete universe' }, { status: 500 });
  }
}
