import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const notice = await prisma.dMCANotice.findUnique({
      where: { id },
      include: {
        submittedByUser: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!notice) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const story = await prisma.story.findUnique({
      where: { id: notice.storyId },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ notice, story });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/dmca/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch notice" }, { status: 500 });
  }
}
