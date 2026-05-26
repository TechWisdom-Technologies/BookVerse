import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ universeId: string; userId: string }> }
) {
  try {
    const { universeId, userId } = await params;
    const stories = await prisma.story.findMany({
      where: {
        universeId,
        authorId: userId,
      },
      select: {
        id: true,
        title: true,
        coverUrl: true,
        published: true,
      },
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error('Error fetching collaborator stories:', error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ universeId: string; userId: string }> }
) {
  try {
    const { universeId, userId } = await params;
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

    // Allow the owner of the universe, the collaborator themselves, or any admin
    if (universe.userId !== user.id && user.id !== userId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1. Delete all stories written by this collaborator in this universe as requested
    await prisma.story.deleteMany({
      where: {
        universeId,
        authorId: userId,
      },
    });

    // 2. Remove collaborator entry
    await prisma.universeCollaborator.delete({
      where: {
        universeId_userId: {
          universeId,
          userId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing collaborator:', error);
    return NextResponse.json({ error: 'Failed to remove collaborator' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ universeId: string; userId: string }> }
) {
  try {
    const { universeId, userId } = await params;
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Allow either the collaborator themselves or any admin
    if (user.id !== userId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body;

    if (status !== 'ACCEPTED' && status !== 'REJECTED' && status !== 'PENDING') {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updated = await prisma.universeCollaborator.update({
      where: {
        universeId_userId: {
          universeId,
          userId,
        },
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating collaborator invite:', error);
    return NextResponse.json({ error: 'Failed to update invitation' }, { status: 500 });
  }
}
