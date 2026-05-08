"use client";

import { useRouter, useSearchParams } from "next/navigation";

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

  return (
    <aside className="space-y-4">
      <div>
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Genre</label>
        <select
          value={currentGenre}
          onChange={(e) => updateFilter("genre", e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Language</label>
        <select
          value={currentLanguage}
          onChange={(e) => updateFilter("language", e.target.value)}
          className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
        >
          <option value="">All Languages</option>
          {languages.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
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
