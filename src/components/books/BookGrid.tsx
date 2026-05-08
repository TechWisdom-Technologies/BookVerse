"use client";

import { BookOpen } from "lucide-react";
import { BookCard } from "./BookCard";

interface Book {
  id: string;
  title: string;
  authorName: string;
  coverUrl: string | null;
  genre: string;
  downloadCount: number;
  _count?: { reviews: number };
  averageRating?: number;
}

interface BookGridProps {
  books: Book[];
  loading?: boolean;
}

export function BookGrid({ books, loading }: BookGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3 animate-pulse">
            <div className="aspect-[2/3] rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <BookOpen className="mx-auto mb-2 h-10 w-10 text-zinc-300 dark:text-zinc-700" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No books found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
