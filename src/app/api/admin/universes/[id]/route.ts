import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const id = params.id;
    const universe = await prisma.universe.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true } }, stories: { select: { id: true, title: true } } },
    });

    if (!universe) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ universe });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/universes/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch universe" }, { status: 500 });
  }
}
