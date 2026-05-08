"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, FileText, Eye, Heart, MessageSquare } from "lucide-react";

interface Book {
  id: string;
  title: string;
  authorName: string;
  coverUrl: string | null;
  genre: string;
  downloadCount: number;
  createdAt: string;
  _count: { reviews: number };
}

interface Story {
  id: string;
  title: string;
  coverUrl: string | null;
  summary: string | null;
  viewCount: number;
  createdAt: string;
  _count: {
    chapters: number;
    reactions: number;
    comments: number;
  };
}

interface ProfileTabsProps {
  books: Book[];
  stories: Story[];
}

type Tab = "books" | "stories";

export function ProfileTabs({ books, stories }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("stories");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab("stories")}
            className={`border-b-2 pb-3 pt-2 text-sm font-medium transition-colors ${
              activeTab === "stories"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            }`}
          >
            Stories ({stories.length})
          </button>
          <button
            onClick={() => setActiveTab("books")}
            className={`border-b-2 pb-3 pt-2 text-sm font-medium transition-colors ${
              activeTab === "books"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            }`}
          >
            Books ({books.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "stories" && (
          <div>
            {stories.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <FileText className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  No stories yet
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  This user hasn&apos;t published any stories.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                          <FileText className="h-12 w-12 text-white/40" />
                        </div>
                      )}
                    </div>
                    <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {story.title}
                    </h3>
                    {story.summary && (
                      <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                        {story.summary}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {story._count.chapters}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {story.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {story._count.reactions}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {story._count.comments}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "books" && (
          <div>
            {books.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <BookOpen className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700" />
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  No books yet
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  This user hasn&apos;t uploaded any books.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                          <BookOpen className="h-12 w-12 text-white/40" />
                        </div>
                      )}
                    </div>
                    <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {book.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{book.authorName}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {book.genre}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                      <span>{book._count.reviews} reviews</span>
                      <span>{book.downloadCount} downloads</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
