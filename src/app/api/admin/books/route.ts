import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role, Prisma } from "@prisma/client";
import { removeBook } from "@/lib/meilisearch";

export async function GET(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const where: Prisma.BookWhereInput = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { authorName: { contains: search, mode: "insensitive" } },
      ];
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        select: {
          id: true,
          title: true,
          authorName: true,
          genre: true,
          coverUrl: true,
          downloadCount: true,
          createdAt: true,
          uploadedBy: {
            select: { username: true, displayName: true },
          },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.book.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ books, total, page, totalPages });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/books error:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { bookId } = body;

    if (!bookId) {
      return NextResponse.json(
        { error: "bookId is required" },
        { status: 400 }
      );
    }

    // Remove from Meilisearch index
    void removeBook(bookId);

    await prisma.book.delete({ where: { id: bookId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    console.error("DELETE /api/admin/books error:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
