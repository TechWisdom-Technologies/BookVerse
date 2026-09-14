import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type");
    const priority = searchParams.get("priority");
    const dateRange = searchParams.get("dateRange");

    // Build dynamic where clause
    const where: any = { userId: dbUser.id };

    // Filter by type
    if (type && type !== "all") {
      const typeMap: Record<string, string[]> = {
        reactions: ["REACT"],
        comments: ["COMMENT", "REPLY"],
        stories: ["STORY_POST"],
        community: ["DISCUSSION", "NEWSLETTER_SUBSCRIBE"],
        membership: ["MEMBERSHIP_UPGRADE", "MEMBERSHIP_DECLINED"],
      };
      if (typeMap[type]) {
        where.type = { in: typeMap[type] };
      }
    }

    // Filter by priority
    if (priority && priority !== "all") {
      where.priority = priority;
    }

    // Filter by date range
    if (dateRange && dateRange !== "all") {
      const now = new Date();
      let dateFrom: Date;

      switch (dateRange) {
        case "today":
          dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateFrom = new Date(0);
      }

      where.createdAt = { gte: dateFrom };
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: dbUser.id, isRead: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
