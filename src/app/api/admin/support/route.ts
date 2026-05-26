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
    const statusFilter = searchParams.get("status") || "";
    const skip = (page - 1) * limit;

    const where: Prisma.SupportTicketWhereInput = {};

    if (statusFilter && statusFilter !== "ALL") {
      where.status = statusFilter;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.supportTicket.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ tickets, total, page, totalPages });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/support error:", error);
    return NextResponse.json({ error: "Failed to fetch support tickets" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { ticketId, status } = body;
    if (!ticketId || typeof status !== "string") {
      return NextResponse.json({ error: "ticketId and status are required" }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { status },
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("PATCH /api/admin/support error:", error);
    return NextResponse.json({ error: "Failed to update support ticket" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { ticketId } = body;
    if (!ticketId) return NextResponse.json({ error: "ticketId is required" }, { status: 400 });

    await prisma.supportTicket.delete({ where: { id: ticketId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/admin/support error:", error);
    return NextResponse.json({ error: "Failed to delete support ticket" }, { status: 500 });
  }
}
