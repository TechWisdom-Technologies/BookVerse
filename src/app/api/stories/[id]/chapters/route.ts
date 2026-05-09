import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Prisma } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id: storyId } = await params;

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true, published: true, authorId: true },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

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

    const chapters = await prisma.storyChapter.findMany({
      where: { storyId },
      orderBy: { chapterOrder: "asc" },
      select: {
        id: true,
        title: true,
        chapterOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error("GET /api/stories/[id]/chapters error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapters" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: storyId } = await params;
    const { dbUser } = await verifyToken();

    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    if (story.authorId !== dbUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const title = typeof body.title === "string" && body.title.trim().length > 0
      ? body.title.trim()
      : "Untitled Chapter";

    // Get the next chapter order
    const lastChapter = await prisma.storyChapter.findFirst({
      where: { storyId },
      orderBy: { chapterOrder: "desc" },
      select: { chapterOrder: true },
    });

    const nextOrder = (lastChapter?.chapterOrder ?? 0) + 1;

    const chapter = await prisma.storyChapter.create({
      data: {
        storyId,
        title,
        content: Prisma.JsonNull,
        chapterNumber: nextOrder,
        chapterOrder: nextOrder,
      },
    });

    return NextResponse.json({ chapter }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/stories/[id]/chapters error:", error);
    return NextResponse.json(
      { error: "Failed to create chapter" },
      { status: 500 }
    );
  }
}
