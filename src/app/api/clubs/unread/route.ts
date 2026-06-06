import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all memberships for the user
    const memberships = await prisma.clubMember.findMany({
      where: { userId: user.id },
      include: {
        club: {
          include: {
            discussions: {
              where: {
                createdAt: {
                  // Wait, we need to compare with lastReadAt per club.
                  // This is easier done in memory if clubs have few recent discussions,
                  // or by separate aggregations.
                  // Let's do it in JS for simplicity since we just need counts.
                }
              },
              select: { createdAt: true }
            }
          }
        }
      }
    });

    let totalUnreadClubs = 0;
    const unreadCountsByClub: Record<string, number> = {};

    for (const member of memberships) {
      const lastRead = member.lastReadAt || new Date(0);
      let unreadInClub = 0;
      
      for (const discussion of member.club.discussions) {
        if (discussion.createdAt > lastRead) {
          unreadInClub++;
        }
      }

      unreadCountsByClub[member.clubId] = unreadInClub;
      if (unreadInClub > 0) {
        totalUnreadClubs++;
      }
    }

    return NextResponse.json({
      hasUnread: totalUnreadClubs > 0,
      totalUnreadClubs,
      unreadCountsByClub
    });

  } catch (error) {
    console.error('Error fetching unread clubs info:', error);
    return NextResponse.json({ error: 'Failed to retrieve unread info' }, { status: 500 });
  }
}
