import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { storySchema } from "@/lib/validators";
import { Prisma } from "@prisma/client";
import { publishScheduledChapters } from "@/lib/publish-chapters";
import { hasFeatureAccess } from "@/lib/entitlements";
import { getSortedStoryIds } from "@/lib/story-ranking";

export async function GET(request: Request) {
  try {
    // Dynamically publish any chapters scheduled for release
    void publishScheduledChapters();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "12"));
    const sort = searchParams.get("sort") || "popular"; // DEFAULT to popular!
    const genre = searchParams.get("genre") || "";
    const skip = (page - 1) * limit;

    const { ids: rankedStoryIds, total } = await getSortedStoryIds(genre, sort);
    const paginatedIds = rankedStoryIds.slice(skip, skip + limit);

    // Fetch full data for only the paginated stories
    const storiesUnsorted = await prisma.story.findMany({
      where: { id: { in: paginatedIds } },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        series: { select: { name: true } },
        universe: { select: { name: true } },
        _count: {
          select: {
            chapters: true,
            reactions: true,
            comments: true,
          },
        },
      },
    });

    // Re-order the fetched stories to match the ranked order
    const stories = paginatedIds
      .map(id => storiesUnsorted.find(s => s.id === id))
      .filter((s): s is NonNullable<typeof s> => s !== undefined);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      stories,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error("GET /api/stories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (!(await hasFeatureAccess(dbUser, "AUTHOR"))) {
      return NextResponse.json({ error: "Author plan required to create stories." }, { status: 403 });
    }

    const body = await request.json();
    const parsed = storySchema.parse(body);

    const story = await prisma.story.create({
      data: {
        title: parsed.title,
        summary: parsed.summary ?? null,
        coverUrl: parsed.coverUrl ?? null,
        genre: parsed.genre ?? null,
        contentWarnings: parsed.contentWarnings ?? [],
        authorId: dbUser.id,
        published: false,
      },
    });

    // Create a default first chapter
    await prisma.storyChapter.create({
      data: {
        storyId: story.id,
        title: "Chapter 1",
        content: Prisma.JsonNull,
        chapterNumber: 1,
        chapterOrder: 1,
      },
    });

    return NextResponse.json({ story }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/stories error:", error);
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    );
  }
}
