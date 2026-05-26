"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Search, Trash2, BookOpen, Plus, ArrowLeft, ShieldCheck, CheckSquare, Square, XCircle } from "lucide-react";

interface Book {
  id: string;
  title: string;
  authorName: string;
  genre: string;
  coverUrl: string | null;
  downloadCount: number;
  createdAt: string;
  uploadedBy: {
    username: string;
    displayName: string | null;
  };
  _count: { reviews: number };
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => { fetchBooks(); }, [page, search]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/books?page=${page}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books);
        setTotalPages(data.totalPages);
      }
    } finally {
      setLoading(false);
      setSelectedIds(new Set());
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm("Execute volume purge? This archival record and its files will be permanently deleted from storage.")) return;
    try {
      const res = await fetch("/api/admin/books", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      if (res.ok) { setBooks(books.filter((b) => b.id !== bookId)); setSelectedIds(prev => { const n = new Set(prev); n.delete(bookId); return n; }); }
    } catch (error) { console.error("Failed to delete book:", error); }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Permanently delete ${selectedIds.size} selected book(s) and their files from storage? This cannot be undone.`)) return;
    setBulkDeleting(true);
    try {
      const res = await fetch("/api/admin/books", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookIds: Array.from(selectedIds) }),
      });
      if (res.ok) {
        setBooks(books.filter((b) => !selectedIds.has(b.id)));
        setSelectedIds(new Set());
      }
    } catch (error) {
      console.error("Failed to bulk delete books:", error);
    } finally {
      setBulkDeleting(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === books.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(books.map(b => b.id)));
    }
  };

  const allSelected = books.length > 0 && selectedIds.size === books.length;

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
              <h1 className="text-xl font-bold tracking-tight mb-1">Volume Audit Registry.</h1>
              <p className="text-xs text-zinc-500 font-medium">Global management and moderation of archival book records.</p>
            </div>
          </div>
          <Link href="/upload" className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" />
            Initialize Volume
          </Link>
        </header>

        {/* Surgical Search & Context */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="relative w-full md:w-96">
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
          <div className="flex items-center gap-3">
            {selectedIds.size > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="flex items-center gap-2 px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest text-rose-600 bg-rose-500/5 hover:bg-rose-500/10 rounded border border-rose-200 dark:border-rose-900/50 transition-all disabled:opacity-50"
              >
                {bulkDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                Delete {selectedIds.size} selected
              </button>
            )}
            {selectedIds.size > 0 && (
              <button
                onClick={() => setSelectedIds(new Set())}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
              >
                <XCircle className="w-3 h-3" />
                Clear
              </button>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 font-mono">
              <ShieldCheck className="w-3 h-3 text-zinc-300" />
              Audit Mode Active
            </div>
          </div>
        </div>

        {/* Volume Registry Table */}
        <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-40">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-300" />
            </div>
          ) : books.length === 0 ? (
            <div className="py-40 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No archival records detected in registry.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900">
                    <th className="py-4 px-4 w-10">
                      <button onClick={toggleSelectAll} className="text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      </button>
                    </th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Volume Record</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Classification</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Archivist</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Downloads</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {books.map((book) => (
                    <tr key={book.id} className={`group transition-colors ${selectedIds.has(book.id) ? "bg-zinc-50 dark:bg-zinc-900/80" : "hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"}`}>
                      <td className="py-4 px-4">
                        <button onClick={() => toggleSelect(book.id)} className="text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                          {selectedIds.has(book.id) ? <CheckSquare className="w-4 h-4 text-zinc-900 dark:text-white" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-9 overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shrink-0">
                            {book.coverUrl ? (
                              <img src={book.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover transition-all duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center opacity-10">
                                <BookOpen className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <Link href={`/library/${book.id}`} className="text-xs font-bold text-zinc-900 dark:text-white hover:underline uppercase transition-colors">
                              {book.title}
                            </Link>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{book.authorName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 rounded border border-zinc-100 dark:border-zinc-800">
                          {book.genre}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        @{book.uploadedBy.username}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[10px] font-mono font-bold text-zinc-900 dark:text-white">
                          {book.downloadCount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-500/5 transition-all rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
