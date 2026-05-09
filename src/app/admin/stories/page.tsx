"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Search, Trash2, Eye, FileText, Globe, ArrowLeft, ShieldCheck, Activity } from "lucide-react";

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

  useEffect(() => { fetchStories(); }, [page, search]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/stories?page=${page}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setStories(data.stories);
        setTotalPages(data.totalPages);
      }
    } finally { setLoading(false); }
  };

  const handleTogglePublish = async (storyId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/stories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId, published: !currentStatus }),
      });
      if (res.ok) {
        setStories(stories.map((s) => s.id === storyId ? { ...s, published: !currentStatus } : s));
      }
    } catch (error) { console.error("Failed to update story:", error); }
  };

  const handleDelete = async (storyId: string) => {
    if (!confirm("Execute manuscript purge? This archival record will be permanently deleted.")) return;
    try {
      const res = await fetch("/api/admin/stories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId }),
      });
      if (res.ok) { setStories(stories.filter((s) => s.id !== storyId)); }
    } catch (error) { console.error("Failed to delete story:", error); }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Minimal Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/admin" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Oversight Hub
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1">Manuscript Audit Registry.</h1>
              <p className="text-xs text-zinc-500 font-medium">Global management and moderation of community narrative transmissions.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 font-mono">
            <ShieldCheck className="w-3 h-3 text-zinc-300" />
            Audit Mode Active
          </div>
        </header>

        {/* Surgical Search */}
        <div className="mb-12 relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search registry..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-md text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            onKeyDown={(e) => e.key === "Enter" && setPage(1)}
          />
        </div>

        {/* Manuscript Registry Table */}
        <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-40">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-300" />
            </div>
          ) : stories.length === 0 ? (
            <div className="py-40 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No narrative records detected in registry.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900">
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Manuscript Record</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Archivist</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Engagement</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {stories.map((story) => (
                    <tr key={story.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-9 overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shrink-0">
                            {story.coverUrl ? (
                              <Image src={story.coverUrl} alt="" fill className="object-cover transition-all duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center opacity-10">
                                <FileText className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <Link href={`/stories/${story.id}`} className="text-xs font-bold text-zinc-900 dark:text-white hover:underline uppercase transition-colors">
                              {story.title}
                            </Link>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{story._count.chapters} Chapters</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                          story.published ? "text-emerald-500 bg-emerald-50/5 border-emerald-500/10" : "text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
                        }`}>
                          {story.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        @{story.author.username}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-2 text-[9px] font-mono font-bold text-zinc-900 dark:text-white">
                            <Eye className="w-3 h-3" /> {story.viewCount.toLocaleString()}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{story._count.comments} Engagements</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleTogglePublish(story.id, story.published)}
                            className="p-2 text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all rounded"
                            title={story.published ? "Withdraw" : "Feature"}
                          >
                            <Globe className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(story.id)}
                            className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-500/5 transition-all rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Pagination Protocol */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded text-[10px] font-bold uppercase transition-all ${
                  page === p
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                    : "bg-white dark:bg-zinc-950 text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
