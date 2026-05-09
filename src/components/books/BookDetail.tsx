"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star, Download, Bookmark, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

interface Book {
  id: string;
  title: string;
  authorName: string;
  coverUrl: string | null;
  genre: string;
  language: string;
  description: string | null;
  downloadCount: number;
  fileType: string;
  _count?: { reviews: number; saves: number };
  averageRating?: number;
}

interface BookDetailProps {
  book: Book;
  currentUserId?: string | null;
  isSaved?: boolean;
}

export function BookDetail({ book, currentUserId, isSaved: initialSaved }: BookDetailProps) {
  const [saved, setSaved] = useState(initialSaved || false);
  const [savingState, setSavingState] = useState(false);

  async function handleSave() {
    if (!currentUserId) {
      toast.error("Sign in to save books");
      return;
    }

    setSavingState(true);
    try {
      const method = saved ? "DELETE" : "POST";
      const res = await fetch(`/api/books/${book.id}/save`, {
        method,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to save book");
      setSaved(!saved);
      toast.success(saved ? "Removed from shelf" : "Added to shelf");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving book");
    } finally {
      setSavingState(false);
    }
  }

  return (
    <div className="relative">
      {/* Cinematic Blurred Background */}
      <div className="absolute inset-0 -top-16 -left-6 -right-6 md:-left-8 md:-right-8 h-[500px] overflow-hidden -z-10 rounded-b-[4rem]">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt="Background"
            fill
            className="object-cover blur-3xl opacity-20 dark:opacity-10 scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand/20 to-rose-500/20 blur-3xl" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FDFDFC]/80 to-[#FDFDFC] dark:via-[#0A0A0A]/80 dark:to-[#0A0A0A]" />
      </div>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-16 relative z-10 pt-8">
        {/* Left Col: Cover & Actions */}
        <div className="w-full md:w-[320px] shrink-0 space-y-8">
          <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/20 dark:shadow-black/50 ring-1 ring-black/5 dark:ring-white/5">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-200 dark:bg-zinc-800">
                <BookOpen className="h-20 w-20 text-zinc-400" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href={`/library/${book.id}/read`}
              className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-brand text-white font-bold rounded-full text-lg hover:bg-orange-600 hover:shadow-xl hover:shadow-brand/20 hover:-translate-y-1 transition-all duration-300"
            >
              <BookOpen className="h-5 w-5" />
              Read Online
            </Link>
            
            <button
              onClick={handleSave}
              disabled={savingState}
              className={`flex items-center justify-center gap-2 w-full px-8 py-4 font-bold rounded-full text-base transition-all duration-300 ${
                saved 
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl" 
                  : "bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}
            >
              <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
              {saved ? "Saved to Shelf" : "Save to Shelf"}
            </button>

            <a
              href={`/api/books/${book.id}/download`}
              className="flex items-center justify-center gap-2 w-full px-8 py-4 font-bold rounded-full text-base bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300"
            >
              <Download className="h-5 w-5" />
              Download {book.fileType.toUpperCase()}
            </a>
          </div>
        </div>

        {/* Right Col: Info */}
        <div className="flex-1 space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 bg-brand/10 text-brand font-bold uppercase tracking-wider text-xs rounded-full">
                {book.genre}
              </span>
              <span className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-wider text-xs rounded-full">
                {book.language}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white leading-tight tracking-tighter mb-4">
              {book.title}
            </h1>
            <p className="text-xl md:text-2xl font-medium text-zinc-500 dark:text-zinc-400">
              by <span className="text-zinc-900 dark:text-white font-bold">{book.authorName}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-12 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl shadow-zinc-200/20 dark:shadow-none">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.round(book.averageRating || 0)
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-200 dark:text-zinc-800"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                <span className="text-2xl text-zinc-900 dark:text-white mr-2">{book.averageRating?.toFixed(1) || "0.0"}</span> 
                ({book._count?.reviews || 0} reviews)
              </p>
            </div>
            
            <div className="w-px h-16 bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

            <div className="flex flex-col gap-1 justify-center">
              <div className="flex items-center gap-3 text-3xl font-black text-zinc-900 dark:text-white">
                <Download className="h-7 w-7 text-brand" />
                {book.downloadCount}
              </div>
              <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Downloads
              </p>
            </div>
          </div>

          {book.description && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Synopsis</h3>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg whitespace-pre-wrap">
                {book.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
