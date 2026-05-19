import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

/**
 * POST /api/clubs/[clubId]/manage
 * Ban a member or generate join code (owner only)
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
    const body = await req.json();
    const { action, userId, reason } = body;

    // Check if user is club owner
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { ownerId: true, isPrivate: true, joinCode: true },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    if (club.ownerId !== dbUser.id) {
      return NextResponse.json({ error: 'Only club owner can manage' }, { status: 403 });
    }

    // Kick member (remove membership but don't ban)
    if (action === 'kick') {
      const targetId = userId || body.targetUserId;
      if (!targetId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
      }

      if (targetId === dbUser.id) {
        return NextResponse.json({ error: 'Cannot kick yourself' }, { status: 400 });
      }

      await prisma.clubMember.deleteMany({
        where: { clubId, userId: targetId },
      });

      return NextResponse.json({ success: true });
    }

    // Ban member
    if (action === 'ban') {
      if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
      }

      // Can't ban the owner
      if (userId === dbUser.id) {
        return NextResponse.json({ error: 'Cannot ban yourself' }, { status: 400 });
      }

      // Remove from members first
      await prisma.clubMember.deleteMany({
        where: { clubId, userId },
      });

      // Add to banned list
      const ban = await prisma.clubBan.create({
        data: {
          clubId,
          userId,
          reason: reason || 'No reason provided',
          bannedBy: dbUser.id,
        },
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
      });

      return NextResponse.json({ success: true, ban }, { status: 201 });
    }

    // Generate join code (supporting both generate-code and generate_code actions)
    if (action === 'generate-code' || action === 'generate_code') {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      
      await prisma.club.update({
        where: { id: clubId },
        data: { joinCode: code },
      });

      return NextResponse.json({ 
        success: true, 
        code,
        joinCode: code,
        joinUrl: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/clubs/${clubId}?code=${code}`
      });
    }

    // Clear join code
    if (action === 'clear-code') {
      await prisma.club.update({
        where: { id: clubId },
        data: { joinCode: null },
      });

      return NextResponse.json({ success: true });
    }

    // Update club settings (maxMembers, isPrivate)
    if (action === 'update-settings') {
      const { maxMembers, isPrivate } = body;
      
      const updated = await prisma.club.update({
        where: { id: clubId },
        data: {
          ...(maxMembers !== undefined && { maxMembers: maxMembers ? parseInt(maxMembers) : null }),
          ...(isPrivate !== undefined && { isPrivate }),
        },
      });

      return NextResponse.json({ success: true, club: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error managing club:', error);
    return NextResponse.json(
      { error: 'Failed to manage club', details: error?.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/clubs/[clubId]/manage
 * Unban a user (owner only)
 */
export async function DELETE(
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
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Check if user is club owner
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { ownerId: true },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    if (club.ownerId !== dbUser.id) {
      return NextResponse.json({ error: 'Only club owner can manage' }, { status: 403 });
    }

    // Remove ban
    await prisma.clubBan.deleteMany({
      where: { clubId, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error unbanning user:', error);
    return NextResponse.json(
      { error: 'Failed to unban user', details: error?.message },
      { status: 500 }
    );
  }
}
