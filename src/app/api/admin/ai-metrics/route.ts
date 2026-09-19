import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Real Free Tier limits (Multiplied by number of keys)
const PROVIDER_LIMITS: Record<string, { type: string, limits: any }> = {
  GEMINI: { 
    type: "TEXT", 
    limits: {
      rpm: 60,       // 15 * 4 keys
      rph: 3600,     // 60 * 60
      rpd: 6000,     // 1500 * 4 keys
      rpw: 42000,    // 6000 * 7
      rpm_month: 180000 // 6000 * 30
    } 
  }, 
  GROQ: { 
    type: "TEXT", 
    limits: {
      rpm: 150,      // 30 * 5 keys
      rph: 9000,     // 150 * 60
      rpd: 72000,    // 14400 * 5 keys
      rpw: 504000,
      rpm_month: 2160000
    }
  },
  CLOUDFLARE_AI: { 
    type: "IMAGE", 
    limits: {
      rpm: 720,      // standard CF workers AI limit
      rph: 43200,    // theoretically 720 * 60
      rpd: 10000,    // ~10k neurons daily free
      rpw: 70000,
      rpm_month: 300000
    } 
  },
  POLLINATIONS: { 
    type: "IMAGE", 
    limits: {
      rpm: 60,       // safety cap
      rph: 3600,
      rpd: 1000,
      rpw: 7000,
      rpm_month: 30000
    }
  },
};

export async function GET(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const now = new Date();
    
    // Exact sliding windows
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Run aggregations concurrently for exact timeframes
    const [allTime, minData, hrData, dayData, wkData, moData] = await Promise.all([
      prisma.aITokenUsage.groupBy({
        by: ["provider", "type"],
        _sum: { tokens: true, durationMs: true },
        _count: { id: true }
      }),
      prisma.aITokenUsage.groupBy({
        by: ["provider", "type"],
        _sum: { tokens: true, durationMs: true },
        _count: { id: true },
        where: { createdAt: { gte: oneMinuteAgo } },
      }),
      prisma.aITokenUsage.groupBy({
        by: ["provider", "type"],
        _sum: { tokens: true, durationMs: true },
        _count: { id: true },
        where: { createdAt: { gte: oneHourAgo } },
      }),
      prisma.aITokenUsage.groupBy({
        by: ["provider", "type"],
        _sum: { tokens: true, durationMs: true },
        _count: { id: true },
        where: { createdAt: { gte: oneDayAgo } },
      }),
      prisma.aITokenUsage.groupBy({
        by: ["provider", "type"],
        _sum: { tokens: true, durationMs: true },
        _count: { id: true },
        where: { createdAt: { gte: oneWeekAgo } },
      }),
      prisma.aITokenUsage.groupBy({
        by: ["provider", "type"],
        _sum: { tokens: true, durationMs: true },
        _count: { id: true },
        where: { createdAt: { gte: oneMonthAgo } },
      }),
    ]);

    // Initialize metrics with ALL providers, even if 0 usage
    const metrics: Record<string, any> = {};
    Object.keys(PROVIDER_LIMITS).forEach(provider => {
      metrics[provider] = {
        provider,
        type: PROVIDER_LIMITS[provider].type,
        limits: PROVIDER_LIMITS[provider].limits,
        minute: { tokens: 0, operations: 0, duration: 0 },
        hour: { tokens: 0, operations: 0, duration: 0 },
        day: { tokens: 0, operations: 0, duration: 0 },
        week: { tokens: 0, operations: 0, duration: 0 },
        month: { tokens: 0, operations: 0, duration: 0 },
        total: { tokens: 0, operations: 0, duration: 0 },
      };
    });

    const processData = (dataArray: any[], period: string) => {
      dataArray.forEach((item) => {
        const key = item.provider;
        if (!metrics[key]) {
          metrics[key] = {
            provider: item.provider,
            type: item.type,
            limits: { rpm: 60, rph: 3600, rpd: 6000, rpw: 42000, rpm_month: 180000 },
            minute: { tokens: 0, operations: 0, duration: 0 },
            hour: { tokens: 0, operations: 0, duration: 0 },
            day: { tokens: 0, operations: 0, duration: 0 },
            week: { tokens: 0, operations: 0, duration: 0 },
            month: { tokens: 0, operations: 0, duration: 0 },
            total: { tokens: 0, operations: 0, duration: 0 },
          };
        }
        metrics[key][period] = {
          tokens: item._sum.tokens || 0,
          operations: item._count.id || 0,
          duration: item._sum.durationMs || 0,
        };
      });
    };

    processData(minData, "minute");
    processData(hrData, "hour");
    processData(dayData, "day");
    processData(wkData, "week");
    processData(moData, "month");
    processData(allTime, "total");

    return NextResponse.json(Object.values(metrics));
  } catch (error) {
    console.error("Error fetching AI metrics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
