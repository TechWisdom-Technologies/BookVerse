import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { dbUser } = await verifyToken();

    const url = new URL(request.url);
    const genre = url.searchParams.get("genre");
    const excludeGenre = url.searchParams.get("excludeGenre");

    const whereClause: any = { authorId: dbUser.id };
    
    if (genre) {
      whereClause.genre = genre;
    } else if (excludeGenre) {
      whereClause.OR = [
        { genre: { not: excludeGenre } },
        { genre: null }
      ];
    }

    const stories = await prisma.story.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            chapters: true,
            reactions: true,
            comments: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ stories });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/users/me/stories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
