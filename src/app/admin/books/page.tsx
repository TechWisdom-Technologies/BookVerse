"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Search, Trash2, BookOpen, Plus, ArrowLeft, ShieldCheck, CheckSquare, Square, XCircle, Pencil, X, Save, Eye, Star, Sparkles } from "lucide-react";

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
  isNewArrival: boolean;
  isFeatured: boolean;
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
  const [editForm, setEditForm] = useState({ title: "", authorName: "", genre: "", description: "", language: "", isNewArrival: false, isFeatured: false });
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
      language: book.language || "English",
      isNewArrival: book.isNewArrival,
      isFeatured: book.isFeatured,
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
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-brand dark:hover:text-brand transition-colors w-fit">
              <ArrowLeft className="w-4 h-4" />
              Return to Hub
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Books Management</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
                Global management and moderation of archival book records. Edit metadata, monitor downloads, or purge invalid volumes.
              </p>
            </div>
          </div>
          <Link href="/upload" className="px-5 py-2.5 bg-brand hover:opacity-90 text-white text-sm font-semibold rounded-md shadow-sm transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Upload Book
          </Link>
        </header>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search registry by title or author..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm font-medium text-zinc-900 dark:text-white outline-none focus:border-brand/30 dark:focus:border-brand/30 transition-colors shadow-sm"
              onKeyDown={(e) => e.key === "Enter" && setPage(1)}
            />
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.size > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 bg-white dark:bg-zinc-900 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md border border-zinc-200 dark:border-zinc-800 transition-colors disabled:opacity-50 shadow-sm"
              >
                {bulkDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Selected ({selectedIds.size})
              </button>
            )}
            {selectedIds.size > 0 && (
              <button
                onClick={() => setSelectedIds(new Set())}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 transition-colors shadow-sm"
              >
                <XCircle className="w-4 h-4" />
                Clear
              </button>
            )}
            <div className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-500 bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-brand" />
              Audit Mode
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
                <p className="text-sm font-medium text-zinc-500">Loading records...</p>
              </div>
            </div>
          ) : books.length === 0 ? (
            <div className="py-32 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-md flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-500">No books found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                    <th className="py-3 px-4 w-12">
                      <button onClick={toggleSelectAll} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        {allSelected ? <CheckSquare className="w-4 h-4 text-brand" /> : <Square className="w-4 h-4" />}
                      </button>
                    </th>
                    <th className="py-3 px-4 font-semibold text-zinc-600 dark:text-zinc-400">Book</th>
                    <th className="py-3 px-4 font-semibold text-zinc-600 dark:text-zinc-400">Genre</th>
                    <th className="py-3 px-4 font-semibold text-zinc-600 dark:text-zinc-400">Flags</th>
                    <th className="py-3 px-4 font-semibold text-zinc-600 dark:text-zinc-400">Uploader</th>
                    <th className="py-3 px-4 font-semibold text-zinc-600 dark:text-zinc-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {books.map((book) => (
                    <tr key={book.id} className={`group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors ${selectedIds.has(book.id) ? "bg-brand/5 dark:bg-brand/10" : ""}`}>
                      <td className="py-3 px-4">
                        <button onClick={() => toggleSelect(book.id)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                          {selectedIds.has(book.id) ? <CheckSquare className="w-4 h-4 text-brand" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-8 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700">
                            {book.coverUrl ? (
                              <img src={book.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-3 h-3 text-zinc-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link href={`/admin/books/${book.id}`} className="font-semibold text-zinc-900 dark:text-white hover:text-brand dark:hover:text-brand transition-colors truncate block">
                              {book.title}
                            </Link>
                            <p className="text-xs text-zinc-500 truncate mt-0.5">{book.authorName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-zinc-600 dark:text-zinc-300">
                        {book.genre}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {book.isNewArrival && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800/50">
                              <Sparkles className="w-3 h-3" />
                              New
                            </span>
                          )}
                          {book.isFeatured && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800/50">
                              <Star className="w-3 h-3" />
                              Featured
                            </span>
                          )}
                          {!book.isNewArrival && !book.isFeatured && <span className="text-xs text-zinc-400">—</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                        @{book.uploadedBy.username}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/admin/books/${book.id}`}
                            className="p-1.5 text-zinc-500 hover:text-brand hover:bg-brand/10 dark:hover:text-brand dark:hover:bg-brand/10 rounded-md transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEditModal(book)}
                            className="p-1.5 text-zinc-500 hover:text-brand hover:bg-brand/10 dark:hover:text-brand dark:hover:bg-brand/10 rounded-md transition-colors"
                            title="Quick Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-900/20 rounded-md transition-colors"
                            title="Delete"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-5">
            <p className="text-sm text-zinc-500">
              Page <span className="font-semibold text-zinc-900 dark:text-white">{page}</span> of <span className="font-semibold text-zinc-900 dark:text-white">{totalPages}</span>
            </p>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 shadow-sm"
              >
                Previous
              </button>
              
              <div className="hidden sm:flex gap-1.5 mx-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .map((p, i, arr) => (
                    <div key={p} className="flex gap-1.5">
                      {i > 0 && arr[i - 1] !== p - 1 && (
                        <span className="w-8 h-8 flex items-center justify-center text-zinc-400 text-sm">...</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-semibold transition-colors ${
                          page === p
                            ? "bg-brand text-white shadow-sm"
                            : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm"
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-md text-sm font-semibold transition-colors disabled:opacity-50 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Book Modal */}
      {editingBook && (
        <>
          <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-sm transition-opacity" onClick={() => setEditingBook(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg z-50 bg-white dark:bg-zinc-900 rounded-md shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Quick Edit Book</h2>
              </div>
              <button onClick={() => setEditingBook(null)} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto max-h-[60vh] text-sm">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-white focus:outline-none focus:border-brand/30 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Author Name</label>
                <input
                  type="text"
                  value={editForm.authorName}
                  onChange={(e) => setEditForm({ ...editForm, authorName: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-white focus:outline-none focus:border-brand/30 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Genre</label>
                  <input
                    type="text"
                    value={editForm.genre}
                    onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-white focus:outline-none focus:border-brand/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Language</label>
                  <input
                    type="text"
                    value={editForm.language}
                    onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-white focus:outline-none focus:border-brand/30 transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-md bg-zinc-50 dark:bg-zinc-800/30">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={editForm.isNewArrival}
                    onChange={(e) => setEditForm({...editForm, isNewArrival: e.target.checked})}
                    className="w-4 h-4 text-brand rounded border-zinc-300 focus:ring-indigo-600"
                  />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={editForm.isFeatured}
                    onChange={(e) => setEditForm({...editForm, isFeatured: e.target.checked})}
                    className="w-4 h-4 text-brand rounded border-zinc-300 focus:ring-indigo-600"
                  />
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Featured Book</span>
                </label>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-white focus:outline-none focus:border-brand/30 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-900">
              <button
                onClick={() => setEditingBook(null)}
                className="px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-brand hover:opacity-90 text-white text-sm font-semibold rounded-md transition-colors disabled:opacity-50"
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
