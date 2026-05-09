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
    const { paragraphId, content, hasSpiderAlert } = body;

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
        hasSpiderAlert: hasSpiderAlert ?? false,
      },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating inline comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
