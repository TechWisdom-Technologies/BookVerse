import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get today's start time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get start of this week
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    const [
      totalUsers,
      totalBooks,
      totalStories,
      totalComments,
      newUsersThisWeek,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.book.count(),
      prisma.story.count(),
      prisma.comment.count(),
      prisma.user.count({
        where: { createdAt: { gte: thisWeek } },
      }),
    ]);

    // Get downloads today (sum of downloadCount from books updated today)
    const booksDownloadedToday = await prisma.book.findMany({
      where: { updatedAt: { gte: today } },
      select: { downloadCount: true },
    });
    const downloadsToday = booksDownloadedToday.reduce(
      (sum, book) => sum + book.downloadCount,
      0
    );

    return NextResponse.json({
      totalUsers,
      totalBooks,
      totalStories,
      totalComments,
      downloadsToday,
      newUsersThisWeek,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
