"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Search, Trash2, Library, Eye } from "lucide-react";
import toast from "react-hot-toast";

interface Series {
  id: string;
  name: string;
  description?: string | null;
  coverUrl?: string | null;
  user?: { username?: string } | null;
  _count?: { stories?: number };
}

export default function AdminSeriesPage() {
  const [items, setItems] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchItems();
  }, [page, search]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/series?page=${page}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.series);
        setTotalPages(data.totalPages);
      } else {
        toast.error("Failed to load story series");
      }
    } catch (err) {
      console.error("Series fetch error:", err);
      toast.error("Error communicating with server");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this series? Stories within the series will remain but will be removed from this collection.")) return;
    try {
      const res = await fetch(`/api/admin/series`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesId: id }),
      });
      if (res.ok) {
        toast.success("Series deleted successfully");
        setItems(items.filter((i) => i.id !== id));
      } else {
        toast.error("Failed to delete series");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network communication error");
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex items-end justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight mb-1">Story Series</h1>
            <p className="text-xs text-zinc-500 font-medium">Manage narrative series, sequence directories, and associated collections.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 font-mono">
            <Library className="w-3 h-3 text-zinc-300" /> Series Index
          </div>
        </header>

        <div className="mb-8 relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search series..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-md text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white outline-none focus:border-zinc-900"
            onKeyDown={(e) => e.key === "Enter" && setPage(1)}
          />
        </div>

        <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-40">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-300" />
            </div>
          ) : items.length === 0 ? (
            <div className="py-40 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No story series found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/10">
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Series</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Owner</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Narratives</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {items.map((s) => (
                    <tr key={s.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-9 overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shrink-0 shadow-sm">
                            {s.coverUrl ? (
                              <img src={s.coverUrl} alt={s.name} className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center opacity-10">
                                <Library className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/series/${s.id}`}
                              target="_blank"
                              className="text-xs font-bold text-zinc-900 dark:text-white hover:underline uppercase transition-colors"
                            >
                              {s.name}
                            </Link>
                            {s.description && (
                              <p className="text-[10px] text-zinc-400 font-medium truncate max-w-sm mt-0.5">
                                {s.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        @{s.user?.username || "unknown"}
                      </td>
                      <td className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        {s._count?.stories || 0} Stories
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDelete(s.id)}
                            title="Delete Series"
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
