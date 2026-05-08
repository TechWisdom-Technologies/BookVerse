import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FileType, Role, type Prisma } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import { bookSchema } from "@/lib/validators";
import { indexBook } from "@/lib/meilisearch";
import { z } from "zod";

function canUploadBooks(role: Role) {
  return role === Role.AUTHOR || role === Role.ADMIN;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const genre = searchParams.get("genre") || "";
    const language = searchParams.get("language") || "";
    const fileType = searchParams.get("fileType") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "12"));
    const sort = searchParams.get("sort") || "recent";

    const skip = (page - 1) * limit;

    const where: Prisma.BookWhereInput = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { authorName: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }
    if (genre) where.genre = { equals: genre, mode: "insensitive" };
    if (language) where.language = { equals: language, mode: "insensitive" };
    if (fileType === FileType.PDF || fileType === FileType.EPUB) {
      where.fileType = fileType;
    }

    const orderBy: Prisma.BookOrderByWithRelationInput = {};
    if (sort === "popular") {
      orderBy.downloadCount = "desc";
    } else if (sort === "rating") {
      // Would need aggregation, default to recent
      orderBy.createdAt = "desc";
    } else if (sort === "title") {
      orderBy.title = "asc";
    } else {
      orderBy.createdAt = "desc";
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        select: {
          id: true,
          title: true,
          authorName: true,
          coverUrl: true,
          genre: true,
          downloadCount: true,
          _count: { select: { reviews: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.book.count({ where }),
    ]);

    // Calculate average ratings
    const booksWithRatings = await Promise.all(
      books.map(async (book) => {
        const reviews = await prisma.bookReview.findMany({
          where: { bookId: book.id },
          select: { rating: true },
        });
        const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        return { ...book, averageRating: avgRating };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      books: booksWithRatings,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (error) {
    console.error("GET /api/books error:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (!canUploadBooks(dbUser.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = bookSchema.parse(body);

    const existingBook = await prisma.book.findFirst({
      where: {
        title: { equals: parsed.title, mode: "insensitive" },
        authorName: { equals: parsed.authorName, mode: "insensitive" },
      },
      select: { id: true },
    });

    if (existingBook) {
      return NextResponse.json(
        { error: "A book with this title and author already exists." },
        { status: 409 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title: parsed.title,
        authorName: parsed.authorName,
        coverUrl: parsed.coverUrl ?? null,
        fileUrl: parsed.fileUrl,
        fileType: parsed.fileType,
        genre: parsed.genre,
        language: parsed.language,
        description: parsed.description ?? null,
        uploadedById: dbUser.id,
      },
    });

    await indexBook({
      id: book.id,
      title: book.title,
      authorName: book.authorName,
      genre: book.genre,
      language: book.language,
    });

    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Invalid book data." },
        { status: 400 }
      );
    }

    console.error("POST /api/books error:", error);
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}
