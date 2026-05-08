"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Loader2, BookOpen } from "lucide-react";
import { SearchResults } from "@/components/search/SearchResults";
import { Pagination } from "@/components/shared/Pagination";
import type { SearchResult } from "@/lib/meilisearch";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const typeParam = (searchParams.get("type") as "all" | "books" | "stories") || "all";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotal(0);
      setTotalPages(1);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&type=${typeParam}&page=${pageParam}&limit=12`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.results);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, typeParam, pageParam]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}&type=${typeParam}`);
    }
  };

  const handleTypeChange = (newType: "all" | "books" | "stories") => {
    router.push(`/search?q=${encodeURIComponent(query)}&type=${newType}`);
  };

  const hasResults = results.length > 0;
  const isEmpty = !isLoading && query.trim() && !hasResults;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
      {/* Header */}
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Search Results
      </h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mt-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books and stories..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-12 pr-4 text-base text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
          />
        </div>
      </form>

      {/* Type Filter Tabs */}
      {query.trim() && (
        <div className="mt-6 border-b border-zinc-200 dark:border-zinc-800">
          <nav className="flex gap-6">
            {(["all", "books", "stories"] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className={`border-b-2 pb-3 pt-2 text-sm font-medium capitalize transition-colors ${
                  typeParam === t
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Results Count */}
      {query.trim() && !isLoading && (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          {total} result{total !== 1 ? "s" : ""} for &quot;{query}&quot;
        </p>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      )}

      {/* Results */}
      {!isLoading && hasResults && (
        <div className="mt-6">
          <SearchResults results={results} type={typeParam} />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && isEmpty && (
        <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <BookOpen className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700" />
          <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            No results found
          </h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Try a different search term or browse the library.
          </p>
        </div>
      )}

      {/* Initial State - No Query */}
      {!query.trim() && !isLoading && (
        <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <Search className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700" />
          <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Start searching
          </h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Enter a search term to find books and stories.
          </p>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && hasResults && totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            currentPage={pageParam}
            totalPages={totalPages}
            basePath={`/search?q=${encodeURIComponent(query)}&type=${typeParam}`}
          />
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      </main>
    }>
      <SearchContent />
    </Suspense>
  );
}

