import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/clubs/[clubId]
 * Fetch club details
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clubId: string }> }
) {
  try {
    const { clubId } = await params;

    const club = await prisma.club.findUnique({
      where: { id: clubId },
      include: {
        owner: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, bio: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, username: true, displayName: true, avatarUrl: true },
            },
          },
        },
        discussions: {
          include: {
            author: {
              select: { id: true, username: true, displayName: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    return NextResponse.json(club);
  } catch (error) {
    console.error('Error fetching club:', error);
    return NextResponse.json(
      { error: 'Failed to fetch club' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/clubs/[clubId]
 * Update club details (owner only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ clubId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clubId } = await params;

    // Check ownership
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { ownerId: true },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    if (club.ownerId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, description, genre, isPrivate, coverUrl } = await req.json();

    const updated = await prisma.club.update({
      where: { id: clubId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(genre !== undefined && { genre }),
        ...(isPrivate !== undefined && { isPrivate }),
        ...(coverUrl !== undefined && { coverUrl }),
      },
      include: {
        owner: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        members: {
          select: { userId: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating club:', error);
    return NextResponse.json(
      { error: 'Failed to update club' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/clubs/[clubId]
 * Delete club (owner only)
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

    // Check ownership
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { ownerId: true },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    if (club.ownerId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.club.delete({
      where: { id: clubId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting club:', error);
    return NextResponse.json(
      { error: 'Failed to delete club' },
      { status: 500 }
    );
  }
}
