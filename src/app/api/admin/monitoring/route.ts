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
      dbConnectionsRaw
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

      // Rate Limit Violations (last 20)
      prisma.rateLimitViolation.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),

      // Cron Logs (last 15)
      prisma.cronJobLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 15,
      }),

      // DB Connections
      prisma.$queryRaw<{ numbackends: number }[]>`
        SELECT numbackends 
        FROM pg_stat_database 
        WHERE datname = current_database();
      `.catch(() => [{ numbackends: 0 }]) // Fallback if pg_stat_database is restricted
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

    const activeDbConnections = Number(dbConnectionsRaw?.[0]?.numbackends || 0);

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
        recentCronLogs
      }
    });

  } catch (error: any) {
    console.error("Monitoring API Error:", error);
    return NextResponse.json({ error: "Failed to fetch monitoring data" }, { status: 500 });
  }
}
