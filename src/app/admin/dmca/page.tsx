"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Search, Trash2, Eye, ShieldCheck, AlertCircle } from "lucide-react";

interface DMCA {
  id: string;
  storyId: string;
  originalWorkTitle: string;
  originalWorkAuthor?: string | null;
  copyrightHolder: string;
  description?: string | null;
  status: string;
  createdAt: string;
  submittedByUser?: { username?: string } | null;
}

export default function AdminDMCAPage() {
  const [notices, setNotices] = useState<DMCA[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { fetchNotices(); }, [page, search]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/dmca?page=${page}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setNotices(data.notices);
        setTotalPages(data.totalPages);
      }
    } finally { setLoading(false); }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/dmca`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noticeId: id, status: newStatus }),
      });
      if (res.ok) fetchNotices();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently remove this DMCA notice?")) return;
    try {
      const res = await fetch(`/api/admin/dmca`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ noticeId: id }) });
      if (res.ok) setNotices(notices.filter(n => n.id !== id));
    } catch (e) { console.error(e); }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex items-end justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight mb-1">DMCA Notices</h1>
            <p className="text-xs text-zinc-500 font-medium">Submitted copyright claims and takedown workflow.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 font-mono">
            <ShieldCheck className="w-3 h-3 text-zinc-300" /> Audit Mode
          </div>
        </header>

        <div className="mb-8 relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-300" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notices..." className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-md text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white outline-none focus:border-zinc-900" onKeyDown={(e) => e.key === 'Enter' && setPage(1)} />
        </div>

        <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-40"><Loader2 className="h-5 w-5 animate-spin text-zinc-300" /></div>
          ) : notices.length === 0 ? (
            <div className="py-40 text-center"><p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No DMCA notices found.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900">
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Claim</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Submitter</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {notices.map(n => (
                    <tr key={n.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <div className="text-xs font-bold text-zinc-900 dark:text-white uppercase">{n.originalWorkTitle}</div>
                          <div className="text-[10px] text-zinc-400 uppercase mt-1">{n.copyrightHolder}{n.originalWorkAuthor ? ` — ${n.originalWorkAuthor}` : ''}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">@{n.submittedByUser?.username || 'unknown'}</td>
                      <td className="py-4 px-6">
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border text-amber-500 bg-amber-50/5 border-amber-500/10">{n.status}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleUpdateStatus(n.id, 'ACKNOWLEDGED')} title="Acknowledge" className="p-2 text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all rounded"><Eye className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleUpdateStatus(n.id, 'RESOLVED')} title="Resolve" className="p-2 text-zinc-300 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all rounded"><AlertCircle className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(n.id)} className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-500/5 transition-all rounded"><Trash2 className="w-3.5 h-3.5" /></button>
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
