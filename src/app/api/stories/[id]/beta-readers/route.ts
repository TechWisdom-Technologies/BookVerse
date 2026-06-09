import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { hasFeatureAccess, paidFeatureError } from '@/lib/entitlements';
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id: storyId } = await params;
    const user = await getAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: { author: true },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (story.authorId !== user.id && user.role !== "ADMIN") {
      if (!(await hasFeatureAccess(story.author, 'CREATOR'))) {
        return NextResponse.json({ betaReaders: [] });
      }
      const ownInvite = await prisma.betaReader.findUnique({
        where: { storyId_userId: { storyId, userId: user.id } },
      });
      return NextResponse.json({ betaReaders: ownInvite ? [ownInvite] : [] });
    }

    if (story.authorId === user.id && !(await hasFeatureAccess(user, 'CREATOR'))) {
      return NextResponse.json(paidFeatureError('CREATOR'), { status: 402 });
    }

    const betaReaders = await prisma.betaReader.findMany({
      where: { storyId },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ betaReaders });
  } catch (error) {
    console.error("GET /api/stories/[id]/beta-readers error:", error);
    return NextResponse.json({ error: "Failed to fetch beta readers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: storyId } = await params;
    const user = await getAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { username } = body;

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      include: { author: true },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (!(await hasFeatureAccess(story.author, 'CREATOR'))) {
      if (story.authorId === user.id) {
        return NextResponse.json(paidFeatureError('CREATOR'), { status: 402 });
      } else {
        return NextResponse.json({ error: "The author must have a Creator plan to have beta readers" }, { status: 403 });
      }
    }

    let targetUserId = user.id;

    if (username) {
      if (story.authorId !== user.id) {
        return NextResponse.json({ error: "Only the author can add beta readers by username" }, { status: 403 });
      }

      const targetUser = await prisma.user.findUnique({
        where: { username },
      });

      if (!targetUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      targetUserId = targetUser.id;
    }

    if (targetUserId === story.authorId) {
      return NextResponse.json({ error: "Cannot add the author as a beta reader" }, { status: 400 });
    }

    const betaReader = await prisma.betaReader.upsert({
      where: { storyId_userId: { storyId, userId: targetUserId } },
      create: { storyId, userId: targetUserId },
      update: {},
    });

    return NextResponse.json(betaReader, { status: 201 });
  } catch (error) {
    console.error("POST /api/stories/[id]/beta-readers error:", error);
    return NextResponse.json({ error: "Failed to join beta readers" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: storyId } = await params;
    const user = await getAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const userId = body.userId || user.id;
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (user.id !== userId && story.authorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.betaReader.delete({
      where: { storyId_userId: { storyId, userId } },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/stories/[id]/beta-readers error:", error);
    return NextResponse.json({ error: "Failed to remove beta reader" }, { status: 500 });
  }
}
