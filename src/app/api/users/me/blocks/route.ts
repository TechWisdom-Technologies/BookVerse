import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';

// GET /api/users/me/blocks — List all blocked users
export async function GET() {
  try {
    const { dbUser } = await verifyToken();

    if (!(await hasFeatureAccess(dbUser, 'PRO'))) {
      return NextResponse.json(paidFeatureError('PRO'), { status: 402 });
    }

    const blocks = await prisma.userBlock.findMany({
      where: { blockerId: dbUser.id },
      include: {
        blocked: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const list = blocks.map((b) => ({
      id: b.id,
      userId: b.blocked.id,
      username: b.blocked.username,
      displayName: b.blocked.displayName,
      avatarUrl: b.blocked.avatarUrl,
      reason: b.reason,
      createdAt: b.createdAt,
    }));

    return NextResponse.json({ blocks: list });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/users/me/blocks error:", error);
    return NextResponse.json({ error: "Failed to fetch block list" }, { status: 500 });
  }
}

// POST /api/users/me/blocks — Block a user by username
export async function POST(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (!(await hasFeatureAccess(dbUser, 'PRO'))) {
      return NextResponse.json(paidFeatureError('PRO'), { status: 402 });
    }
    const body = await request.json();
    const { username, reason } = body;

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const trimmed = username.trim().toLowerCase();

    // Can't block yourself
    if (trimmed === dbUser.username) {
      return NextResponse.json({ error: "You cannot block yourself" }, { status: 400 });
    }

    // Find the target user
    const targetUser = await prisma.user.findUnique({
      where: { username: trimmed },
      select: { id: true, username: true, displayName: true, avatarUrl: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: `User @${trimmed} not found on BookVerse` }, { status: 404 });
    }

    // Check if already blocked
    const existing = await prisma.userBlock.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: dbUser.id,
          blockedId: targetUser.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: `User @${trimmed} is already on your block list` }, { status: 409 });
    }

    // Create block record
    const block = await prisma.userBlock.create({
      data: {
        blockerId: dbUser.id,
        blockedId: targetUser.id,
        reason: reason || "Blocked by user",
      },
    });

    return NextResponse.json({
      block: {
        id: block.id,
        userId: targetUser.id,
        username: targetUser.username,
        displayName: targetUser.displayName,
        avatarUrl: targetUser.avatarUrl,
        reason: block.reason,
        createdAt: block.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/users/me/blocks error:", error);
    return NextResponse.json({ error: "Failed to block user" }, { status: 500 });
  }
}
