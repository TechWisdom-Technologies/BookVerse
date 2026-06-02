"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Search, Trash2, BookOpen, Plus, ArrowLeft, ShieldCheck, CheckSquare, Square, XCircle, Pencil, X, Save } from "lucide-react";

interface Book {
  id: string;
  title: string;
  authorName: string;
  genre: string;
  description: string | null;
  language: string;
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

  // Edit State
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editForm, setEditForm] = useState({ title: "", authorName: "", genre: "", description: "", language: "" });
  const [isSaving, setIsSaving] = useState(false);

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

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setEditForm({
      title: book.title,
      authorName: book.authorName,
      genre: book.genre,
      description: book.description || "",
      language: book.language || "English"
    });
  };

  const handleSaveEdit = async () => {
    if (!editingBook) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/books", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingBook.id, ...editForm }),
      });
      if (res.ok) {
        const { book } = await res.json();
        setBooks(books.map(b => b.id === book.id ? { ...b, ...book } : b));
        setEditingBook(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save book.");
      }
    } catch (error) {
      console.error("Failed to update book:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const allSelected = books.length > 0 && selectedIds.size === books.length;

  return (
    <main className="min-h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A] text-zinc-900 dark:text-zinc-100 pb-20">
      {/* Decorative background elements for premium feel */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">

        {/* Minimal Header */}
        <header className="mb-12 pb-8 border-b border-zinc-200/50 dark:border-zinc-800/50 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/admin" className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Hub
            </Link>
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-2 text-zinc-900 dark:text-white">Volume Registry</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-xl">Global management and moderation of archival book records. Edit metadata, monitor downloads, or purge invalid volumes.</p>
            </div>
          </div>
          <Link href="/upload" className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-zinc-900/20 dark:hover:shadow-white/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Initialize Volume
          </Link>
        </header>

        {/* Surgical Search & Context */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search registry by title or author..."
              className="w-full pl-11 pr-4 py-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl text-sm font-medium text-zinc-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
              onKeyDown={(e) => e.key === "Enter" && setPage(1)}
            />
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.size > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl border border-rose-200 dark:border-rose-900/50 transition-all disabled:opacity-50 shadow-sm"
              >
                {bulkDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Selected ({selectedIds.size})
              </button>
            )}
            {selectedIds.size > 0 && (
              <button
                onClick={() => setSelectedIds(new Set())}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
              >
                <XCircle className="w-4 h-4" />
                Clear
              </button>
            )}
            <div className="flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              Audit Mode
            </div>
          </div>
        </div>

        {/* Volume Registry Table */}
        <div className="bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-40">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="text-sm font-medium text-zinc-500">Querying registry...</p>
              </div>
            </div>
          ) : books.length === 0 ? (
            <div className="py-40 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-500">No archival records detected matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <th className="py-4 px-6 w-12">
                      <button onClick={toggleSelectAll} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        {allSelected ? <CheckSquare className="w-5 h-5 text-indigo-500" /> : <Square className="w-5 h-5" />}
                      </button>
                    </th>
                    <th className="py-4 px-6 text-xs font-bold text-zinc-500">Volume Title & Author</th>
                    <th className="py-4 px-6 text-xs font-bold text-zinc-500">Classification</th>
                    <th className="py-4 px-6 text-xs font-bold text-zinc-500">Archivist</th>
                    <th className="py-4 px-6 text-xs font-bold text-zinc-500">Analytics</th>
                    <th className="py-4 px-6 text-xs font-bold text-zinc-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
                  {books.map((book) => (
                    <tr key={book.id} className={`group transition-colors ${selectedIds.has(book.id) ? "bg-indigo-50/50 dark:bg-indigo-500/5" : "hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30"}`}>
                      <td className="py-5 px-6">
                        <button onClick={() => toggleSelect(book.id)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                          {selectedIds.has(book.id) ? <CheckSquare className="w-5 h-5 text-indigo-500" /> : <Square className="w-5 h-5" />}
                        </button>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-10 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800 shrink-0 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50">
                            {book.coverUrl ? (
                              <img src={book.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-zinc-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link href={`/library/${book.id}`} className="text-sm font-bold text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate block">
                              {book.title}
                            </Link>
                            <p className="text-xs font-medium text-zinc-500 truncate mt-0.5">{book.authorName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                          {book.genre}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        @{book.uploadedBy.username}
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-zinc-900 dark:text-white">
                            {book.downloadCount.toLocaleString()} <span className="text-xs font-medium text-zinc-500">DLs</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(book)}
                            className="p-2 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 transition-all rounded-xl"
                            title="Edit Record"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="p-2 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-all rounded-xl"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
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
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${page === p
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md"
                    : "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Edit Book Modal */}
      {editingBook && (
        <>
          <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-md transition-opacity" onClick={() => setEditingBook(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg z-50 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Edit Archival Record</h2>
                <p className="text-xs text-zinc-500 mt-1">Modify metadata for ID: <span className="font-mono">{editingBook.id.slice(0, 8)}...</span></p>
              </div>
              <button onClick={() => setEditingBook(null)} className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Author Name</label>
                <input
                  type="text"
                  value={editForm.authorName}
                  onChange={(e) => setEditForm({ ...editForm, authorName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Genre</label>
                  <input
                    type="text"
                    value={editForm.genre}
                    onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Language</label>
                  <input
                    type="text"
                    value={editForm.language}
                    onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-zinc-200/50 dark:border-zinc-800/50 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-950/50">
              <button
                onClick={() => setEditingBook(null)}
                className="px-5 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
