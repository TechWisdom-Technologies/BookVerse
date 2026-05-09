import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

/**
 * GET /api/clubs/[clubId]/discussions
 * Fetch all discussions in a club (top-level only, with replies)
 */
export async function GET(
  req: NextRequest,
  context: { params: any }
) {
  try {
    const params = await context.params;
    const clubId = params?.clubId || params?.id;

    // Fetch all discussions in the club
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
 * Create a new discussion or reply
 */
export async function POST(
  req: NextRequest,
  context: { params: any }
) {
  try {
    console.log('POST discussions: Starting...');
    const user = await getCurrentUser();
    console.log('POST discussions: User:', user?.id || 'null');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const clubId = params?.clubId || params?.id;
    console.log('POST discussions: ClubId:', clubId);
    const { title, content, parentId } = await req.json();
    console.log('POST discussions: Body:', { title: title?.slice(0, 20), content: content?.slice(0, 20), parentId });

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
    console.log('POST discussions: Membership:', membership ? 'found' : 'not found');

    if (!membership) {
      return NextResponse.json(
        { error: 'Must be a club member to post' },
        { status: 403 }
      );
    }

    // If this is a reply, verify parent exists and belongs to same club
    if (parentId) {
      const parent = await prisma.clubDiscussion.findFirst({
        where: { id: parentId, clubId },
        select: { id: true, authorId: true, title: true },
      });

      if (!parent) {
        return NextResponse.json(
          { error: 'Parent discussion not found' },
          { status: 404 }
        );
      }

      // Notify parent author of reply
      if (parent.authorId !== user.id) {
        void createNotification({
          userId: parent.authorId,
          type: "DISCUSSION_REPLY",
          title: "New Reply to Your Message",
          message: `${user.displayName || user.username} replied to "${parent.title}"`,
          link: `/clubs/${clubId}`,
        }).catch(() => {});
      }
    }

    console.log('POST discussions: Creating discussion...');
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
    console.log('POST discussions: Created:', discussion.id);

    // Only notify other club members for top-level discussions (not replies)
    if (!parentId) {
      void prisma.clubMember.findMany({
        where: { clubId, userId: { not: user.id } },
        include: { club: { select: { name: true } } }
      }).then(async (members) => {
        for (const member of members) {
          await createNotification({
            userId: member.userId,
            type: "DISCUSSION",
            title: `New Discussion in ${member.club.name}`,
            message: `${user.displayName || user.username} posted: "${title}"`,
            link: `/clubs/${clubId}`,
          });
        }
      });
    }

    return NextResponse.json(discussion, { status: 201 });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json(
      { error: 'Failed to create discussion' },
      { status: 500 }
    );
  }
}
