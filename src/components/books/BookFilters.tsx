"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";

interface BookFiltersProps {
  genres: string[];
  languages: string[];
}

export function BookFilters({ genres, languages }: BookFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentGenre = searchParams.get("genre") || "";
  const currentLanguage = searchParams.get("language") || "";
  const currentFileType = searchParams.get("fileType") || "";
  const currentSort = searchParams.get("sort") || "recent";
  const currentQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(currentQuery);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
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
    <aside className="space-y-4">
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
    </aside>
  );
}
