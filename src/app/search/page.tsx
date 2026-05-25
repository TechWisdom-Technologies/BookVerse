"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Loader2, BookOpen, ArrowLeft, Clock } from "lucide-react";
import { SearchResults } from "@/components/search/SearchResults";
import { Pagination } from "@/components/shared/Pagination";
import type { SearchResult } from "@/lib/meilisearch";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const typeParam = (searchParams.get("type") as "all" | "books" | "stories" | "universes" | "authors") || "all";
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

  const handleTypeChange = (newType: "all" | "books" | "stories" | "universes" | "authors") => {
    router.push(`/search?q=${encodeURIComponent(query)}&type=${newType}`);
  };

  const hasResults = results.length > 0;
  const isEmpty = !isLoading && query.trim() && !hasResults;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Simple Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Search BookVerse.</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">Find stories, books, universes, and authors across the entire platform.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded">
            <Search className="w-3.5 h-3.5 text-zinc-300" />
            Search
          </div>
        </header>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-16">
          <div className="relative flex items-center">
            <Search className="absolute left-5 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type title, author, universe, or keywords..."
              className="w-full pl-14 pr-28 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-sm font-medium outline-none focus:border-zinc-900 dark:focus:border-white transition-all shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filter Tabs */}
        {query.trim() && (
          <div className="flex items-center justify-center gap-4 mb-16 flex-wrap">
            {(["all", "books", "stories", "universes", "authors"] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className={`px-6 py-2 rounded text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${
                  typeParam === t
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                    : "bg-transparent border-zinc-100 dark:border-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Results Metadata */}
        {query.trim() && !isLoading && (
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-zinc-50 dark:border-zinc-900">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 italic">Search Results</h2>
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white" />
              {total} Results Found
            </div>
          </div>
        )}

        {/* Loading / Results / Empty States */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-40">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-200 dark:text-zinc-800" />
            </div>
          ) : hasResults ? (
            <SearchResults results={results} type={typeParam} />
          ) : isEmpty ? (
            <div className="py-40 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">No results found for &quot;{query}&quot;.</p>
            </div>
          ) : !query.trim() && (
            <div className="py-40 text-center">
              <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded flex items-center justify-center mx-auto mb-8">
                <Search className="w-6 h-6 text-zinc-200" />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2">Ready to Search</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed font-bold uppercase tracking-widest">Enter keywords above to start searching.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && hasResults && totalPages > 1 && (
          <div className="mt-24 pt-16 border-t border-zinc-50 dark:border-zinc-900 flex justify-center">
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
