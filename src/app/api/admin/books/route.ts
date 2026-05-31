import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role, Prisma } from "@prisma/client";
import { deleteFromR2 } from "@/lib/r2";

/** Extract the R2 object key from a full public URL */
function extractR2Key(url: string | null): string | null {
  if (!url) return null;
  try {
    const publicBase = process.env.CLOUDFLARE_R2_PUBLIC_URL?.replace(/\/+$/, "");
    if (publicBase && url.startsWith(publicBase)) {
      return url.slice(publicBase.length + 1); // remove leading slash
    }
    // Fallback: try to extract path after the domain
    const parsed = new URL(url);
    return parsed.pathname.replace(/^\/+/, "");
  } catch {
    return null;
  }
}

/** Safely delete an R2 object by its public URL */
async function safeDeleteR2(url: string | null) {
  const key = extractR2Key(url);
  if (!key) return;
  try {
    await deleteFromR2(key);
  } catch (error) {
    console.warn(`Failed to delete R2 object (key: ${key}):`, error);
  }
}

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
    const { bookId, bookIds } = body;

    // Support bulk delete (bookIds array) OR single delete (bookId string)
    const idsToDelete: string[] = bookIds && Array.isArray(bookIds) ? bookIds : bookId ? [bookId] : [];

    if (idsToDelete.length === 0) {
      return NextResponse.json(
        { error: "bookId or bookIds is required" },
        { status: 400 }
      );
    }

    // Fetch the books to get their file URLs for R2 cleanup
    const booksToDelete = await prisma.book.findMany({
      where: { id: { in: idsToDelete } },
      select: { id: true, fileUrl: true, coverUrl: true },
    });

    if (booksToDelete.length === 0) {
      return NextResponse.json({ error: "No books found" }, { status: 404 });
    }

    // Delete from database first
    await prisma.book.deleteMany({ where: { id: { in: idsToDelete } } });

    // Remove from R2 storage (fire-and-forget, don't block response)
    for (const book of booksToDelete) {
      void safeDeleteR2(book.fileUrl);
      void safeDeleteR2(book.coverUrl);
    }

    return NextResponse.json({
      message: `Successfully deleted ${booksToDelete.length} book(s)`,
      deletedCount: booksToDelete.length,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    console.error("DELETE /api/admin/books error:", error);
    return NextResponse.json(
      { error: "Failed to delete book(s)" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, authorName, genre, description, language } = body;

    if (!id) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: {
        title,
        authorName,
        genre,
        description,
        language,
      },
    });

    return NextResponse.json({ book: updatedBook });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    console.error("PATCH /api/admin/books error:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}
