import { prisma } from "@/lib/prisma";
import { BookGrid } from "@/components/books/BookGrid";
import { BookFilters } from "@/components/books/BookFilters";
import { Pagination } from "@/components/shared/Pagination";
import { FileType, type Prisma } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import { Upload, Library, Search } from "lucide-react";

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
      <main className="min-h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A] pt-10 sm:pt-16 pb-20 sm:pb-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
          <header className="mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white mb-3 sm:mb-4">
              The Library.
            </h1>
            <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl">
              Discover, read, and get inspired by thousands of community stories.
            </p>
          </header>

          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-start">
            {/* Filters Sidebar */}
            <div className="w-full lg:w-80 shrink-0 lg:sticky lg:top-8 z-10">
              {canUpload && (
                <Link
                  href="/upload"
                  className="group relative w-full mb-6 sm:mb-8 flex items-center justify-center gap-3 px-6 py-4 sm:py-5 bg-brand text-white rounded-full font-bold text-base sm:text-lg hover:bg-orange-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/20 transition-all duration-300"
                >
                  <Upload className="w-5 h-5 transition-transform group-hover:scale-110" />
                  Publish Your Work
                </Link>
              )}
              <div className="rounded-[2rem] bg-white/80 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 p-6 sm:p-8 shadow-xl shadow-zinc-200/20 dark:shadow-none">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Discover</h3>
                </div>
                <BookFilters genres={genreList} languages={languageList} />
              </div>
            </div>

            {/* Books Grid */}
            <div className="flex-1 min-w-0">
              <div className="rounded-[2rem] sm:rounded-[2.5rem] bg-white/80 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 p-6 sm:p-8 md:p-10 shadow-xl shadow-zinc-200/20 dark:shadow-none min-h-[500px]">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-8 pb-6 border-b-2 border-zinc-100 dark:border-zinc-800/50">
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                    {q ? `Search: "${q}"` : 'All Stories'}
                  </h2>
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-400">
                    Showing <span className="text-brand">{Math.min(limit, books.length)}</span> of <span className="text-zinc-900 dark:text-white">{total}</span>
                  </div>
                </div>
                
                <BookGrid books={booksWithRatings} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 sm:mt-16 flex justify-center">
                    <Pagination currentPage={page} totalPages={totalPages} basePath="/library" />
                  </div>
                )}
              </div>
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
