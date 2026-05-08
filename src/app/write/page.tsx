"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import {
  PenLine,
  Eye,
  Heart,
  MessageSquare,
  BookOpen,
  Trash2,
  Globe,
  FileText,
  Mail,
} from "lucide-react";

interface StoryItem {
  id: string;
  title: string;
  coverUrl: string | null;
  summary: string | null;
  viewCount: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    chapters: number;
    reactions: number;
    comments: number;
  };
}

export default function WriteDashboardPage() {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyStories = async () => {
      try {
        const res = await fetch("/api/users/me/stories");
        if (res.ok) {
          const data = await res.json();
          setStories(data.stories);
        }
      } catch {
        console.error("Failed to fetch stories");
      } finally {
        setLoading(false);
      }
    };
    fetchMyStories();
  }, []);

  const handleDelete = async (storyId: string) => {
    if (!confirm("Are you sure you want to delete this story? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/stories/${storyId}`, { method: "DELETE" });
      if (res.ok) {
        setStories((prev) => prev.filter((s) => s.id !== storyId));
      }
    } catch {
      console.error("Failed to delete story");
    }
  };

  const handleTogglePublish = async (storyId: string, currentlyPublished: boolean) => {
    try {
      const res = await fetch(`/api/stories/${storyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentlyPublished }),
      });
      if (res.ok) {
        setStories((prev) =>
          prev.map((s) =>
            s.id === storyId ? { ...s, published: !currentlyPublished } : s
          )
        );
      }
    } catch {
      console.error("Failed to toggle publish");
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            My Stories
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Manage your stories, chapters, and publications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/write/newsletter"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Newsletter
          </Link>
          <Link
            href="/write/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <PenLine className="h-4 w-4" />
            New Story
          </Link>
        </div>
      </div>

      {/* Stories List */}
      <div className="mt-8 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-12 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            </div>
          ))
        ) : stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              No stories yet
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Create your first story and share it with the world.
            </p>
            <Link
              href="/write/new"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <PenLine className="h-4 w-4" />
              Write your first story
            </Link>
          </div>
        ) : (
          stories.map((story) => (
            <div
              key={story.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/write/${story.id}/edit`}
                      className="text-base font-semibold text-zinc-900 hover:text-indigo-600 dark:text-zinc-50 dark:hover:text-indigo-400 transition-colors truncate"
                    >
                      {story.title}
                    </Link>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        story.published
                          ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {story.published ? (
                        <>
                          <Globe className="h-3 w-3" /> Published
                        </>
                      ) : (
                        "Draft"
                      )}
                    </span>
                  </div>

                  {/* Stats Row */}
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {story._count.chapters} chapters
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {story.viewCount} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {story._count.reactions} reactions
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {story._count.comments} comments
                    </span>
                    <span>Updated {formatDate(story.updatedAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Link
                    href={`/write/${story.id}/edit`}
                    className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                    title="Edit"
                  >
                    <PenLine className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleTogglePublish(story.id, story.published)}
                    className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                    title={story.published ? "Unpublish" : "Publish"}
                  >
                    <Globe className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
                    className="rounded-lg p-2 text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
