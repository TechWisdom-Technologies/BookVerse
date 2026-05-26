import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const universe = await prisma.universe.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            email: true,
            avatarUrl: true,
          },
        },
        stories: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            published: true,
            viewCount: true,
            genre: true,
            seriesId: true,
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!universe) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Fetch related series (owned by universe owner or associated with stories in this universe)
    const seriesList = await prisma.series.findMany({
      where: {
        OR: [
          { userId: universe.userId },
          { stories: { some: { universeId: id } } },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
        _count: {
          select: { stories: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ universe, seriesList });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/universes/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch universe" }, { status: 500 });
  }
}
