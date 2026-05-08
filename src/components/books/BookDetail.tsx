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
    <div className="space-y-8">
      {/* Header */}
      <div className="grid gap-8 sm:grid-cols-3">
        {/* Cover */}
        <div className="sm:col-span-1">
          <div className="aspect-[2/3] overflow-hidden rounded-lg bg-zinc-200 shadow-lg dark:bg-zinc-800">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={book.title}
                width={300}
                height={450}
                className="h-full w-full object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-800">
                <div className="text-5xl">📖</div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 space-y-3">
            <button
              onClick={handleSave}
              disabled={savingState}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
              {saved ? "Saved" : "Save to Shelf"}
            </button>

            <Link
              href={`/library/${book.id}/read`}
              className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <BookOpen className="h-4 w-4" />
              Read Online
            </Link>

            <a
              href={`/api/books/${book.id}/download`}
              className="flex items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </div>
        </div>

        {/* Info */}
        <div className="sm:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{book.title}</h1>
            <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">by {book.authorName}</p>
          </div>

          {/* Rating & Stats */}
          <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(book.averageRating || 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-zinc-300 dark:text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {book.averageRating?.toFixed(1) || "No"} rating
                  {book._count?.reviews ? ` - ${book._count.reviews} reviews` : ""}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Genre</p>
                <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {book.genre}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Language</p>
                <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {book.language}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Format</p>
                <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {book.fileType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <Download className="h-4 w-4" />
              <span>{book.downloadCount} downloads</span>
            </div>
          </div>

          {/* Description */}
          {book.description && (
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">About this book</h2>
              <p className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">
                {book.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
