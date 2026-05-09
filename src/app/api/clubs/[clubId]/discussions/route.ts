import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/clubs/[clubId]/discussions
 * Fetch all discussions in a club
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clubId: string }> }
) {
  try {
    const { clubId } = await params;

    const discussions = await prisma.clubDiscussion.findMany({
      where: { clubId },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(discussions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discussions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clubs/[clubId]/discussions
 * Create a new discussion
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ clubId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clubId } = await params;
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Check if user is a member of the club
    const membership = await prisma.clubMember.findUnique({
      where: {
        clubId_userId: {
          clubId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Must be a club member to post' },
        { status: 403 }
      );
    }

    const discussion = await prisma.clubDiscussion.create({
      data: {
        clubId,
        authorId: user.id,
        title,
        content,
      },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json(discussion, { status: 201 });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json(
      { error: 'Failed to create discussion' },
      { status: 500 }
    );
  }
}
