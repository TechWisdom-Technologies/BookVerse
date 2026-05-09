import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

/**
 * POST /api/clubs/[clubId]/members
 * Join a club (with join code support for private clubs)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ clubId: string }> }
) {
  try {
    const dbUser = await getCurrentUser();
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clubId } = await params;
    const { searchParams } = new URL(req.url);
    const joinCode = searchParams.get('code');
    const body = await req.json().catch(() => ({}));
    const providedCode = body.joinCode || body.code || joinCode;

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: {
        id: true,
        name: true,
        ownerId: true,
        isPrivate: true,
        joinCode: true,
        maxMembers: true,
        _count: {
          select: { members: true },
        },
      },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    // Check if user is banned
    const isBanned = await prisma.clubBan.findUnique({
      where: {
        clubId_userId: {
          clubId,
          userId: dbUser.id,
        },
      },
    });

    if (isBanned) {
      return NextResponse.json(
        { error: 'You are banned from this club' },
        { status: 403 }
      );
    }

    // Check max members limit
    if (club.maxMembers && club._count.members >= club.maxMembers) {
      return NextResponse.json(
        { error: 'Club is full. Maximum members reached.' },
        { status: 403 }
      );
    }

    // Check private club access
    if (club.isPrivate && club.ownerId !== dbUser.id) {
      if (!providedCode || providedCode !== club.joinCode) {
        return NextResponse.json(
          { error: 'Invalid or missing join code. This is a private club.' },
          { status: 403 }
        );
      }
    }

    // Check if already a member
    const existing = await prisma.clubMember.findUnique({
      where: {
        clubId_userId: {
          clubId,
          userId: dbUser.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Already a member of this club' },
        { status: 409 }
      );
    }

    const member = await prisma.clubMember.create({
      data: {
        clubId,
        userId: dbUser.id,
        role: 'MEMBER',
      },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });

    // Notify club owner (non-blocking)
    if (club.ownerId !== dbUser.id) {
      void createNotification({
        userId: club.ownerId,
        type: "CLUB_JOIN",
        title: "New Club Member",
        message: `${dbUser.displayName || dbUser.username} joined your club "${club.name}"!`,
        link: `/clubs/${clubId}`,
      }).catch(() => {}); // Ignore notification errors
    }

    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    console.error('Error joining club:', error);
    return NextResponse.json(
      { error: 'Failed to join club', details: error?.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/clubs/[clubId]/members
 * Leave a club
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ clubId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clubId } = await params;

    const member = await prisma.clubMember.findUnique({
      where: {
        clubId_userId: {
          clubId,
          userId: user.id,
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Not a member' }, { status: 404 });
    }

    // Prevent club owner from leaving
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { ownerId: true },
    });

    if (club?.ownerId === user.id) {
      return NextResponse.json(
        { error: 'Club owner cannot leave. Delete the club instead.' },
        { status: 400 }
      );
    }

    await prisma.clubMember.delete({
      where: {
        clubId_userId: {
          clubId,
          userId: user.id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error leaving club:', error);
    return NextResponse.json(
      { error: 'Failed to leave club' },
      { status: 500 }
    );
  }
}
