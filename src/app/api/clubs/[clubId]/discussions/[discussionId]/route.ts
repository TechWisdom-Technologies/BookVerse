import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ clubId: string; discussionId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clubId, discussionId } = await context.params;
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const discussion = await prisma.clubDiscussion.findUnique({
      where: { id: discussionId },
    });

    if (!discussion || discussion.clubId !== clubId) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    if (discussion.authorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.clubDiscussion.update({
      where: { id: discussionId },
      data: {
        title,
        content,
        isEdited: true,
      },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating discussion:', error);
    return NextResponse.json({ error: 'Failed to update discussion' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ clubId: string; discussionId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clubId, discussionId } = await context.params;

    const discussion = await prisma.clubDiscussion.findUnique({
      where: { id: discussionId },
    });

    if (!discussion || discussion.clubId !== clubId) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    if (discussion.authorId !== user.id) {
      // Check if user is club owner (they can also delete)
      const club = await prisma.club.findUnique({ where: { id: clubId } });
      if (!club || club.ownerId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    await prisma.clubDiscussion.delete({
      where: { id: discussionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting discussion:', error);
    return NextResponse.json({ error: 'Failed to delete discussion' }, { status: 500 });
  }
}
