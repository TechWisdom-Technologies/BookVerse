import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const club = await prisma.club.findUnique({
      where: { id },
      include: { owner: { select: { id: true, username: true } }, members: { select: { id: true, userId: true, role: true } } },
    });

    if (!club) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ club });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/clubs/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch club" }, { status: 500 });
  }
}
