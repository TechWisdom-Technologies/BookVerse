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
      <div className="group cursor-pointer transition-all">
        <div className="relative aspect-[2/3] overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 mb-6 shadow-sm">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              className="object-cover transition-all duration-700"
              priority={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-100 dark:text-zinc-800">
              <BookOpen className="h-10 w-10" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">
              {book.genre}
            </span>
          </div>
          <h3 className="line-clamp-1 text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
            {book.title}
          </h3>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            {book.authorName}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-50 dark:border-zinc-900 mt-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-300">
              <Star className="h-3 w-3 fill-current text-zinc-900 dark:text-white" />
              <span className="text-zinc-900 dark:text-white">{avgRating.toFixed(1)}</span>
              {reviewCount > 0 && <span>({reviewCount})</span>}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-300">
              <Download className="h-3 w-3" />
              {book.downloadCount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
