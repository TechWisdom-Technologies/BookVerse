import { prisma } from "@/lib/prisma";
import { BookGrid } from "@/components/books/BookGrid";
import { BookFilters } from "@/components/books/BookFilters";
import { Pagination } from "@/components/shared/Pagination";
import { FileType, type Prisma } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import Link from "next/link";
import { Upload, Search, Library as LibraryIcon, Loader2 } from "lucide-react";

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
  } catch {}

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
    if (sort === "popular") orderBy.downloadCount = "desc";
    else if (sort === "title") orderBy.title = "asc";
    else orderBy.createdAt = "desc";

    const [books, total, genres, languages] = await Promise.all([
      prisma.book.findMany({
        where,
        select: { id: true, title: true, authorName: true, coverUrl: true, genre: true, downloadCount: true, _count: { select: { reviews: true } } },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.book.count({ where }),
      prisma.book.findMany({ distinct: ["genre"], select: { genre: true } }),
      prisma.book.findMany({ distinct: ["language"], select: { language: true } }),
    ]);

    const booksWithRatings = await Promise.all(
      books.map(async (book) => {
        const reviews = await prisma.bookReview.findMany({ where: { bookId: book.id }, select: { rating: true } });
        const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        return { ...book, averageRating: avgRating };
      })
    );

    const totalPages = Math.ceil(total / limit);
    const genreList = genres.map((g) => g.genre).filter(Boolean);
    const languageList = languages.map((l) => l.language).filter(Boolean);

    return (
      <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Simple Header */}
          <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-300 dark:text-zinc-600">
                <LibraryIcon className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Browse All Books</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Digital Library.</h1>
                <p className="text-sm text-zinc-500 max-w-xl font-medium">Explore thousands of stories and books shared by our community.</p>
              </div>
            </div>
            {canUpload && (
              <Link href="/upload" className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload a Book
              </Link>
            )}
          </header>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Simple Sidebar */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="sticky top-24 space-y-12">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600 mb-8 flex items-center gap-2">
                    <Search className="w-3.5 h-3.5" /> Search
                  </h3>
                  <BookFilters genres={genreList} languages={languageList} />
                </div>
              </div>
            </aside>

            {/* Content Area */}
            <section className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-10 pb-4 border-b border-zinc-50 dark:border-zinc-900">
                <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">
                  {q ? `Search results for "${q}"` : 'Collections'}
                </h2>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {total} Books Found
                </span>
              </div>
              
              <BookGrid books={booksWithRatings} />

              {totalPages > 1 && (
                <div className="mt-20 flex justify-center border-t border-zinc-50 dark:border-zinc-900 pt-16">
                  <Pagination currentPage={page} totalPages={totalPages} basePath="/library" />
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="text-center space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Failed to load books.</p>
          <Link href="/" className="text-xs font-bold text-zinc-900 dark:text-white underline">Back Home</Link>
        </div>
      </main>
    );
  }
}
