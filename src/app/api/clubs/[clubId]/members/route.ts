import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/clubs/[clubId]/members
 * Join a club
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

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    // Check if already a member
    const existing = await prisma.clubMember.findUnique({
      where: {
        clubId_userId: {
          clubId,
          userId: user.id,
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
        userId: user.id,
        role: 'MEMBER',
      },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error joining club:', error);
    return NextResponse.json(
      { error: 'Failed to join club' },
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
