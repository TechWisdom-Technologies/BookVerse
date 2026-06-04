import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { storySchema } from "@/lib/validators";
import { Prisma } from "@prisma/client";
import { publishScheduledChapters } from "@/lib/publish-chapters";

export async function GET(request: Request) {
  try {
    // Dynamically publish any chapters scheduled for release
    void publishScheduledChapters();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "12"));
    const sort = searchParams.get("sort") || "recent";
    const genre = searchParams.get("genre") || "";
    const skip = (page - 1) * limit;

    const where: Prisma.StoryWhereInput = { 
      published: true,
      author: {
        isDeactivated: false,
      }
    };
    if (genre) {
      where.summary = { contains: genre, mode: "insensitive" };
    }

    type StoryOrderBy =
      | { createdAt: "desc" }
      | { viewCount: "desc" };

    let orderBy: StoryOrderBy = { createdAt: "desc" };
    if (sort === "popular") {
      orderBy = { viewCount: "desc" };
    }

    const [stories, total] = await Promise.all([
      prisma.story.findMany({
        where,
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
        orderBy,
        skip,
        take: limit,
      }),
      prisma.story.count({ where }),
    ]);

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

    if (dbUser.role !== "AUTHOR" && dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Only authors can create stories." }, { status: 403 });
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
