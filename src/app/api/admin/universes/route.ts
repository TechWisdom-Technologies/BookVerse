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

    const where: Prisma.UniverseWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [universes, total] = await Promise.all([
      prisma.universe.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          genre: true,
          coverUrl: true,
          user: { select: { username: true } },
          _count: { select: { stories: true } },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.universe.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ universes, total, page, totalPages });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/universes error:", error);
    return NextResponse.json({ error: "Failed to fetch universes" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { universeId } = body;
    if (!universeId) return NextResponse.json({ error: "universeId is required" }, { status: 400 });

    await prisma.universe.delete({ where: { id: universeId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/admin/universes error:", error);
    return NextResponse.json({ error: "Failed to delete universe" }, { status: 500 });
  }
}
