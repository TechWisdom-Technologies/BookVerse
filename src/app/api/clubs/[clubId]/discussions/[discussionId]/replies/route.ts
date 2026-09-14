import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/clubs/[clubId]/discussions/[discussionId]/replies
 * Fetch replies for a specific discussion
 */
export async function GET(
  req: NextRequest,
  context: { params: any }
) {
  try {
    const params = await context.params;
    const { clubId, discussionId } = params;

    const replies = await prisma.clubDiscussion.findMany({
      where: { clubId, parentId: discussionId },
      include: {
        author: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        reactions: true,
      },
      orderBy: { createdAt: 'asc' }, // Order replies chronologically
    });

    return NextResponse.json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}
