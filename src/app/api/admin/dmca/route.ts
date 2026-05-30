import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role, Prisma } from "@prisma/client";
import { createNotification } from "@/lib/notifications";

export async function GET(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const where: Prisma.DMCANoticeWhereInput = {};
    if (search) {
      where.OR = [
        { originalWorkTitle: { contains: search, mode: "insensitive" } },
        { copyrightHolder: { contains: search, mode: "insensitive" } },
      ];
    }

    const [notices, total] = await Promise.all([
      prisma.dMCANotice.findMany({
        where,
        select: {
          id: true,
          storyId: true,
          originalWorkTitle: true,
          originalWorkAuthor: true,
          copyrightHolder: true,
          description: true,
          status: true,
          createdAt: true,
          submittedByUser: { select: { username: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.dMCANotice.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ notices, total, page, totalPages });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/dmca error:", error);
    return NextResponse.json({ error: "Failed to fetch DMCA notices" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { noticeId, status } = body;
    if (!noticeId || typeof status !== "string") {
      return NextResponse.json({ error: "noticeId and status are required" }, { status: 400 });
    }

    const notice = await prisma.dMCANotice.update({ where: { id: noticeId }, data: { status } });

    // Handle Takedown if resolved
    if (status === "RESOLVED") {
      // 1. Unpublish story
      await prisma.story.update({
        where: { id: notice.storyId },
        data: { published: false },
      });

      // 3. Send notification to the author
      try {
        const storyObj = await prisma.story.findUnique({
          where: { id: notice.storyId },
          select: { authorId: true, title: true },
        });
        if (storyObj) {
          await createNotification({
            userId: storyObj.authorId,
            type: "DMCA_TAKEDOWN",
            title: "DMCA Copyright Takedown Notice",
            message: `Your story "${storyObj.title}" has been taken down due to a resolved DMCA copyright dispute.`,
            link: `/stories/${notice.storyId}`,
          });
        }
      } catch (notifError) {
        console.error("Failed to dispatch DMCA notification:", notifError);
      }
    }

    return NextResponse.json({ notice });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Notice not found" }, { status: 404 });
    }
    console.error("PATCH /api/admin/dmca error:", error);
    return NextResponse.json({ error: "Failed to update DMCA notice" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { noticeId } = body;
    if (!noticeId) return NextResponse.json({ error: "noticeId is required" }, { status: 400 });

    await prisma.dMCANotice.delete({ where: { id: noticeId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/admin/dmca error:", error);
    return NextResponse.json({ error: "Failed to delete DMCA notice" }, { status: 500 });
  }
}
