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
      {/* Navigation */}
      <div className="flex items-center gap-10 mb-12 border-b border-zinc-100 dark:border-zinc-900">
        <button
          onClick={() => setActiveTab("stories")}
          className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${
            activeTab === "stories"
              ? "text-zinc-900 dark:text-white"
              : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          My Stories <span className="ml-1 text-[9px] text-zinc-300 font-mono">({stories.length})</span>
          {activeTab === "stories" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-900 dark:bg-white" />}
        </button>
        <button
          onClick={() => setActiveTab("books")}
          className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${
            activeTab === "books"
              ? "text-zinc-900 dark:text-white"
              : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          My Books <span className="ml-1 text-[9px] text-zinc-300 font-mono">({books.length})</span>
          {activeTab === "books" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-zinc-900 dark:bg-white" />}
        </button>
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeTab === "stories" && (
          <div className="animate-in fade-in duration-500">
            {stories.length === 0 ? (
              <div className="py-32 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">No stories written yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
                {stories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/stories/${story.id}`}
                    className="group flex flex-col p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all"
                  >
                    <div className="relative aspect-[2/3] w-full rounded overflow-hidden bg-zinc-50 dark:bg-zinc-900 mb-6 border border-zinc-100 dark:border-zinc-800">
                      {story.coverUrl ? (
                        <Image
                          src={story.coverUrl}
                          alt={story.title}
                          fill
                          className="object-cover transition-all duration-700"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-200 dark:text-zinc-800">
                          <FileText className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">
                          Short Story
                        </span>
                      </div>
                      <h3 className="text-sm font-bold tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-1 uppercase">
                        {story.title}
                      </h3>
                      {story.summary && (
                        <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed font-medium">
                          {story.summary}
                        </p>
                      )}
                      <div className="mt-6 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5 text-zinc-300" /> {story.viewCount}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Heart className="h-3.5 w-3.5 text-zinc-300" /> {story._count.reactions}
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
          <div className="animate-in fade-in duration-500">
            {books.length === 0 ? (
              <div className="py-32 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">No books uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
                {books.map((book) => (
                  <Link
                    key={book.id}
                    href={`/library/${book.id}`}
                    className="group flex flex-col p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all"
                  >
                    <div className="relative aspect-[2/3] w-full rounded overflow-hidden bg-zinc-50 dark:bg-zinc-900 mb-6 border border-zinc-100 dark:border-zinc-800">
                      {book.coverUrl ? (
                        <Image
                          src={book.coverUrl}
                          alt={book.title}
                          fill
                          className="object-cover transition-all duration-700"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-200 dark:text-zinc-800">
                          <BookOpen className="h-10 w-10" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">
                          {book.genre}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-1 uppercase">
                        {book.title}
                      </h3>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {book.authorName}
                      </p>
                      <div className="mt-6 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        <span>{book._count.reviews} Reviews</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                        <span>{book.downloadCount} Reads</span>
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
