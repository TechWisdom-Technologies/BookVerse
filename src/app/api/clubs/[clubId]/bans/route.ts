import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/clubs/[clubId]/bans
 * Get banned users (owner only)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clubId: string }> }
) {
  try {
    const dbUser = await getCurrentUser();
    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clubId } = await params;

    // Check if user is club owner
    const club = await prisma.club.findUnique({
      where: { id: clubId },
      select: { ownerId: true },
    });

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 });
    }

    if (club.ownerId !== dbUser.id) {
      return NextResponse.json({ error: 'Only club owner can view bans' }, { status: 403 });
    }

    const bans = await prisma.clubBan.findMany({
      where: { clubId },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        bannedByUser: {
          select: { id: true, username: true, displayName: true },
        },
      },
      orderBy: { bannedAt: 'desc' },
    });

    return NextResponse.json({ bans });
  } catch (error: any) {
    console.error('Error fetching bans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bans', details: error?.message },
      { status: 500 }
    );
  }
}
