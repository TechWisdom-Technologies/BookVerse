import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/clubs/[clubId]/discussions/[discussionId]/react
 * Toggle a reaction on a discussion
 */
export async function POST(
  req: NextRequest,
  context: { params: any }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const { clubId, discussionId } = params;
    const { emoji } = await req.json();

    if (!emoji) {
      return NextResponse.json({ error: 'Emoji is required' }, { status: 400 });
    }

    // Verify user is a member
    const membership = await prisma.clubMember.findUnique({
      where: {
        clubId_userId: {
          clubId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Must be a club member to react' }, { status: 403 });
    }

    // Check if any reaction exists for this user on this discussion
    const existingReactions = await prisma.clubDiscussionReaction.findMany({
      where: {
        discussionId,
        userId: user.id,
      },
    });

    if (existingReactions.length > 0) {
      const current = existingReactions[0];
      if (current.emoji === emoji) {
        // Toggle off (remove) if it's the exact same emoji
        await prisma.clubDiscussionReaction.delete({
          where: { id: current.id },
        });
        return NextResponse.json({ action: 'removed' });
      } else {
        // Change the reaction to the new emoji
        const reaction = await prisma.clubDiscussionReaction.update({
          where: { id: current.id },
          data: { emoji },
        });
        return NextResponse.json({ action: 'changed', reaction }, { status: 200 });
      }
    } else {
      // Create new reaction (add)
      const reaction = await prisma.clubDiscussionReaction.create({
        data: {
          discussionId,
          userId: user.id,
          emoji,
        },
      });
      return NextResponse.json({ action: 'added', reaction }, { status: 201 });
    }
  } catch (error) {
    console.error('Error toggling reaction:', error);
    return NextResponse.json(
      { error: 'Failed to toggle reaction' },
      { status: 500 }
    );
  }
}
