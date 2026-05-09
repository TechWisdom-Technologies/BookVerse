import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { sendFollowNotification } from "@/lib/resend";
import { z } from "zod";
import { createNotification } from "@/lib/notifications";

const followSchema = z.object({
  followingId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    const body = await request.json();

    const { followingId } = followSchema.parse(body);

    // Prevent self-follow
    if (dbUser.id === followingId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: followingId },
    });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        followerId: dbUser.id,
        followingId,
      },
    });

    // Send follow notification email (fire-and-forget, non-blocking)
    void sendFollowNotification(targetUser.email, {
      userName: targetUser.displayName || targetUser.username,
      followerName: dbUser.displayName || dbUser.username,
      followerAvatarUrl: dbUser.avatarUrl,
    });

    // Send in-app notification (fire-and-forget)
    void createNotification({
      userId: targetUser.id,
      type: "FOLLOW",
      title: "New Follower",
      message: `${dbUser.displayName || dbUser.username} started following you!`,
      link: `/profile/${dbUser.username}`,
    });

    return NextResponse.json({ follow }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: "Already following" }, { status: 409 });
    }
    console.error("POST /api/follow error:", error);
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    const { searchParams } = new URL(request.url);
    const followingId = searchParams.get("followingId");

    if (!followingId) {
      return NextResponse.json(
        { error: "followingId required" },
        { status: 400 }
      );
    }

    await prisma.follow.deleteMany({
      where: {
        followerId: dbUser.id,
        followingId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/follow error:", error);
    return NextResponse.json(
      { error: "Failed to unfollow user" },
      { status: 500 }
    );
  }
}
