"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, FileText } from "lucide-react";
import type { SearchResult } from "@/lib/meilisearch";

interface SearchResultsProps {
  results: SearchResult[];
  type: "all" | "books" | "stories";
}

export function SearchResults({ results, type }: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  const books = results.filter((r) => r._type === "book");
  const stories = results.filter((r) => r._type === "story");

  return (
    <div className="space-y-8">
      {/* Books Section */}
      {(type === "all" || type === "books") && books.length > 0 && (
        <section>
          {type === "all" && (
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Books
            </h2>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/library/${book.id}`}
                className="group rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-600">
                      <BookOpen className="h-12 w-12 text-white/60" />
                    </div>
                  )}
                </div>
                <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {book.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {book.authorName}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {book.genre}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Stories Section */}
      {(type === "all" || type === "stories") && stories.length > 0 && (
        <section>
          {type === "all" && (
            <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Stories
            </h2>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.id}`}
                className="group rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  {story.coverUrl ? (
                    <Image
                      src={story.coverUrl}
                      alt={story.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500">
                      <FileText className="h-12 w-12 text-white/60" />
                    </div>
                  )}
                </div>
                <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {story.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  by {story.authorName}
                </p>
                {story.summary && (
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {story.summary}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
