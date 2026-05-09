import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await verifyToken();

    const book = await prisma.book.findUnique({
      where: { id },
      select: { fileUrl: true, downloadCount: true },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Increment download count
    await prisma.book.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });

    // Redirect to file URL
    return NextResponse.redirect(book.fileUrl, { status: 302 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.error("GET /api/books/[id]/download error:", error);
    return NextResponse.json(
      { error: "Failed to download book" },
      { status: 500 }
    );
  }
}
