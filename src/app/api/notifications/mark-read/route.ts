import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Invalid notification IDs" }, { status: 400 });
    }

    await prisma.notification.updateMany({
      where: {
        id: { in: ids },
        userId: dbUser.id, // Security: ensure user owns these notifications
      },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}
