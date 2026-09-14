import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    const { id, priority } = await request.json();

    if (!id || !priority) {
      return NextResponse.json({ error: "Missing id or priority" }, { status: 400 });
    }

    const validPriorities = ["normal", "important", "urgent"];
    if (!validPriorities.includes(priority)) {
      return NextResponse.json({ error: "Invalid priority value" }, { status: 400 });
    }

    // Ensure the notification belongs to the user
    const notification = await prisma.notification.findFirst({
      where: { id, userId: dbUser.id },
    });

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { priority },
    });

    return NextResponse.json({ notification: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to update notification priority" },
      { status: 500 }
    );
  }
}
