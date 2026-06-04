import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import type { ReactionType } from "@prisma/client";
import { createNotification } from "@/lib/notifications";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const VALID_REACTIONS: ReactionType[] = ["LIKE", "LOVE", "FIRE", "CRY", "WOW"];

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id: storyId } = await params;

    const reactionCounts = await prisma.storyReaction.groupBy({
      by: ["reactionType"],
      where: { storyId },
      _count: true,
    });

    const reactions: Record<ReactionType, number> = {
      LIKE: 0,
      LOVE: 0,
      FIRE: 0,
      CRY: 0,
      WOW: 0,
    };

    for (const rc of reactionCounts) {
      reactions[rc.reactionType] = rc._count;
    }

    // Check if current user has reacted
    let userReaction: ReactionType | null = null;
    try {
      const { dbUser } = await verifyToken();
      const existing = await prisma.storyReaction.findUnique({
        where: {
          storyId_userId: { storyId, userId: dbUser.id },
        },
      });
      if (existing) {
        userReaction = existing.reactionType;
      }
    } catch {
      // Not logged in — that's fine
    }

    return NextResponse.json({ reactions, userReaction });
  } catch (error) {
    console.error("GET /api/stories/[id]/reactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: storyId } = await params;
    const { dbUser } = await verifyToken();

    const body = await request.json();
    const reactionType = body.reactionType as ReactionType;

    if (!VALID_REACTIONS.includes(reactionType)) {
      return NextResponse.json(
        { error: "Invalid reaction type" },
        { status: 400 }
      );
    }

    // Check if user already has a reaction
    const existing = await prisma.storyReaction.findUnique({
      where: {
        storyId_userId: { storyId, userId: dbUser.id },
      },
    });

    if (existing) {
      if (existing.reactionType === reactionType) {
        // Same reaction — toggle it off
        await prisma.$transaction([
          prisma.storyReaction.delete({
            where: { id: existing.id },
          }),
          prisma.story.update({
            where: { id: storyId },
            data: { reactionCount: { decrement: 1 } },
          }),
        ]);
        return new NextResponse(null, { status: 204 });
      }
      // Different reaction — update it
      const updated = await prisma.storyReaction.update({
        where: { id: existing.id },
        data: { reactionType },
      });
      return NextResponse.json({ reaction: updated });
    }

    // No existing reaction — create new
    const [reaction] = await prisma.$transaction([
      prisma.storyReaction.create({
        data: {
          storyId,
          userId: dbUser.id,
          reactionType,
        },
      }),
      prisma.story.update({
        where: { id: storyId },
        data: { reactionCount: { increment: 1 } },
      }),
    ]);

    // Notify story author (fire and forget)
    void prisma.story.findUnique({
      where: { id: storyId },
      select: { authorId: true, title: true }
    }).then(async (story) => {
      if (story && story.authorId !== dbUser.id) {
        await createNotification({
          userId: story.authorId,
          type: "REACT",
          title: "New Reaction",
          message: `${dbUser.displayName || dbUser.username} reacted to your story "${story.title}" with a ${reactionType}`,
          link: `/stories/${storyId}`,
        });
      }
    });

    return NextResponse.json({ reaction }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/stories/[id]/reactions error:", error);
    return NextResponse.json(
      { error: "Failed to toggle reaction" },
      { status: 500 }
    );
  }
}
