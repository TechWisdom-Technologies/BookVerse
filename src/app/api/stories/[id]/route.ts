import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { storySchema } from "@/lib/validators";
import { indexStory, removeStory } from "@/lib/meilisearch";
import { Role, type ReactionType } from "@prisma/client";
import { createNotification } from "@/lib/notifications";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            _count: { select: { followers: true, following: true } },
          },
        },
        chapters: {
          orderBy: { chapterOrder: "asc" },
          select: {
            id: true,
            title: true,
            chapterOrder: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
          },
        },
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // Don't expose unpublished stories to non-authors
    if (!story.published) {
      try {
        const { dbUser } = await verifyToken();
        if (dbUser.id !== story.authorId && dbUser.role !== "ADMIN") {
          return NextResponse.json({ error: "Story not found" }, { status: 404 });
        }
      } catch {
        return NextResponse.json({ error: "Story not found" }, { status: 404 });
      }
    }

    // Get reaction counts grouped by type
    const reactionCounts = await prisma.storyReaction.groupBy({
      by: ["reactionType"],
      where: { storyId: id },
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

    return NextResponse.json({ story, reactions });
  } catch (error) {
    console.error("GET /api/stories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch story" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.incrementView === true) {
      const story = await prisma.story.findUnique({
        where: { id },
        select: { id: true, published: true },
      });

      if (!story || !story.published) {
        return NextResponse.json({ error: "Story not found" }, { status: 404 });
      }

      const updated = await prisma.story.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
      
      // Milestone check
      const milestones = [100, 500, 1000, 5000, 10000];
      if (milestones.includes(updated.viewCount)) {
        void createNotification({
          userId: updated.authorId,
          type: 'MILESTONE',
          title: 'Story Milestone reached!',
          message: `Congratulations! Your story "${updated.title}" just reached ${updated.viewCount} views.`,
          link: `/stories/${id}`,
        });
      }
      return NextResponse.json({ story: updated });
    }

    const { dbUser } = await verifyToken();

    const existing = await prisma.story.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    if (existing.authorId !== dbUser.id && dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const parsed = storySchema.partial().parse(body);

    const story = await prisma.story.update({
      where: { id },
      data: {
        ...(parsed.title !== undefined && { title: parsed.title }),
        ...(parsed.summary !== undefined && { summary: parsed.summary }),
        ...(parsed.coverUrl !== undefined && { coverUrl: parsed.coverUrl }),
        ...(parsed.published !== undefined && { published: parsed.published }),
      },
      include: {
        author: {
          select: { displayName: true, username: true },
        },
      },
    });

    // Sync with Meilisearch when published status changes
    if (parsed.published === true && !existing.published) {
      void indexStory({
        id: story.id,
        title: story.title,
        summary: story.summary,
        authorName: story.author.displayName || story.author.username,
        published: true,
        coverUrl: story.coverUrl,
        createdAt: story.createdAt.toISOString(),
        viewCount: story.viewCount,
      });

      // Notify followers
      void prisma.follow.findMany({
        where: { followingId: story.authorId },
      }).then(async (followers) => {
        for (const follower of followers) {
          await createNotification({
            userId: follower.followerId,
            type: "STORY_POST",
            title: "New Story Published!",
            message: `${story.author.displayName || story.author.username} just published "${story.title}"`,
            link: `/stories/${story.id}`,
          });
        }
      });

    } else if (parsed.published === false) {
      void removeStory(story.id);
    }

    return NextResponse.json({ story });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("PATCH /api/stories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update story" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { dbUser } = await verifyToken();

    const existing = await prisma.story.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    if (existing.authorId !== dbUser.id && dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.story.delete({ where: { id } });

    // Remove from Meilisearch index
    void removeStory(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/stories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete story" },
      { status: 500 }
    );
  }
}
