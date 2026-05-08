"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Search, Trash2, BookOpen } from "lucide-react";

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

  useEffect(() => {
    fetchBooks();
  }, [page, search]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/books?page=${page}&search=${encodeURIComponent(search)}`
      );
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book? This cannot be undone.")) return;

    try {
      const res = await fetch("/api/admin/books", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      if (res.ok) {
        setBooks(books.filter((b) => b.id !== bookId));
      }
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Books
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Manage uploaded books
      </p>

      <div className="mt-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books..."
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
        ) : books.length === 0 ? (
          <div className="py-12 text-center text-zinc-500">No books found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Book</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Genre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Uploader</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Downloads</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {books.map((book) => (
                  <tr key={book.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {book.coverUrl ? (
                          <Image
                            src={book.coverUrl}
                            alt=""
                            width={40}
                            height={56}
                            className="rounded"
                          />
                        ) : (
                          <div className="flex h-14 w-10 items-center justify-center rounded bg-zinc-200 dark:bg-zinc-700">
                            <BookOpen className="h-4 w-4 text-zinc-500" />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/library/${book.id}`}
                            className="font-medium text-zinc-900 hover:text-indigo-600 dark:text-zinc-50 dark:hover:text-indigo-400"
                          >
                            {book.title}
                          </Link>
                          <p className="text-xs text-zinc-500">{book.authorName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {book.genre}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                      @{book.uploadedBy.username}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                      {book.downloadCount}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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

