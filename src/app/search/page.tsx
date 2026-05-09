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
    <main className="min-h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A] pt-16 pb-32">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        
        {/* Huge Clean Header */}
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter mb-6">
            Search.
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            Find the stories, books, and authors you're looking for.
          </p>
        </header>

        {/* Interactive Big Search Form */}
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-16 relative group z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-brand via-orange-500 to-rose-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative flex items-center bg-white dark:bg-zinc-900/80 backdrop-blur-xl rounded-full border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden ring-1 ring-zinc-900/5 dark:ring-white/5">
            <Search className="absolute left-8 w-6 h-6 text-zinc-400 group-focus-within:text-brand transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or keyword..."
              className="w-full bg-transparent py-5 sm:py-6 pl-20 pr-32 text-lg sm:text-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none font-medium"
            />
            <button
              type="submit"
              className="absolute right-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filter Tabs */}
        {query.trim() && (
          <div className="flex items-center justify-center gap-4 mb-16">
            {(["all", "books", "stories"] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  typeParam === t
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl"
                    : "bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Minimal Divider if active search */}
        {query.trim() && !isLoading && (
          <div className="w-full flex items-center justify-between mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Results</h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {total} match{total !== 1 ? "es" : ""} found
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-brand" />
          </div>
        )}

        {/* Results */}
        {!isLoading && hasResults && (
          <div className="min-h-[400px]">
            <SearchResults results={results} type={typeParam} />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && isEmpty && (
          <div className="py-32 text-center bg-zinc-50 dark:bg-zinc-900/30 rounded-[3rem] border border-zinc-200 dark:border-zinc-800">
            <BookOpen className="mx-auto w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-6" />
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
              We couldn't find anything matching "{query}". Try adjusting your search or browsing the library.
            </p>
          </div>
        )}

        {/* Initial State - No Query */}
        {!query.trim() && !isLoading && (
          <div className="py-32 text-center">
            <div className="w-24 h-24 bg-brand/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-brand/5 rotate-12">
              <Search className="w-10 h-10 text-brand -rotate-12" />
            </div>
            <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
              What are you looking for?
            </h3>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Type a title, genre, or author in the massive search bar above to begin exploring our collection.
            </p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && hasResults && totalPages > 1 && (
          <div className="mt-24 border-t border-zinc-200 dark:border-zinc-800 pt-12 flex justify-center">
            <Pagination
              currentPage={pageParam}
              totalPages={totalPages}
              basePath={`/search?q=${encodeURIComponent(query)}&type=${typeParam}`}
            />
          </div>
        )}
      </div>
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

