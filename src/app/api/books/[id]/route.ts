import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        _count: { select: { reviews: true, saves: true } },
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Calculate average rating
    const reviews = await prisma.bookReview.findMany({
      where: { bookId: id },
      select: { rating: true },
    });
    const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    return NextResponse.json({
      ...book,
      averageRating,
    });
  } catch (error) {
    console.error("GET /api/books/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    );
  }
}
