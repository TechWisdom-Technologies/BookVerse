"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, FileText, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";
import Link from "next/link";

interface Suggestion {
  id: string;
  _type: "book" | "story";
  title: string;
  authorName?: string;
  coverUrl?: string | null;
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          // Take top 3 books and top 3 stories
          const books = data.results.filter((r: Suggestion) => r._type === "book").slice(0, 3);
          const stories = data.results.filter((r: Suggestion) => r._type === "story").slice(0, 3);
          setSuggestions([...books, ...stories]);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, [query, router]);

  const handleClear = useCallback(() => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  }, []);

  const handleSuggestionClick = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSuggestions([]);
  }, []);

  const hasSuggestions = suggestions.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search books and stories..."
            className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-10 pr-10 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (hasSuggestions || isLoading) && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-xl border border-zinc-200 bg-white py-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
            </div>
          ) : (
            <>
              {/* Books Section */}
              {suggestions.some((s) => s._type === "book") && (
                <div className="px-3 py-2">
                  <p className="mb-2 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                    Books
                  </p>
                  {suggestions
                    .filter((s) => s._type === "book")
                    .map((book) => (
                      <Link
                        key={book.id}
                        href={`/library/${book.id}`}
                        onClick={handleSuggestionClick}
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      >
                        <div className="relative h-10 w-7 flex-shrink-0 overflow-hidden rounded bg-zinc-200 dark:bg-zinc-700">
                          {book.coverUrl ? (
                            <Image
                              src={book.coverUrl}
                              alt={book.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <BookOpen className="h-4 w-4 m-auto text-zinc-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                            {book.title}
                          </p>
                          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {book.authorName}
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              )}

              {/* Stories Section */}
              {suggestions.some((s) => s._type === "story") && (
                <div className="px-3 py-2">
                  <p className="mb-2 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                    Stories
                  </p>
                  {suggestions
                    .filter((s) => s._type === "story")
                    .map((story) => (
                      <Link
                        key={story.id}
                        href={`/stories/${story.id}`}
                        onClick={handleSuggestionClick}
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      >
                        <div className="relative h-10 w-7 flex-shrink-0 overflow-hidden rounded bg-zinc-200 dark:bg-zinc-700">
                          {story.coverUrl ? (
                            <Image
                              src={story.coverUrl}
                              alt={story.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <FileText className="h-4 w-4 m-auto text-zinc-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                            {story.title}
                          </p>
                          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                            by {story.authorName}
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              )}

              {/* See All Results */}
              <div className="border-t border-zinc-200 px-3 pt-2 dark:border-zinc-700">
                <button
                  onClick={handleSubmit}
                  className="w-full rounded-lg py-2 text-center text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950"
                >
                  See all results for &quot;{query}&quot;
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
