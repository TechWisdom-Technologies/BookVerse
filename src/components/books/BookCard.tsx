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
      <div className="group h-full flex flex-col cursor-pointer">
        <div className="relative aspect-[2/3] overflow-hidden rounded-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 mb-4 transition-all duration-500 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] group-hover:-translate-y-1.5">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-300 dark:text-zinc-700 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
              <BookOpen className="h-10 w-10 opacity-50" />
            </div>
          )}
          
          {/* Subtle gradient overlay at bottom for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        <div className="flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              {book.genre}
            </span>
          </div>
          <h3 className="line-clamp-2 text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight mb-1 group-hover:text-brand transition-colors">
            {book.title}
          </h3>
          <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-auto">
            {book.authorName}
          </p>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800/50">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{avgRating.toFixed(1)}</span>
              {reviewCount > 0 && <span className="text-zinc-400 font-normal">({reviewCount})</span>}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
              <Download className="h-3.5 w-3.5" />
              {book.downloadCount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
