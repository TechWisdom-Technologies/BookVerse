"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Download, Star } from "lucide-react";

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

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const avgRating = book.averageRating || 0;
  const reviewCount = book._count?.reviews || 0;

  return (
    <Link href={`/library/${book.id}`}>
      <div className="group cursor-pointer space-y-3 transition">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-200 shadow-md transition group-hover:shadow-lg dark:bg-zinc-800">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              className="object-cover transition group-hover:scale-105"
              priority={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800">
              <BookOpen className="h-8 w-8 text-white/40" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {book.title}
          </h3>
          <p className="line-clamp-1 text-xs text-zinc-600 dark:text-zinc-400">
            {book.authorName}
          </p>

          <div className="pt-1">
            <span className="inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              {book.genre}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              <span>{avgRating.toFixed(1)}</span>
              {reviewCount > 0 && <span className="text-zinc-500">({reviewCount})</span>}
            </div>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{book.downloadCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
