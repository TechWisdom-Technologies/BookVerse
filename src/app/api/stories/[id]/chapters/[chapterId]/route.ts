import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import { deleteFromR2 } from "@/lib/r2";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function deleteImage(url: string | null) {
  if (!url) return;
  try {
    if (url.includes("cloudinary.com")) {
      const urlParts = url.split("/");
      const filename = urlParts[urlParts.length - 1];
      const publicId = "bookverse/illustrations/" + filename.split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    } else if (url.includes(process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace("https://", "") || "r2.dev")) {
      const urlObj = new URL(url);
      const key = urlObj.pathname.replace(/^\/+/, "");
      await deleteFromR2(key);
    }
  } catch (error) {
    console.error("Failed to delete image:", error);
  }
}

interface RouteParams {
  params: Promise<{ id: string; chapterId: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { chapterId } = await params;

    const chapter = await prisma.storyChapter.findUnique({
      where: { id: chapterId },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            published: true,
            authorId: true,
          },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    if (!chapter.story.published) {
      try {
        const { dbUser } = await verifyToken();
        if (dbUser.id !== chapter.story.authorId && dbUser.role !== "ADMIN") {
          return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
        }
      } catch {
        return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
      }
    }

    // Get sibling chapters for navigation
    const siblings = await prisma.storyChapter.findMany({
      where: { storyId: chapter.storyId },
      orderBy: { chapterOrder: "asc" },
      select: { id: true, title: true, chapterOrder: true },
    });

    const currentIndex = siblings.findIndex((s) => s.id === chapterId);
    const prevChapter = currentIndex > 0 ? siblings[currentIndex - 1] : null;
    const nextChapter = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;

    return NextResponse.json({
      chapter,
      prevChapter,
      nextChapter,
      totalChapters: siblings.length,
    });
  } catch (error) {
    console.error("GET /api/stories/[id]/chapters/[chapterId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chapter" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id: storyId, chapterId } = await params;
    const { dbUser } = await verifyToken();

    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    if (story.authorId !== dbUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const currentChapter = await prisma.storyChapter.findUnique({
      where: { id: chapterId },
      select: { illustrationUrl: true },
    });

    if (!currentChapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (typeof body.title === "string") updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    
    if (body.illustrationUrl !== undefined) {
      // If we are replacing or removing an illustration, delete the old one
      if (currentChapter.illustrationUrl && currentChapter.illustrationUrl !== body.illustrationUrl) {
        await deleteImage(currentChapter.illustrationUrl);
      }
      updateData.illustrationUrl = body.illustrationUrl;
    }

    if (typeof body.chapterOrder === "number") updateData.chapterOrder = body.chapterOrder;

    const chapter = await prisma.storyChapter.update({
      where: { id: chapterId },
      data: updateData,
    });

    return NextResponse.json({ chapter });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("PATCH /api/stories/[id]/chapters/[chapterId] error:", error);
    return NextResponse.json(
      { error: "Failed to update chapter" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id: storyId, chapterId } = await params;
    const { dbUser } = await verifyToken();

    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    if (story.authorId !== dbUser.id && dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const chapter = await prisma.storyChapter.findUnique({
      where: { id: chapterId },
    });
    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.storyChapter.delete({ where: { id: chapterId } });
      // Reorder remaining chapters to fill the gap
      await tx.storyChapter.updateMany({
        where: {
          storyId,
          chapterOrder: { gt: chapter.chapterOrder },
        },
        data: {
          chapterOrder: { decrement: 1 },
          chapterNumber: { decrement: 1 },
        },
      });
    });

    // Delete illustration from storage if it exists
    if (chapter.illustrationUrl) {
      await deleteImage(chapter.illustrationUrl);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/stories/[id]/chapters/[chapterId] error:", error);
    return NextResponse.json(
      { error: "Failed to delete chapter" },
      { status: 500 }
    );
  }
}
