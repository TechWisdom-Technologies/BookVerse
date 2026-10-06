"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Search } from "lucide-react";

interface SavedBook {
  id: string;
  book: {
    id: string;
    title: string;
    authorName: string;
    coverUrl: string | null;
    genre: string | null;
    description: string | null;
  };
}

export function ShelfClient({ savedBooks }: { savedBooks: SavedBook[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooks = savedBooks.filter((save) => {
    const q = searchQuery.toLowerCase();
    return (
      save.book.title.toLowerCase().includes(q) ||
      save.book.authorName.toLowerCase().includes(q) ||
      (save.book.genre && save.book.genre.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder="Search your library..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={savedBooks.length === 0}
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:border-zinc-900 dark:focus:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {savedBooks.length === 0 ? (
        <div className="py-40 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
          <BookOpen className="mx-auto w-10 h-10 text-zinc-100 dark:text-zinc-800 mb-8" />
          <h3 className="text-sm font-bold uppercase tracking-tight mb-2">Library Empty</h3>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-10 font-bold uppercase tracking-widest">You haven't saved any books yet.</p>
          <Link
            href="/library"
            className="px-10 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all"
          >
            Browse Library
          </Link>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
          <h3 className="text-sm font-bold uppercase tracking-tight mb-2">No results found</h3>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
          {filteredBooks.map((save) => (
            <Link 
              key={save.id}
              href={`/library/${save.book.id}`}
              className="group flex flex-col p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all"
            >
              <div className="relative aspect-[2/3] w-full rounded overflow-hidden bg-zinc-50 dark:bg-zinc-900 mb-6 border border-zinc-100 dark:border-zinc-800">
                {save.book.coverUrl ? (
                  <Image
                    src={save.book.coverUrl}
                    alt={save.book.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-all duration-700"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-200 dark:text-zinc-800">
                    <BookOpen className="h-10 w-10" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">
                    {save.book.genre}
                  </span>
                </div>
                <h3 className="text-sm font-bold tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-1 uppercase">
                  {save.book.title}
                </h3>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {save.book.authorName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
