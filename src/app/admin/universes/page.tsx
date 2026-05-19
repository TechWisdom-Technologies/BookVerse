"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Search, Trash2, Globe, Eye } from "lucide-react";

interface Universe {
  id: string;
  name: string;
  description?: string | null;
  genre?: string | null;
  coverUrl?: string | null;
  user?: { username?: string } | null;
  _count?: { stories?: number };
}

export default function AdminUniversesPage() {
  const [items, setItems] = useState<Universe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { fetchItems(); }, [page, search]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/universes?page=${page}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.universes);
        setTotalPages(data.totalPages);
      }
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this universe and all associated stories?")) return;
    try {
      const res = await fetch(`/api/admin/universes`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ universeId: id }) });
      if (res.ok) setItems(items.filter(i => i.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex items-end justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight mb-1">Universes</h1>
            <p className="text-xs text-zinc-500 font-medium">Manage story universes and associated metadata.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 font-mono">
            <Globe className="w-3 h-3 text-zinc-300" /> Oversight
          </div>
        </header>

        <div className="mb-8 relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-300" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search universes..." className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-md text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white outline-none focus:border-zinc-900" onKeyDown={(e) => e.key === 'Enter' && setPage(1)} />
        </div>

        <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-40"><Loader2 className="h-5 w-5 animate-spin text-zinc-300" /></div>
          ) : items.length === 0 ? (
            <div className="py-40 text-center"><p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No universes found.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900">
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Universe</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Owner</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Stories</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {items.map(u => (
                    <tr key={u.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-9 overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shrink-0">
                            {u.coverUrl ? (
                              <Image src={u.coverUrl} alt={u.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center opacity-10"><Eye className="w-4 h-4" /></div>
                            )}
                          </div>
                          <div>
                            <Link href={`/universes/${u.id}`} className="text-xs font-bold text-zinc-900 dark:text-white hover:underline uppercase transition-colors">{u.name}</Link>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">{u.genre}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">@{u.user?.username || 'unknown'}</td>
                      <td className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">{u._count?.stories || 0} Stories</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleDelete(u.id)} className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-500/5 transition-all rounded"><Trash2 className="w-3.5 h-3.5" /></button>
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 flex items-center justify-center rounded text-[10px] font-bold uppercase transition-all ${page === p ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'bg-white dark:bg-zinc-950 text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
