import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuth } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await prisma.inlineComment.findMany({
      where: { storyId: id },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        replies: {
          include: {
            author: {
              select: { id: true, username: true, displayName: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching inline comments:', error);
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

    const body = await req.json();
    const { paragraphId, content, spoilerAlert, parentId } = body;

    if (!paragraphId || !content) {
      return NextResponse.json(
        { error: 'Paragraph ID and content required' },
        { status: 400 }
      );
    }

    const comment = await prisma.inlineComment.create({
      data: {
        storyId: id,
        authorId: user.id,
        paragraphId,
        content,
        spoilerAlert: spoilerAlert ?? false,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });

    // Notify story author (fire and forget)
    void prisma.story.findUnique({
      where: { id: id },
      select: { authorId: true, title: true }
    }).then(async (story) => {
      if (story && story.authorId !== user.id) {
        const { createNotification } = await import("@/lib/notifications");
        await createNotification({
          userId: story.authorId,
          type: "COMMENT",
          title: "New Inline Comment",
          message: `${user.displayName || user.username} added an inline comment to "${story.title}"`,
          link: `/stories/${id}`,
        });
      }
    });

    // If it's a reply and not replying to themselves, notify the parent comment author
    if (parentId) {
      void prisma.inlineComment.findUnique({
        where: { id: parentId },
        select: { authorId: true },
      }).then(async (parentComment) => {
        if (parentComment && parentComment.authorId !== user.id) {
          const { createNotification } = await import("@/lib/notifications");
          await createNotification({
            userId: parentComment.authorId,
            type: "REPLY",
            title: "New Reply to Your Inline Comment",
            message: `${user.displayName || user.username} replied to your inline comment.`,
            link: `/stories/${id}`,
          });
        }
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating inline comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    const existingComment = await prisma.inlineComment.findUnique({
      where: { id: commentId }
    });

    if (!existingComment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Only allow deletion if the user is the author or an admin
    if (existingComment.authorId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: You can only delete your own comments' }, { status: 403 });
    }

    await prisma.inlineComment.delete({
      where: { id: commentId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting inline comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
