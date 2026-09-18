"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List, Loader2 } from "lucide-react";
import { useTransition } from "react";

interface StoryFiltersProps {
  genres: string[];
}

const sortOptions = [
  { value: "popular", label: "Popular" },
  { value: "recent", label: "Newest" },
  { value: "views", label: "Most Viewed" },
  { value: "reactions", label: "Most Reactions" },
];

export function StoryFilters({ genres }: StoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentSort = searchParams.get("sort") || "popular";
  const currentGenre = searchParams.get("genre") || "";
  const currentView = searchParams.get("view") || "grid";
  const hasFilters = currentGenre || currentSort !== "popular";

  function handleReset() {
    startTransition(() => {
      const params = new URLSearchParams();
      if (currentView) params.set("view", currentView);
      router.push(`/stories?${params.toString()}`, { scroll: false });
    });
  }

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/stories?${params.toString()}`, { scroll: false });
    });
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

      {hasFilters && (
        <button
          type="button"
          onClick={handleReset}
          className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors px-2 ml-1"
        >
          Reset
        </button>
      )}
      
      <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900 ml-auto md:ml-4">
        <button
          type="button"
          onClick={() => updateParam("view", "grid")}
          className={`rounded-md p-1.5 transition-colors ${
            currentView === "grid"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
          title="Grid View"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => updateParam("view", "list")}
          className={`rounded-md p-1.5 transition-colors ${
            currentView === "list"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
              : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
          title="List View"
        >
          <List className="w-4 h-4" />
        </button>
      </div>
      {isPending && <Loader2 className="w-4 h-4 animate-spin text-zinc-400 ml-2" />}
    </div>
  );
}
