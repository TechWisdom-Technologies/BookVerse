"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface StoryFiltersProps {
  genres: string[];
}

const sortOptions = [
  { value: "recent", label: "Newest" },
  { value: "popular", label: "Most Viewed" },
  { value: "reactions", label: "Most Reactions" },
];

export function StoryFilters({ genres }: StoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "recent";
  const currentGenre = searchParams.get("genre") || "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/stories?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => updateParam("sort", option.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              currentSort === option.value
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <select
        value={currentGenre}
        onChange={(event) => updateParam("genre", event.target.value)}
        className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
}
