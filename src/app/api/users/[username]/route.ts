import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

interface RouteParams {
  params: Promise<{ username: string }>;
}

async function getCurrentUserId() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebase-token")?.value;
    if (!token) return null;

    const decoded = await adminAuth.verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      select: { id: true },
    });

    return user?.id ?? null;
  } catch {
    return null;
  }
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { username } = await params;
    const currentUserId = await getCurrentUserId();

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
        books: {
          select: {
            id: true,
            title: true,
            authorName: true,
            coverUrl: true,
            genre: true,
            downloadCount: true,
            createdAt: true,
            _count: { select: { reviews: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        stories: {
          where: { published: true },
          select: {
            id: true,
            title: true,
            coverUrl: true,
            summary: true,
            viewCount: true,
            createdAt: true,
            _count: {
              select: {
                chapters: true,
                reactions: true,
                comments: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if current user is following this user
    const isFollowing = currentUserId
      ? await prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUserId,
              followingId: user.id,
            },
          },
        })
      : null;

    return NextResponse.json({
      user: {
        ...user,
        isFollowing: !!isFollowing,
        isOwnProfile: currentUserId === user.id,
      },
    });
  } catch (error) {
    console.error("GET /api/users/[username] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
