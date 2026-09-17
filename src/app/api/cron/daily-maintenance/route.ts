import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { publishScheduledChapters } from '@/lib/publish-chapters';
import { sendEmail } from '@/lib/resend';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const isCronLocal = process.env.NODE_ENV === 'development';
    
    if (!isCronLocal && (!cronSecret || authHeader !== `Bearer ${cronSecret}`)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const stats: any = {};

    // 1. Expire Story Promotions & Send Notifications
    const { createNotification } = await import("@/lib/notifications");

    // 1a. Notify 1 day before expiration
    const promotionsEndingSoon = await prisma.storyPromotion.findMany({
      where: {
        endDate: { gt: now, lte: tomorrow },
        status: "ACTIVE"
      },
      include: { story: true }
    });
    
    let preNotificationsSent = 0;
    for (const promo of promotionsEndingSoon) {
      await createNotification({
        userId: promo.story.authorId,
        type: "SYSTEM",
        title: "Promotion Ending Soon ⚠️",
        message: `Your promotion for "${promo.story.title}" will end in less than 24 hours.`,
        link: `/stories/${promo.story.id}`
      }).catch(() => {});
      preNotificationsSent++;
    }
    stats.promotionRemindersSent = preNotificationsSent;

    // 1b. Expire and notify after end
    const expiredPromotionsList = await prisma.storyPromotion.findMany({
      where: {
        endDate: { lte: now },
        status: { notIn: ["ENDED", "DECLINED"] }
      },
      include: { story: true }
    });

    let endNotificationsSent = 0;
    for (const promo of expiredPromotionsList) {
      await createNotification({
        userId: promo.story.authorId,
        type: "SYSTEM",
        title: "Promotion Ended",
        message: `Your promotion for "${promo.story.title}" has ended.`,
        link: `/stories/${promo.story.id}`
      }).catch(() => {});
      endNotificationsSent++;
    }

    const expiredPromotionsIds = expiredPromotionsList.map(p => p.id);
    if (expiredPromotionsIds.length > 0) {
      const expiredPromotions = await prisma.storyPromotion.updateMany({
        where: { id: { in: expiredPromotionsIds } },
        data: { status: "ENDED" }
      });
      stats.expiredPromotions = expiredPromotions.count;
    } else {
      stats.expiredPromotions = 0;
    }

    // 2. Auto-Reactivate Users & Send Email
    const usersToReactivate = await prisma.user.findMany({
      where: {
        isDeactivated: true,
        deactivatedUntil: { lte: now }
      },
      select: { id: true, email: true, username: true }
    });

    let emailsSent = 0;
    for (const user of usersToReactivate) {
      try {
        await sendEmail(
          user.email,
          "Your Bookverse Account is Reactivated",
          `Hello ${user.username},\n\nYour account has been automatically reactivated. You can now log in and use all features again.\n\nWelcome back!`
        );
        emailsSent++;
      } catch (e) {
        console.error("Failed to send reactivation email to", user.email);
      }
    }

    const reactivatedUserIds = usersToReactivate.map(u => u.id);
    if (reactivatedUserIds.length > 0) {
      const reactivatedUsers = await prisma.user.updateMany({
        where: { id: { in: reactivatedUserIds } },
        data: { isDeactivated: false, deactivatedUntil: null }
      });
      stats.reactivatedUsers = reactivatedUsers.count;
      stats.reactivationEmailsSent = emailsSent;
    } else {
      stats.reactivatedUsers = 0;
    }

    // Helper function for batched deletion to prevent connection timeouts
    async function batchDelete(modelDelegate: any, whereClause: any) {
      let totalDeleted = 0;
      while (true) {
        const records = await modelDelegate.findMany({
          where: whereClause,
          select: { id: true },
          take: 1000
        });
        if (records.length === 0) break;
        
        const res = await modelDelegate.deleteMany({
          where: { id: { in: records.map((r: any) => r.id) } }
        });
        totalDeleted += res.count;
        if (records.length < 1000) break;
      }
      return totalDeleted;
    }

    // 3. Clean Up Old Device Sessions
    stats.deletedDeviceSessions = await batchDelete(prisma.deviceSession, { lastActive: { lte: thirtyDaysAgo } });
    stats.deletedLoginHistory = await batchDelete(prisma.loginHistory, { createdAt: { lte: sixtyDaysAgo } });

    // 4. Expire Unredeemed Gift Memberships
    const expiredGifts = await prisma.giftMembership.updateMany({
      where: {
        expiresAt: { lte: now },
        status: "PENDING"
      },
      data: { status: "EXPIRED" }
    });
    stats.expiredGifts = expiredGifts.count;

    // 5. Clean Up Stale Notifications (Increased to 60 days)
    stats.deletedNotifications = await batchDelete(prisma.notification, { 
      isRead: true, 
      createdAt: { lte: sixtyDaysAgo } 
    });

    // 6. Publish Scheduled Chapters
    const publishedChapters = await publishScheduledChapters();
    stats.publishedChapters = publishedChapters.length;

    const durationMs = Date.now() - startTime;
    
    await prisma.cronJobLog.create({
      data: { 
        jobName: 'daily-maintenance', 
        status: 'SUCCESS', 
        durationMs,
        errorMessage: JSON.stringify(stats)
      }
    }).catch(e => console.error("Failed to log cron:", e));

    return NextResponse.json({
      success: true,
      stats,
      durationMs
    });
  } catch (error: any) {
    console.error('[CRON Daily Maintenance]', error);
    const durationMs = Date.now() - startTime;
    await prisma.cronJobLog.create({
      data: { 
        jobName: 'daily-maintenance', 
        status: 'FAILED', 
        durationMs, 
        errorMessage: error?.message?.substring(0, 500) 
      }
    }).catch(e => console.error("Failed to log cron:", e));

    return NextResponse.json({ error: 'Failed to process daily maintenance' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
