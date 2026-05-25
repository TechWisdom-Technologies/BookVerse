"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star, Download, Bookmark, BookOpen, Globe, Languages } from "lucide-react";
import { getFriendlyErrorMessage } from "@/lib/friendly-errors";
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
      toast.error("Please sign in to save books");
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
      toast.success(saved ? "Removed from library" : "Added to library");
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, "Failed to save book. Please try again."));
    } finally {
      setSavingState(false);
    }
  }

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row gap-20 pt-8">
        {/* Left Col: Cover & Actions */}
        <div className="w-full md:w-[360px] shrink-0 space-y-10">
          <div className="relative aspect-[2/3] w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded shadow-sm overflow-hidden group">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={book.title}
                fill
                className="object-cover transition-all duration-700"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-100 dark:text-zinc-800">
                <BookOpen className="h-24 w-24" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href={`/library/${book.id}/read`}
              className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded text-[11px] uppercase tracking-[0.2em] transition-all hover:opacity-90 shadow-md border border-zinc-900 dark:border-white"
            >
              <BookOpen className="h-4 w-4" />
              Read Now
            </Link>
            
            <button
              onClick={handleSave}
              disabled={savingState}
              className={`flex items-center justify-center gap-3 w-full px-8 py-4 font-bold rounded text-[11px] uppercase tracking-[0.2em] transition-all border ${
                saved 
                  ? "bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-900 dark:border-white shadow-sm" 
                  : "bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
              {saved ? "In Library" : "Add to Library"}
            </button>

            <a
              href={`/api/books/${book.id}/download`}
              className="flex items-center justify-center gap-3 w-full px-8 py-4 font-bold rounded text-[11px] uppercase tracking-[0.2em] bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <Download className="h-4 w-4" />
              Download {book.fileType.toUpperCase()}
            </a>
          </div>
        </div>

        {/* Right Col: Info */}
        <div className="flex-1 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 font-bold uppercase tracking-widest text-[9px] rounded border border-zinc-100 dark:border-zinc-800">
                {book.genre}
              </span>
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">
                <Languages className="w-3.5 h-3.5" /> {book.language}
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-zinc-900 dark:text-white leading-[0.9] tracking-tighter uppercase">
              {book.title}
            </h1>
            <p className="text-xl font-bold text-zinc-400 uppercase tracking-widest">
              by <span className="text-zinc-900 dark:text-white">{book.authorName}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-16 py-10 border-y border-zinc-50 dark:border-zinc-900">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(book.averageRating || 0)
                        ? "text-zinc-900 dark:text-white fill-current"
                        : "text-zinc-100 dark:text-zinc-800"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest italic">
                {book.averageRating?.toFixed(1) || "0.0"} Rating / {book._count?.reviews || 0} Reviews
              </p>
            </div>
            
            <div className="flex flex-col gap-1 justify-center">
              <div className="flex items-center gap-3 text-3xl font-bold text-zinc-900 dark:text-white tracking-tighter">
                <Download className="h-6 w-6 text-zinc-200" />
                {book.downloadCount.toLocaleString()}
              </div>
              <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest italic">
                Downloads
              </p>
            </div>
          </div>

          {book.description && (
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">About</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm font-medium italic whitespace-pre-wrap max-w-2xl">
                &quot;{book.description}&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
