"use client";

import { FilePenLine } from "lucide-react";
import { StoryCard } from "./StoryCard";

interface StoryAuthor {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

interface StoryData {
  id: string;
  title: string;
  coverUrl: string | null;
  summary: string | null;
  viewCount: number;
  createdAt: string;
  author: StoryAuthor;
  _count: {
    chapters: number;
    reactions: number;
    comments: number;
  };
  isTrendingPromo?: boolean;
  isPromotedPromo?: boolean;
  isFeaturedPromo?: boolean;
  series?: { name: string } | null;
  universe?: { name: string } | null;
  sequenceNumber?: number | null;
}

interface StoryGridProps {
  stories: StoryData[];
  loading?: boolean;
  view?: "grid" | "list";
}

export function StoryGrid({ stories, loading, view = "grid" }: StoryGridProps) {
  if (loading) {
    return (
      <div className={view === "list" ? "grid gap-6 grid-cols-1 md:grid-cols-2" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className={`animate-pulse ${view === "list" ? "flex flex-row gap-4 h-36" : "space-y-3"}`}>
            <div className={`${view === "list" ? "w-24 shrink-0" : "aspect-[2/3]"} rounded-lg bg-zinc-200 dark:bg-zinc-800`} />
            <div className={`space-y-2 flex-grow ${view === "list" ? "py-2" : ""}`}>
              <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FilePenLine className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-700" />
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          No stories yet
        </h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Be the first to share your story with the community.
        </p>
      </div>
    );
  }

  return (
    <div className={view === "list" ? "grid gap-6 grid-cols-1 md:grid-cols-2" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}>
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} view={view} />
      ))}
    </div>
  );
}
