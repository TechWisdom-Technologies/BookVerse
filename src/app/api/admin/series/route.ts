import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role, Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const where: Prisma.SeriesWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [series, total] = await Promise.all([
      prisma.series.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          coverUrl: true,
          user: { select: { username: true } },
          _count: { select: { stories: true } },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.series.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ series, total, page, totalPages });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/series error:", error);
    return NextResponse.json({ error: "Failed to fetch series" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { seriesId } = body;
    if (!seriesId) return NextResponse.json({ error: "seriesId is required" }, { status: 400 });

    await prisma.series.delete({ where: { id: seriesId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/admin/series error:", error);
    return NextResponse.json({ error: "Failed to delete series" }, { status: 500 });
  }
}
