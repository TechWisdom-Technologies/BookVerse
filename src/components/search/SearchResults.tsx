"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, FileText, Globe, User, Compass } from "lucide-react";

interface SearchResultsProps {
  results: any[];
  type: "all" | "books" | "stories" | "universes" | "authors";
}

const getUniverseGraphic = (name: string) => {
  const colors = [
    "from-indigo-600 via-purple-600 to-pink-600",
    "from-cyan-500 via-blue-600 to-indigo-700",
    "from-emerald-500 via-teal-600 to-cyan-700",
    "from-rose-500 via-pink-600 to-purple-700",
    "from-amber-500 via-orange-600 to-rose-700",
    "from-violet-600 via-fuchsia-600 to-pink-700"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export function SearchResults({ results, type }: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  const books = results.filter((r) => r._type === "book");
  const stories = results.filter((r) => r._type === "story");
  const universes = results.filter((r) => r._type === "universe");
  const authors = results.filter((r) => r._type === "author");

  return (
    <div className="space-y-16">
      {/* Stories Section */}
      {(type === "all" || type === "stories") && stories.length > 0 && (
        <section>
          {type === "all" && (
            <h2 className="mb-10 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600 border-b border-zinc-50 dark:border-zinc-900 pb-4 italic">
              Stories Found
            </h2>
          )}
          <div className="grid gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.id}`}
                className="group flex flex-col p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 mb-6 border border-zinc-100 dark:border-zinc-800">
                  {story.coverUrl ? (
                    <Image
                      src={story.coverUrl}
                      alt={story.title}
                      fill
                      className="object-cover transition-all duration-700"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-200 dark:text-zinc-800">
                      <FileText className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">
                      Short Story
                    </span>
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white line-clamp-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors uppercase">
                    {story.title}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {story.authorName}
                  </p>
                  {story.summary && (
                    <p className="mt-3 line-clamp-2 text-[11px] font-medium text-zinc-500 leading-relaxed italic">
                      &quot;{story.summary}&quot;
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Books Section */}
      {(type === "all" || type === "books") && books.length > 0 && (
        <section>
          {type === "all" && (
            <h2 className="mb-10 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600 border-b border-zinc-50 dark:border-zinc-900 pb-4 italic">
              Books Found
            </h2>
          )}
          <div className="grid gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <Link
                key={book.id}
                href={`/library/${book.id}`}
                className="group flex flex-col p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 mb-6 border border-zinc-100 dark:border-zinc-800">
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      fill
                      className="object-cover transition-all duration-700"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-200 dark:text-zinc-800">
                      <BookOpen className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">
                      {book.genre}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white line-clamp-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors uppercase">
                    {book.title}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {book.authorName}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Universes Section */}
      {(type === "all" || type === "universes") && universes.length > 0 && (
        <section>
          {type === "all" && (
            <h2 className="mb-10 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600 border-b border-zinc-50 dark:border-zinc-900 pb-4 italic">
              Universes Found
            </h2>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {universes.map((uni) => (
              <Link
                key={uni.id}
                href={`/universes/${uni.id}`}
                className="group flex flex-col border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all relative overflow-hidden shadow-sm"
              >
                <div className="h-44 w-full overflow-hidden relative">
                  {uni.coverUrl ? (
                    <img
                      src={uni.coverUrl}
                      alt=""
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getUniverseGraphic(uni.name)} flex flex-col items-center justify-center p-6 text-center relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)]" />
                      <Compass className="w-8 h-8 text-white/90 drop-shadow-md mb-2 relative z-10 animate-pulse duration-1000" />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-white/80 relative z-10 drop-shadow-sm">
                        {uni.genre} Realm
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-400 text-[9px] font-bold uppercase tracking-widest border border-zinc-100 dark:border-zinc-800">
                      {uni.genre}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold mb-2 tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors uppercase line-clamp-1">
                    {uni.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-medium line-clamp-2 leading-relaxed mb-4 flex-1">
                    {uni.description || "Explore this interconnected universe."}
                  </p>
                  <div className="pt-4 border-t border-zinc-50 dark:border-zinc-900 flex items-center justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-auto">
                    <span>by {uni.creatorName}</span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {uni.storyCount} Stories
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Authors Section */}
      {(type === "all" || type === "authors") && authors.length > 0 && (
        <section>
          {type === "all" && (
            <h2 className="mb-10 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600 border-b border-zinc-50 dark:border-zinc-900 pb-4 italic">
              Authors Found
            </h2>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={`/profile/${author.username}`}
                className="group flex flex-col items-center text-center p-8 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all shadow-sm"
              >
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-zinc-50 dark:bg-zinc-900 mb-4 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
                  {author.avatarUrl ? (
                    <img
                      src={author.avatarUrl}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <User className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
                  )}
                </div>
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white line-clamp-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors uppercase">
                  {author.displayName || author.username}
                </h3>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                  @{author.username}
                </p>
                {author.bio && (
                  <p className="text-[11px] text-zinc-500 font-medium line-clamp-2 leading-relaxed max-w-xs italic">
                    &quot;{author.bio}&quot;
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
