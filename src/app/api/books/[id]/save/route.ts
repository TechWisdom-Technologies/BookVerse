import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { dbUser } = await verifyToken();

    // Check if book exists
    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Create save
    const save = await prisma.bookSave.create({
      data: { userId: dbUser.id, bookId: id },
    });

    return NextResponse.json({ saved: save }, { status: 201 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      // Already saved
      return NextResponse.json({ error: "Already saved" }, { status: 409 });
    }
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/books/[id]/save error:", error);
    return NextResponse.json(
      { error: "Failed to save book" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { dbUser } = await verifyToken();

    // Delete save
    await prisma.bookSave.deleteMany({
      where: { userId: dbUser.id, bookId: id },
    });

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/books/[id]/save error:", error);
    return NextResponse.json(
      { error: "Failed to unsave book" },
      { status: 500 }
    );
  }
}
