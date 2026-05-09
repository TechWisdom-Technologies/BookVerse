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
    <div className="max-w-7xl mx-auto pb-20 pt-8 sm:pt-12 px-4 sm:px-8">
      <header className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">
          Stories
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
          Manage community stories
        </p>
      </header>

      <div className="mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories..."
            className="w-full rounded-full border-2 border-zinc-200/50 bg-white/80 py-4 pl-16 pr-6 text-lg font-medium shadow-xl shadow-zinc-200/20 backdrop-blur-md transition-all focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:shadow-none dark:focus:border-brand dark:focus:bg-zinc-900/80"
            onKeyDown={(e) => e.key === "Enter" && setPage(1)}
          />
        </div>
      </div>

      <div className="rounded-[2rem] border border-zinc-200/50 bg-white/80 p-4 sm:p-8 shadow-xl shadow-zinc-200/20 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:shadow-none">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-brand" />
          </div>
        ) : stories.length === 0 ? (
          <div className="py-20 text-center text-xl font-bold text-zinc-500">No stories found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 px-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Story</th>
                  <th className="border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 px-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Status</th>
                  <th className="border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 px-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Author</th>
                  <th className="border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 px-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Stats</th>
                  <th className="border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 px-4 text-right text-xs font-bold uppercase tracking-wider text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {stories.map((story) => (
                  <tr key={story.id} className="group transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                    <td className="px-4 py-4 sm:py-6">
                      <div className="flex items-center gap-4">
                        {story.coverUrl ? (
                          <div className="relative h-16 w-12 overflow-hidden rounded-lg shadow-md">
                            <Image
                              src={story.coverUrl}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-16 w-12 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800 shadow-inner">
                            <FileText className="h-6 w-6 text-zinc-400" />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/stories/${story.id}`}
                            className="text-base sm:text-lg font-bold text-zinc-900 transition-colors hover:text-brand dark:text-white dark:hover:text-brand"
                          >
                            {story.title}
                          </Link>
                          <p className="text-sm font-medium text-zinc-500">
                            {story._count.chapters} chapters
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 sm:py-6">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                          story.published
                            ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {story.published ? (
                          <>
                            <Globe className="h-3.5 w-3.5" /> Published
                          </>
                        ) : (
                          "Draft"
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4 sm:py-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      @{story.author.username}
                    </td>
                    <td className="px-4 py-4 sm:py-6">
                      <div className="flex flex-col gap-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-2">
                          <Eye className="h-4 w-4" /> {story.viewCount} views
                        </span>
                        <span>{story._count.comments} comments</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 sm:py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTogglePublish(story.id, story.published)}
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                            story.published
                              ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                              : "bg-brand/10 text-brand hover:bg-brand hover:text-white"
                          }`}
                          title={story.published ? "Unpublish" : "Publish"}
                        >
                          <Globe className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(story.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-500 dark:hover:text-white"
                        >
                          <Trash2 className="h-5 w-5" />
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
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-bold transition-all ${
                page === p
                  ? "bg-brand text-white shadow-lg shadow-brand/30"
                  : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
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

