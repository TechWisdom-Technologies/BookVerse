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

    const where: Prisma.ClubWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [clubs, total] = await Promise.all([
      prisma.club.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          coverUrl: true,
          owner: { select: { username: true } },
          isPrivate: true,
          maxMembers: true,
          createdAt: true,
          _count: { select: { members: true, discussions: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.club.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ clubs, total, page, totalPages });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/clubs error:", error);
    return NextResponse.json({ error: "Failed to fetch clubs" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { clubId } = body;
    if (!clubId) return NextResponse.json({ error: "clubId is required" }, { status: 400 });

    await prisma.club.delete({ where: { id: clubId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/admin/clubs error:", error);
    return NextResponse.json({ error: "Failed to delete club" }, { status: 500 });
  }
}
