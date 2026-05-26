import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role, Prisma } from "@prisma/client";
import { removeStory } from "@/lib/meilisearch";
import { createNotification } from "@/lib/notifications";

export async function GET(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search") || "";
    const reasonFilter = searchParams.get("reason") || "";
    const skip = (page - 1) * limit;

    const where: Prisma.ContentReportWhereInput = {};
    
    if (reasonFilter && reasonFilter !== "ALL") {
      where.reason = reasonFilter;
    }

    if (search) {
      where.OR = [
        { reason: { contains: search, mode: "insensitive" } },
        { story: { title: { contains: search, mode: "insensitive" } } },
        { reporter: { username: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [reports, total] = await Promise.all([
      prisma.contentReport.findMany({
        where,
        include: {
          reporter: {
            select: {
              id: true,
              username: true,
              displayName: true,
              email: true,
              avatarUrl: true,
            },
          },
          story: {
            select: {
              id: true,
              title: true,
              published: true,
              coverUrl: true,
              authorId: true,
              viewCount: true,
              author: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contentReport.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ reports, total, page, totalPages });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/reports error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { reportId, status } = body;
    if (!reportId || typeof status !== "string") {
      return NextResponse.json({ error: "reportId and status are required" }, { status: 400 });
    }

    const report = await prisma.contentReport.update({
      where: { id: reportId },
      data: { status },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            authorId: true,
          },
        },
      },
    });

    // Handle automated takedown on resolve
    if (status === "RESOLVED" && report.storyId) {
      // 1. Unpublish story
      await prisma.story.update({
        where: { id: report.storyId },
        data: { published: false },
      });

      // 2. Remove from Meilisearch index
      try {
        void removeStory(report.storyId);
      } catch (meiliErr) {
        console.error("Failed to remove story from Meilisearch index:", meiliErr);
      }

      // 3. Send warning notification to author
      try {
        await createNotification({
          userId: report.story.authorId,
          type: "CONTENT_TAKEDOWN",
          title: "Content Policy Action Notice",
          message: `Your story "${report.story.title}" has been taken offline due to policy violations (flagged report resolved).`,
          link: `/stories/${report.storyId}`,
        });
      } catch (notifErr) {
        console.error("Failed to deliver author policy notification:", notifErr);
      }
    }

    return NextResponse.json({ report });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("PATCH /api/admin/reports error:", error);
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { reportId } = body;
    if (!reportId) return NextResponse.json({ error: "reportId is required" }, { status: 400 });

    await prisma.contentReport.delete({ where: { id: reportId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/admin/reports error:", error);
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 });
  }
}
