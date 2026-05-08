import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role, Prisma } from "@prisma/client";
import { removeStory } from "@/lib/meilisearch";

export async function GET(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const where: Prisma.StoryWhereInput = {};
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const [stories, total] = await Promise.all([
      prisma.story.findMany({
        where,
        select: {
          id: true,
          title: true,
          coverUrl: true,
          published: true,
          viewCount: true,
          createdAt: true,
          author: {
            select: { username: true, displayName: true },
          },
          _count: { select: { chapters: true, comments: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.story.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ stories, total, page, totalPages });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/stories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { storyId, published } = body;

    if (!storyId || typeof published !== "boolean") {
      return NextResponse.json(
        { error: "storyId and published are required" },
        { status: 400 }
      );
    }

    const story = await prisma.story.update({
      where: { id: storyId },
      data: { published },
      select: {
        id: true,
        title: true,
        published: true,
      },
    });

    // Remove from Meilisearch if unpublished
    if (!published) {
      void removeStory(storyId);
    }

    return NextResponse.json({ story });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    console.error("PATCH /api/admin/stories error:", error);
    return NextResponse.json(
      { error: "Failed to update story" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { storyId } = body;

    if (!storyId) {
      return NextResponse.json(
        { error: "storyId is required" },
        { status: 400 }
      );
    }

    // Remove from Meilisearch index
    void removeStory(storyId);

    await prisma.story.delete({ where: { id: storyId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    console.error("DELETE /api/admin/stories error:", error);
    return NextResponse.json(
      { error: "Failed to delete story" },
      { status: 500 }
    );
  }
}
