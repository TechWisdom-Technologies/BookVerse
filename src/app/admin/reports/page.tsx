"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Search, Trash2, Eye, ShieldCheck, AlertCircle, FileText, CheckCircle, Scale, XCircle } from "lucide-react";
import toast from "react-hot-toast";

interface ContentReport {
  id: string;
  storyId: string;
  reason: "COPYRIGHTED" | "EXPLICIT" | "HATE_SPEECH" | "HARASSMENT" | "OTHER";
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
  description?: string | null;
  createdAt: string;
  reporter: {
    id: string;
    username: string;
    displayName: string | null;
    email: string;
  } | null;
  story: {
    id: string;
    title: string;
    published: boolean;
    coverUrl: string | null;
    viewCount: number;
    author: {
      username: string;
      email: string;
    };
  } | null;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [reasonFilter, setReasonFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReports();
  }, [page, search, reasonFilter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?page=${page}&reason=${reasonFilter}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports);
        setTotalPages(data.totalPages);
      } else {
        console.error("Failed to fetch reports:", res.status);
        toast.error("Failed to load reports docket");
      }
    } catch (err) {
      console.error("Reports fetch error:", err);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "REVIEWED" | "RESOLVED" | "DISMISSED") => {
    try {
      const res = await fetch(`/api/admin/reports`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: id, status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Report marked as ${newStatus}`);
        fetchReports();
      } else {
        toast.error("Failed to update status");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network communication error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently purge this report log from database?")) return;
    try {
      const res = await fetch(`/api/admin/reports`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: id }),
      });
      if (res.ok) {
        toast.success("Report log deleted");
        setReports(reports.filter(r => r.id !== id));
      } else {
        toast.error("Failed to delete log");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network communication error");
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case "HATE_SPEECH": return "Hate Speech";
      case "HARASSMENT": return "Harassment";
      case "EXPLICIT": return "Explicit Content";
      case "COPYRIGHTED": return "Copyright Issue";
      default: return "Policy Violation";
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex items-end justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight mb-1">Safety & Policy Reports</h1>
            <p className="text-xs text-zinc-500 font-medium">Access and resolve user-flagged violations (Hate Speech, Harassment, Offensive Content).</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" /> Moderation Active
          </div>
        </header>

        {/* Filter deck */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports or authors..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white outline-none focus:border-zinc-900"
              onKeyDown={(e) => e.key === 'Enter' && setPage(1)}
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {[
              { val: "ALL", label: "All Logs" },
              { val: "HATE_SPEECH", label: "Hate Speech" },
              { val: "HARASSMENT", label: "Harassment" },
              { val: "EXPLICIT", label: "Explicit" },
              { val: "COPYRIGHTED", label: "Copyright" },
              { val: "OTHER", label: "Other" }
            ].map((t) => (
              <button
                key={t.val}
                onClick={() => { setReasonFilter(t.val); setPage(1); }}
                className={`px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                  reasonFilter === t.val
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                    : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Docket */}
        <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-40">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-300" />
            </div>
          ) : reports.length === 0 ? (
            <div className="py-40 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No safety report logs found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10">
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Flagged Violation</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Target Content / Author</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Reporter</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {reports.map((r) => (
                    <tr key={r.id} className="group hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1.5 max-w-xs">
                          <span className={`inline-fit w-fit text-[9px] font-bold px-2 py-0.5 rounded border ${
                            r.reason === "HATE_SPEECH" || r.reason === "HARASSMENT"
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                              : r.reason === "EXPLICIT"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                              : "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                          }`}>
                            {getReasonLabel(r.reason)}
                          </span>
                          {r.description && (
                            <p className="text-[10px] text-zinc-500 font-medium italic border-l-2 border-zinc-200 dark:border-zinc-800 pl-2 py-0.5">
                              "{r.description}"
                            </p>
                          )}
                          <span className="text-[9px] text-zinc-400 font-mono">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {r.story ? (
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-7 rounded overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shrink-0 shadow-sm">
                              {r.story.coverUrl && <img src={r.story.coverUrl} alt="" className="h-full w-full object-cover" />}
                            </div>
                            <div className="min-w-0">
                              <Link href={`/stories/${r.story.id}`} target="_blank" className="text-xs font-bold text-zinc-900 dark:text-white uppercase hover:underline block truncate">
                                {r.story.title}
                              </Link>
                              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide block mt-0.5">
                                Author: @{r.story.author.username} ({r.story.published ? "Live" : "Taken Down"})
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Content Purged
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        {r.reporter ? `@${r.reporter.username}` : "unknown"}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                          r.status === "RESOLVED"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : r.status === "DISMISSED"
                            ? "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                            : r.status === "REVIEWED"
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          {r.story && (
                            <Link href={`/stories/${r.story.id}`} target="_blank" title="Inspect Story" className="p-2 text-zinc-300 hover:text-indigo-500 hover:bg-indigo-500/5 transition-all rounded">
                              <FileText className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          <button
                            onClick={() => handleUpdateStatus(r.id, "REVIEWED")}
                            disabled={r.status === "REVIEWED" || r.status === "RESOLVED"}
                            title="Acknowledge Review"
                            className="p-2 text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all rounded disabled:opacity-30"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(r.id, "RESOLVED")}
                            disabled={r.status === "RESOLVED"}
                            title="Takedown Violating Content"
                            className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-500/5 transition-all rounded disabled:opacity-30"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(r.id, "DISMISSED")}
                            disabled={r.status === "DISMISSED" || r.status === "RESOLVED"}
                            title="Dismiss Abuse"
                            className="p-2 text-zinc-300 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all rounded disabled:opacity-30"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            title="Delete Log"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded text-[10px] font-bold uppercase transition-all ${
                  page === p
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'bg-white dark:bg-zinc-950 text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300'
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
