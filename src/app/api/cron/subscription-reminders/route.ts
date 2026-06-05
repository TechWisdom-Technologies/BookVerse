import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // 1. Authenticate the Cron request (Vercel standard)
    const authHeader = req.headers.get('authorization');
    const isCronLocal = process.env.NODE_ENV === 'development';
    
    if (
      !isCronLocal && 
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Calculate our exact date windows
    const days15Start = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const days15End = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);

    const days5Start = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
    const days5End = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    const days1Start = new Date(now.getTime() + 0 * 24 * 60 * 60 * 1000);
    const days1End = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Fetch all users whose membership expires within the next 15 days
    const expiringUsers = await prisma.user.findMany({
      where: {
        membershipExpiry: {
          gt: now,
          lte: days15End,
        },
        membershipTier: {
          in: ['PRO', 'CREATOR', 'AUTHOR']
        }
      },
      select: {
        id: true,
        membershipExpiry: true,
      }
    });

    let notificationsSent = 0;

    for (const user of expiringUsers) {
      if (!user.membershipExpiry) continue;
      
      const expiry = user.membershipExpiry;
      let daysLeft = 0;

      if (expiry > days15Start && expiry <= days15End) daysLeft = 15;
      else if (expiry > days5Start && expiry <= days5End) daysLeft = 5;
      else if (expiry > days1Start && expiry <= days1End) daysLeft = 1;

      if (daysLeft === 0) continue; // Not in an exact milestone window

      // Check if we already sent a notification for this milestone in the last 24 hours to prevent spam
      const recentNotification = await prisma.notification.findFirst({
        where: {
          userId: user.id,
          type: 'SYSTEM',
          message: { contains: `${daysLeft} day` },
          createdAt: { gte: twentyFourHoursAgo }
        }
      });

      if (!recentNotification) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'SYSTEM',
            title: 'Premium Expiring Soon ⚠️',
            message: `Your Premium membership is expiring in exactly ${daysLeft} day${daysLeft > 1 ? 's' : ''}! Please stack your duration or top-up your wallet to avoid losing your benefits.`,
            link: '/wallet'
          }
        });
        notificationsSent++;
      }
    }

    // 3. Process Automatic Downgrades for Expired Users
    const expiredUsers = await prisma.user.findMany({
      where: {
        membershipExpiry: { lte: now },
        membershipTier: { not: null }
      },
      select: { id: true, role: true }
    });

    let downgradesProcessed = 0;
    for (const user of expiredUsers) {
      const newRole = user.role === 'ADMIN' ? 'ADMIN' : 'MEMBER';
      await prisma.user.update({
        where: { id: user.id },
        data: {
          membershipTier: null,
          role: newRole,
        }
      });
      downgradesProcessed++;
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${notificationsSent} expiry reminders. Downgraded ${downgradesProcessed} expired subscriptions.`,
    });

  } catch (error: any) {
    console.error('[CRON Subscription Reminders]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
