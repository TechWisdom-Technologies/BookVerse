import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { storySchema } from "@/lib/validators";
import { indexStory, removeStory } from "@/lib/meilisearch";
import { Role, type ReactionType } from "@prisma/client";
import { createNotification } from "@/lib/notifications";
import { publishScheduledChapters } from "@/lib/publish-chapters";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    // Run scheduled chapter publisher in background
    void publishScheduledChapters();

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

    let currentUser = null;
    try {
      const { dbUser } = await verifyToken();
      currentUser = dbUser;
    } catch {
      // Not logged in
    }

    // Don't expose unpublished stories to non-authors/non-admins
    if (!story.published) {
      if (!currentUser || (currentUser.id !== story.authorId && currentUser.role !== "ADMIN")) {
        return NextResponse.json({ error: "Story not found" }, { status: 404 });
      }
    }

    const isAuthor = currentUser ? (currentUser.id === story.authorId || currentUser.role === "ADMIN") : false;

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

    return NextResponse.json({ story, reactions, isAuthor });
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
      // Rate limit: Max 30 view increments per minute per IP
      const { checkRateLimit } = await import("@/lib/rate-limit");
      const limitRes = await checkRateLimit(30, 60000);
      if (limitRes.limited) return limitRes.response;

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

    // Clean body before validation: convert empty/null optional fields to undefined
    const cleanBody: Record<string, unknown> = {};
    if (body.title !== undefined) cleanBody.title = body.title;
    if (body.summary !== undefined) cleanBody.summary = body.summary || null;
    if (body.coverUrl !== undefined) cleanBody.coverUrl = body.coverUrl || null;
    if (body.published !== undefined) cleanBody.published = body.published;
    if (body.universeId !== undefined) cleanBody.universeId = body.universeId || null;
    if (body.seriesId !== undefined) cleanBody.seriesId = body.seriesId || null;
    if (body.subGenres !== undefined) cleanBody.subGenres = body.subGenres || [];
    if (body.mood !== undefined) cleanBody.mood = body.mood || null;
    if (body.contentWarnings !== undefined) cleanBody.contentWarnings = body.contentWarnings || [];
    if (body.ageRating !== undefined) cleanBody.ageRating = body.ageRating !== null ? Number(body.ageRating) : 0;
    if (body.tags !== undefined) cleanBody.tags = body.tags || [];
    if (body.description !== undefined) cleanBody.description = body.description || null;

    // sequenceNumber: only pass if it's a valid number
    if (body.sequenceNumber !== undefined && body.sequenceNumber !== null) {
      const seqNum = Number(body.sequenceNumber);
      if (!isNaN(seqNum) && seqNum >= 1) {
        cleanBody.sequenceNumber = seqNum;
      }
    } else if (body.sequenceNumber === null) {
      cleanBody.sequenceNumber = null;
    }

    const parsed = storySchema.partial().parse(cleanBody);

    const story = await prisma.story.update({
      where: { id },
      data: {
        ...(parsed.title !== undefined && { title: parsed.title }),
        ...(parsed.summary !== undefined && { summary: parsed.summary }),
        ...(parsed.coverUrl !== undefined && { coverUrl: parsed.coverUrl }),
        ...(parsed.published !== undefined && { published: parsed.published }),
        ...(parsed.universeId !== undefined && {
          universe: parsed.universeId
            ? { connect: { id: parsed.universeId } }
            : { disconnect: true }
        }),
        ...(parsed.seriesId !== undefined && {
          series: parsed.seriesId
            ? { connect: { id: parsed.seriesId } }
            : { disconnect: true }
        }),
        ...(parsed.sequenceNumber !== undefined && { sequenceNumber: parsed.sequenceNumber }),
        ...(parsed.subGenres !== undefined && { subGenres: parsed.subGenres }),
        ...(parsed.mood !== undefined && { mood: parsed.mood }),
        ...(parsed.contentWarnings !== undefined && { contentWarnings: parsed.contentWarnings }),
        ...(parsed.ageRating !== undefined && { ageRating: parsed.ageRating }),
        ...(parsed.tags !== undefined && { tags: parsed.tags }),
        ...(parsed.description !== undefined && { description: parsed.description }),
      },
      include: {
        author: {
          select: { displayName: true, username: true },
        },
      },
    });

    // Notify universe creator if co-author adds/publishes a story under their universe
    if (story.universeId && story.published) {
      try {
        const universe = await prisma.universe.findUnique({
          where: { id: story.universeId },
          select: { userId: true, name: true },
        });
        if (universe && universe.userId !== story.authorId) {
          const wasAlreadyPublishedUnderThisUniverse = existing.published && existing.universeId === story.universeId;
          if (!wasAlreadyPublishedUnderThisUniverse) {
            await createNotification({
              userId: universe.userId,
              type: "STORY_POST",
              title: "New Collaborator Contribution!",
              message: `${story.author.displayName || story.author.username} added a book "${story.title}" to your universe "${universe.name}"!`,
              link: `/stories/${story.id}`,
            });
          }
        }
      } catch (notifErr) {
        console.error("Failed to notify universe owner of co-author contribution:", notifErr);
      }
    }

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
    // Return Zod validation errors
    if (error && typeof error === "object" && "issues" in error) {
      return NextResponse.json(
        { error: "Validation failed", details: (error as { issues: unknown }).issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update story" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { dbUser } = await verifyToken();

    const existing = await prisma.story.findUnique({ 
      where: { id },
      include: { chapters: true }
    });
    
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
