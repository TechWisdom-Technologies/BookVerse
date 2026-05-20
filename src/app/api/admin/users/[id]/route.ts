import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        membershipTier: true,
        membershipExpiry: true,
        reactionCount: true,
        tags: true,
        subGenres: true,
        achievements: { select: { achievement: { select: { id: true, name: true, points: true } }, earnedAt: true } },
        newsletterSubs: { select: { author: { select: { id: true, username: true } }, createdAt: true } },
        dmcaNotices: { select: { id: true, storyId: true, status: true, createdAt: true } },
        _count: {
          select: { books: true, stories: true, followers: true, readingLogs: true, comments: true },
        },
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // compute simple analytics: recent reading logs count, etc.
    const recentReads = await prisma.readingLog.count({ where: { userId: id, createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30) } } });

    return NextResponse.json({ user, analytics: { recentReads } });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/users/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
