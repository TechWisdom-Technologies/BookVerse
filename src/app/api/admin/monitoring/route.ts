import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRole } from "@/lib/cookie-crypto";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Verify Admin Auth
    const cookieStore = await cookies();
    const role = cookieStore.get("user-role")?.value;
    const roleSig = cookieStore.get("user-role-sig")?.value;
    const isRoleValid = await verifyRole(role || "", roleSig || "");

    if (!isRoleValid || role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch Data in Parallel
    const [
      tierDistributionRaw,
      totalUsers,
      totalQuizzesStarted,
      totalQuizzesCompleted,
      recentRateLimits,
      recentCronLogs,
      recentFailedWebhooks,
      recentSlowApis,
      recentCrashes,
      activeDbConnectionsRaw,
      dauSessions,
      mauSessions,
      readingLogsToday,
      authorWallets
    ] = await Promise.all([
      // Tier Distribution
      prisma.user.groupBy({
        by: ["membershipTier"],
        _count: true,
      }),

      // Onboarding Stats
      prisma.user.count(),
      prisma.onboardingQuiz.count(),
      prisma.onboardingQuiz.count({ where: { completed: true } }),

      // Rate Limit Violations (last 50)
      prisma.rateLimitViolation.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),

      // Cron Logs (last 50)
      prisma.cronJobLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),

      // Failed Webhooks
      prisma.failedWebhookLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),

      // Slow APIs
      prisma.slowApiLog.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),

      // Crash Reports
      prisma.crashReport.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),

      // DB Connections
      prisma.$queryRaw<{ numbackends: number }[]>`
        SELECT numbackends 
        FROM pg_stat_database 
        WHERE datname = current_database();
      `.catch(() => [{ numbackends: 0 }]), // Fallback if pg_stat_database is restricted

      // DAU (last 24h)
      prisma.deviceSession.findMany({
        where: { lastActive: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
        distinct: ['userId'],
        select: { userId: true },
      }),

      // MAU (last 30d)
      prisma.deviceSession.findMany({
        where: { lastActive: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        distinct: ['userId'],
        select: { userId: true },
      }),

      // Reading Time Today
      prisma.readingLog.aggregate({
        _sum: { minutes: true },
        where: { date: { gte: new Date(new Date().setHours(0,0,0,0)) } },
      }),

      // Total Author Payout Queue (sum wallet balances)
      prisma.user.aggregate({
        _sum: { walletBalance: true },
        where: { role: 'AUTHOR' },
      })
    ]);

    // 3. Format Data
    // Replace null with "FREE" for tier distribution
    const tierDistribution = tierDistributionRaw.map(t => ({
      tier: t.membershipTier || "FREE",
      count: t._count
    }));

    // Combine duplicate FREE counts if any exist (e.g. null and "FREE")
    const formattedTiers = tierDistribution.reduce((acc, curr) => {
      const existing = acc.find(a => a.tier === curr.tier);
      if (existing) {
        existing.count += curr.count;
      } else {
        acc.push(curr);
      }
      return acc;
    }, [] as { tier: string, count: number }[]);

    const activeDbConnections = Number(activeDbConnectionsRaw?.[0]?.numbackends || 0);

    const dau = dauSessions.length;
    const mau = mauSessions.length;
    const readingMinutesToday = readingLogsToday._sum.minutes || 0;
    const authorPayoutQueue = authorWallets._sum.walletBalance || 0;

    return NextResponse.json({
      success: true,
      data: {
        tierDistribution: formattedTiers,
        onboarding: {
          totalUsers,
          startedQuizzes: totalQuizzesStarted,
          completedQuizzes: totalQuizzesCompleted,
        },
        activeDbConnections,
        recentRateLimits,
        recentCronLogs,
        recentFailedWebhooks,
        recentSlowApis,
        recentCrashes,
        engagement: {
          dau,
          mau,
          readingMinutesToday
        },
        financials: {
          authorPayoutQueue
        }
      }
    });

  } catch (error: any) {
    console.error("Monitoring API Error:", error);
    return NextResponse.json({ error: "Failed to fetch monitoring data" }, { status: 500 });
  }
}
