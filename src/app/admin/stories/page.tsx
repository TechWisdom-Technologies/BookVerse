"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Search, Trash2, Eye, FileText, Globe } from "lucide-react";

interface Story {
  id: string;
  title: string;
  coverUrl: string | null;
  published: boolean;
  viewCount: number;
  createdAt: string;
  author: {
    username: string;
    displayName: string | null;
  };
  _count: { chapters: number; comments: number };
}

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStories();
  }, [page, search]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/stories?page=${page}&search=${encodeURIComponent(search)}`
      );
      if (res.ok) {
        const data = await res.json();
        setStories(data.stories);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (storyId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/stories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId, published: !currentStatus }),
      });
      if (res.ok) {
        setStories(stories.map((s) =>
          s.id === storyId ? { ...s, published: !currentStatus } : s
        ));
      }
    } catch (error) {
      console.error("Failed to update story:", error);
    }
  };

  const handleDelete = async (storyId: string) => {
    if (!confirm("Are you sure you want to delete this story? This cannot be undone.")) return;

    try {
      const res = await fetch("/api/admin/stories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId }),
      });
      if (res.ok) {
        setStories(stories.filter((s) => s.id !== storyId));
      }
    } catch (error) {
      console.error("Failed to delete story:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Stories
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Manage community stories
      </p>

      <div className="mt-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories..."
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            onKeyDown={(e) => e.key === "Enter" && setPage(1)}
          />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          </div>
        ) : stories.length === 0 ? (
          <div className="py-12 text-center text-zinc-500">No stories found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Story</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Stats</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {stories.map((story) => (
                  <tr key={story.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {story.coverUrl ? (
                          <Image
                            src={story.coverUrl}
                            alt=""
                            width={40}
                            height={56}
                            className="rounded"
                          />
                        ) : (
                          <div className="flex h-14 w-10 items-center justify-center rounded bg-zinc-200 dark:bg-zinc-700">
                            <FileText className="h-4 w-4 text-zinc-500" />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/stories/${story.id}`}
                            className="font-medium text-zinc-900 hover:text-indigo-600 dark:text-zinc-50 dark:hover:text-indigo-400"
                          >
                            {story.title}
                          </Link>
                          <p className="text-xs text-zinc-500">
                            {story._count.chapters} chapters
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                      @{story.author.username}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {story.viewCount}
                        </span>
                        <span>{story._count.comments} comments</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTogglePublish(story.id, story.published)}
                          className="rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                          title={story.published ? "Unpublish" : "Publish"}
                        >
                          <Globe className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(story.id)}
                          className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-lg text-sm ${
                page === p
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

