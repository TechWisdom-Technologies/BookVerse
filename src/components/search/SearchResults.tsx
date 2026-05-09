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
    <div className="space-y-16">
      {/* Books Section */}
      {(type === "all" || type === "books") && books.length > 0 && (
        <section>
          {type === "all" && (
            <h2 className="mb-10 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600 border-b border-zinc-50 dark:border-zinc-900 pb-4 italic">
              Books Found
            </h2>
          )}
          <div className="grid gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/library/${book.id}`}
                className="group flex flex-col p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 mb-6 border border-zinc-100 dark:border-zinc-800">
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      fill
                      className="object-cover transition-all duration-700"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-200 dark:text-zinc-800">
                      <BookOpen className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">
                      {book.genre}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white line-clamp-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors uppercase">
                    {book.title}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {book.authorName}
                  </p>
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
            <h2 className="mb-10 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600 border-b border-zinc-50 dark:border-zinc-900 pb-4 italic">
              Stories Found
            </h2>
          )}
          <div className="grid gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.id}`}
                className="group flex flex-col p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 mb-6 border border-zinc-100 dark:border-zinc-800">
                  {story.coverUrl ? (
                    <Image
                      src={story.coverUrl}
                      alt={story.title}
                      fill
                      className="object-cover transition-all duration-700"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-200 dark:text-zinc-800">
                      <FileText className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">
                      Short Story
                    </span>
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white line-clamp-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors uppercase">
                    {story.title}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {story.authorName}
                  </p>
                  {story.summary && (
                    <p className="mt-3 line-clamp-2 text-[11px] font-medium text-zinc-500 leading-relaxed italic">
                      &quot;{story.summary}&quot;
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
