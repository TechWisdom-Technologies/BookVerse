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
      {/* Pill Navigation */}
      <div className="flex items-center justify-center gap-4 mb-16">
        <button
          onClick={() => setActiveTab("stories")}
          className={`px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === "stories"
              ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl scale-105"
              : "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800"
          }`}
        >
          Stories <span className="ml-2 opacity-60 bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full">{stories.length}</span>
        </button>
        <button
          onClick={() => setActiveTab("books")}
          className={`px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
            activeTab === "books"
              ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl scale-105"
              : "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800"
          }`}
        >
          Books <span className="ml-2 opacity-60 bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full">{books.length}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === "stories" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {stories.length === 0 ? (
              <div className="py-24 text-center bg-zinc-50 dark:bg-zinc-900/30 rounded-[3rem] border border-zinc-200 dark:border-zinc-800">
                <FileText className="mx-auto w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-6" />
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  No stories yet
                </h3>
                <p className="text-lg text-zinc-500 dark:text-zinc-400">
                  This user hasn&apos;t published any stories.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {stories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/stories/${story.id}`}
                    className="group flex flex-col relative"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-5 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 ring-1 ring-black/5 dark:ring-white/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                      
                      {story.coverUrl ? (
                        <Image
                          src={story.coverUrl}
                          alt={story.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 transition-transform duration-700 group-hover:scale-105">
                          <FileText className="h-12 w-12 text-white/40" />
                        </div>
                      )}

                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <div className="px-8 py-3 bg-white text-zinc-900 font-bold rounded-full text-sm shadow-xl whitespace-nowrap">
                          Read Story
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight mb-1 group-hover:text-brand transition-colors line-clamp-1">
                        {story.title}
                      </h3>
                      {story.summary && (
                        <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          {story.summary}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-4 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                        <span className="flex items-center gap-1.5">
                          <Eye className="h-4 w-4" /> {story.viewCount}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Heart className="h-4 w-4" /> {story._count.reactions}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "books" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {books.length === 0 ? (
              <div className="py-24 text-center bg-zinc-50 dark:bg-zinc-900/30 rounded-[3rem] border border-zinc-200 dark:border-zinc-800">
                <BookOpen className="mx-auto w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-6" />
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  No books yet
                </h3>
                <p className="text-lg text-zinc-500 dark:text-zinc-400">
                  This user hasn&apos;t uploaded any books.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {books.map((book) => (
                  <Link
                    key={book.id}
                    href={`/library/${book.id}`}
                    className="group flex flex-col relative"
                  >
                    <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-5 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 ring-1 ring-black/5 dark:ring-white/5">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                      
                      {book.coverUrl ? (
                        <Image
                          src={book.coverUrl}
                          alt={book.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-600 transition-transform duration-700 group-hover:scale-105">
                          <BookOpen className="h-12 w-12 text-white/40" />
                        </div>
                      )}

                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <div className="px-8 py-3 bg-white text-zinc-900 font-bold rounded-full text-sm shadow-xl whitespace-nowrap">
                          View Book
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand">
                          {book.genre}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight mb-1 group-hover:text-brand transition-colors line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 line-clamp-1">
                        by {book.authorName}
                      </p>
                      <div className="mt-4 flex items-center gap-4 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                        <span>{book._count.reviews} Reviews</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        <span>{book.downloadCount} Downloads</span>
                      </div>
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
