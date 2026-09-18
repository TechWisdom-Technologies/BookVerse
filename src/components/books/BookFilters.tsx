"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X, Loader2 } from "lucide-react";

interface BookFiltersProps {
  genres: string[];
  languages: string[];
}

export function BookFilters({ genres, languages }: BookFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentGenre = searchParams.get("genre") || "";
  const currentLanguage = searchParams.get("language") || "";
  const currentFileType = searchParams.get("fileType") || "";
  const currentSort = searchParams.get("sort") || "recent";
  const currentQuery = searchParams.get("q") || "";
  const currentTags = searchParams.get("tags") || "";

  const [query, setQuery] = useState(currentQuery);
  const hasFilters = currentGenre || currentLanguage || currentFileType || currentSort !== "recent" || currentQuery || currentTags;

  function handleReset() {
    setQuery("");
    const form = document.querySelector('input[name="tags"]')?.closest('form');
    if (form) form.reset();
    
    startTransition(() => {
      router.push(window.location.pathname, { scroll: false });
    });
  }

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilter("q", query.trim());
  }

  function clearSearch() {
    setQuery("");
    updateFilter("q", "");
  }

  return (
    <aside className="space-y-4 relative">
      {isPending && (
        <div className="absolute -top-6 right-0 text-[9px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin" /> Updating...
        </div>
      )}
      {/* Search Input */}
      <div>
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Search</label>
        <form onSubmit={handleSearch} className="mt-2 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title, author, keyword..."
            className="w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-8 py-2 text-sm text-zinc-900 transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-300" />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Genre</label>
        <input
          type="text"
          list="genre-list"
          placeholder="Type or select genre"
          value={currentGenre}
          onChange={(e) => updateFilter("genre", e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 outline-none"
        />
        <datalist id="genre-list">
          {genres.map((g) => (
            <option key={g} value={g} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Language</label>
        <input
          type="text"
          list="language-list"
          placeholder="Type or select language"
          value={currentLanguage}
          onChange={(e) => updateFilter("language", e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 outline-none"
        />
        <datalist id="language-list">
          {languages.map((l) => (
            <option key={l} value={l} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Tags</label>
        <form onSubmit={(e) => { e.preventDefault(); updateFilter("tags", e.currentTarget.tags.value.trim()); }} className="mt-2 relative">
          <input
            type="text"
            name="tags"
            defaultValue={searchParams.get("tags") || ""}
            placeholder="e.g. magic, space..."
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 outline-none pr-8"
          />
          {searchParams.get("tags") && (
            <button
              type="button"
              onClick={() => {
                const form = document.querySelector('input[name="tags"]')?.closest('form');
                if (form) form.reset();
                updateFilter("tags", "");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">File Type</label>
        <select
          value={currentFileType}
          onChange={(e) => updateFilter("fileType", e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
        >
          <option value="">All Types</option>
          <option value="PDF">PDF</option>
          <option value="EPUB">EPUB</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Sort</label>
        <select
          value={currentSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
        >
          <option value="recent">Recent</option>
          <option value="popular">Most Downloaded</option>
          <option value="rating">Top Rated</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>
      
      {hasFilters && (
        <button
          type="button"
          onClick={handleReset}
          className="w-full mt-2 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900/50 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Reset All Filters
        </button>
      )}
    </aside>
  );
}
