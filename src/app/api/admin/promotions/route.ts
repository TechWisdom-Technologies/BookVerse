import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const promotions = await prisma.storyPromotion.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        story: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            author: {
              select: {
                id: true,
                username: true,
                email: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ promotions });
  } catch (error) {
    if (error instanceof Error && (error.message === "UNAUTHORIZED" || error.message === "USER_NOT_FOUND")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/promotions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch promotions" },
      { status: 500 }
    );
  }
}
