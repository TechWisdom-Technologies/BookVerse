import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// DELETE /api/users/me/blocks/[blockId] — Unblock a user
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ blockId: string }> }
) {
  try {
    const { dbUser } = await verifyToken();
    const { blockId } = await params;

    // Verify the block belongs to this user
    const block = await prisma.userBlock.findFirst({
      where: {
        id: blockId,
        blockerId: dbUser.id,
      },
    });

    if (!block) {
      return NextResponse.json({ error: "Block record not found" }, { status: 404 });
    }

    await prisma.userBlock.delete({
      where: { id: blockId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/users/me/blocks/[blockId] error:", error);
    return NextResponse.json({ error: "Failed to unblock user" }, { status: 500 });
  }
}
