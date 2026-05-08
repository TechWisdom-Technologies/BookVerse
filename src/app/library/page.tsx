import { prisma } from "@/lib/prisma";
import { BookGrid } from "@/components/books/BookGrid";
import { BookFilters } from "@/components/books/BookFilters";
import { Pagination } from "@/components/shared/Pagination";
import { FileType, type Prisma } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import { Upload } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchParams {
  q?: string;
  genre?: string;
  language?: string;
  fileType?: string;
  page?: string;
  sort?: string;
}

export default async function LibraryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const q = params.q || "";
  const genre = params.genre || "";
  const language = params.language || "";
  const fileType = params.fileType || "";
  const page = Math.max(1, parseInt(params.page || "1"));
  const limit = 12;
  const sort = params.sort || "recent";

  let canUpload = false;
  try {
    const { dbUser } = await verifyToken();
    canUpload = dbUser.role === "AUTHOR" || dbUser.role === "ADMIN";
  } catch {
    // Guest or unauthenticated user
  }

  try {
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
    } else if (sort === "title") {
      orderBy.title = "asc";
    } else {
      orderBy.createdAt = "desc";
    }

    // Fetch books
    const [books, total, genres, languages] = await Promise.all([
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
      prisma.book.findMany({
        distinct: ["genre"],
        select: { genre: true },
      }),
      prisma.book.findMany({
        distinct: ["language"],
        select: { language: true },
      }),
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
    const genreList = genres.map((g) => g.genre).filter(Boolean);
    const languageList = languages.map((l) => l.language).filter(Boolean);

    return (
      <main className="min-h-[calc(100vh-8rem)]">
        <div className="mx-auto max-w-5xl px-6 py-8 sm:px-10">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Library</h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {total} book{total !== 1 ? "s" : ""} found
              </p>
            </div>
            {canUpload && (
              <Link
                href="/upload"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                <Upload className="h-4 w-4" />
                Upload Book
              </Link>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Filters */}
            <div className="lg:col-span-1">
              <BookFilters genres={genreList} languages={languageList} />
            </div>

            {/* Books Grid */}
            <div className="lg:col-span-3 space-y-8">
              <BookGrid books={booksWithRatings} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination currentPage={page} totalPages={totalPages} basePath="/library" />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("LibraryPage error:", error);
    return (
      <main>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-600 dark:text-zinc-400">Failed to load library</p>
          </div>
        </div>
      </main>
    );
  }
}
