import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client";
import { createNotification } from "@/lib/notifications";

// POST: Admin sends an instruction to a user
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { instruction } = await req.json();

    if (!instruction || typeof instruction !== "string" || instruction.trim().length === 0) {
      return NextResponse.json({ error: "Instruction text is required" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        adminInstruction: instruction.trim(),
        instructionSeen: false,
      },
      select: { id: true, username: true, adminInstruction: true },
    });

    await createNotification({
      userId: id,
      type: "SYSTEM_ALERT",
      title: "Message from Admin",
      message: `An administrator has sent you a direct instruction:\n\n"${instruction.trim()}"\n\nPlease check your account settings.`,
      link: "/settings",
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/admin/users/[id]/instruction error:", error);
    return NextResponse.json({ error: "Failed to send instruction" }, { status: 500 });
  }
}

// DELETE: Admin clears a user's instruction
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.user.update({
      where: { id },
      data: {
        adminInstruction: null,
        instructionSeen: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/admin/users/[id]/instruction error:", error);
    return NextResponse.json({ error: "Failed to clear instruction" }, { status: 500 });
  }
}
