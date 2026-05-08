import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookGrid } from "@/components/books/BookGrid";
import type { Book } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    // Fetch featured and recent books
    const [featured, recent] = await Promise.all([
      prisma.book.findMany({
        take: 6,
        orderBy: { downloadCount: "desc" },
        select: {
          id: true,
          title: true,
          authorName: true,
          coverUrl: true,
          genre: true,
          downloadCount: true,
          _count: { select: { reviews: true } },
        },
      }),
      prisma.book.findMany({
        take: 12,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          authorName: true,
          coverUrl: true,
          genre: true,
          downloadCount: true,
          _count: { select: { reviews: true } },
        },
      }),
    ]);

    // Calculate ratings
    const addRatings = async <T extends Pick<Book, "id">>(books: T[]) => {
      return Promise.all(
        books.map(async (book) => {
          const reviews = await prisma.bookReview.findMany({
            where: { bookId: book.id },
            select: { rating: true },
          });
          const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
          return { ...book, averageRating: avgRating };
        })
      );
    };

    const [featuredWithRatings, recentWithRatings] = await Promise.all([
      addRatings(featured),
      addRatings(recent),
    ]);

    return (
      <main>
        {/* Hero Section */}
        <section className="border-b border-zinc-200 bg-linear-to-r from-zinc-900 to-zinc-800 py-16 dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900">
          <div className="mx-auto max-w-5xl px-6 text-center sm:px-10">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Discover Your Next Great Read
            </h1>
            <p className="mt-4 text-lg text-zinc-300">
              Browse thousands of books and stories in your favorite genres
            </p>
            <Link
              href="/library"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              Explore Library
            </Link>
          </div>
        </section>

        {/* Featured Section */}
        <section className="py-12">
          <div className="mx-auto max-w-5xl px-6 sm:px-10">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Featured Books</h2>
            <div className="mt-6">
              <BookGrid books={featuredWithRatings} />
            </div>
          </div>
        </section>

        {/* Recent Section */}
        <section className="border-t border-zinc-200 py-12 dark:border-zinc-800">
          <div className="mx-auto max-w-5xl px-6 sm:px-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Recent Books</h2>
              <Link
                href="/library"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                View All →
              </Link>
            </div>
            <div className="mt-6">
              <BookGrid books={recentWithRatings} />
            </div>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("HomePage error:", error);
    return (
      <main>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-600 dark:text-zinc-400">Failed to load books</p>
          </div>
        </div>
      </main>
    );
  }
}
