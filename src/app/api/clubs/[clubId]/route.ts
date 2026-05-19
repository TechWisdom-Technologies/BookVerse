import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/clubs/[clubId]
 * Fetch club details
 */
export async function GET(
  req: NextRequest,
  context: { params: any }
) {
  try {
    // Robust params handling for Next.js 14/15 compatibility
    const params = await context.params;
    const clubId = params?.clubId || params?.id;
    
    console.log('GET /api/clubs/[clubId] - ID:', clubId);

    if (!clubId) {
      return NextResponse.json({ error: 'Club ID missing' }, { status: 400 });
    }

    const user = await getCurrentUser();
    
    // Try to find by ID first, then by name as fallback
    let club = await prisma.club.findUnique({
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
        },
      },
    });

    if (!club) {
      // Fallback: search by name (useful for SEO friendly URLs)
      club = await prisma.club.findUnique({
        where: { name: decodeURIComponent(clubId) },
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
          },
        },
      });
    }

    if (!club) {
      console.log('Club not found for ID/Name:', clubId);
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    const isOwner = user?.id === club.ownerId;
    const isMember = club.members.some(m => m.userId === user?.id);

    // Auto-generate join code if missing for owner
    if (isOwner && !club.joinCode) {
      try {
        const crypto = await import('crypto');
        const newCode = crypto.randomBytes(3).toString('hex').toUpperCase();
        club = await prisma.club.update({
          where: { id: club.id },
          data: { joinCode: newCode },
          include: {
            owner: { select: { id: true, username: true, displayName: true, avatarUrl: true, bio: true } },
            members: { include: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true } } } },
            discussions: {
              include: {
                author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
              },
              orderBy: { createdAt: 'desc' },
            },
          },
        });
      } catch (err) {
        console.error('Failed to auto-generate join code:', err);
      }
    }

    // Security: Hide joinCode for non-members
    if (!isOwner && !isMember) {
      (club as any).joinCode = null;
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

    const { name, description, genre, isPrivate, coverUrl, maxMembers } = await req.json();

    const updated = await prisma.club.update({
      where: { id: clubId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(genre !== undefined && { genre }),
        ...(isPrivate !== undefined && { isPrivate }),
        ...(coverUrl !== undefined && { coverUrl }),
        ...(maxMembers !== undefined && { maxMembers: maxMembers ? parseInt(maxMembers) : null }),
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
