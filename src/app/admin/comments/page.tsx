"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Trash2, BookOpen, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    username: string;
    displayName: string | null;
  };
  story: { id: string; title: string } | null;
  book: { id: string; title: string } | null;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchComments();
  }, [page]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/comments?page=${page}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch("/api/admin/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      if (res.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const truncateContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-8 sm:pt-12 px-4 sm:px-8">
      <header className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">
          Comments
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
          Manage user comments across the platform
        </p>
      </header>

      <div className="rounded-[2rem] border border-zinc-200/50 bg-white/80 p-4 sm:p-8 shadow-xl shadow-zinc-200/20 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:shadow-none">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-brand" />
          </div>
        ) : comments.length === 0 ? (
          <div className="py-20 text-center text-xl font-bold text-zinc-500">No comments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 px-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Comment</th>
                  <th className="border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 px-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Author</th>
                  <th className="border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 px-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Context</th>
                  <th className="border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 px-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Date</th>
                  <th className="border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 px-4 text-right text-xs font-bold uppercase tracking-wider text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {comments.map((comment) => (
                  <tr key={comment.id} className="group transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                    <td className="px-4 py-4 sm:py-6 max-w-md">
                      <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                        {truncateContent(comment.content, 120)}
                      </p>
                    </td>
                    <td className="px-4 py-4 sm:py-6">
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        @{comment.author.username}
                      </span>
                    </td>
                    <td className="px-4 py-4 sm:py-6">
                      {comment.story && (
                        <Link
                          href={`/stories/${comment.story.id}`}
                          className="flex items-center gap-2 text-sm font-bold text-brand hover:underline"
                        >
                          <FileText className="h-4 w-4" />
                          {comment.story.title}
                        </Link>
                      )}
                      {comment.book && (
                        <Link
                          href={`/library/${comment.book.id}`}
                          className="flex items-center gap-2 text-sm font-bold text-brand hover:underline"
                        >
                          <BookOpen className="h-4 w-4" />
                          {comment.book.title}
                        </Link>
                      )}
                    </td>
                    <td className="px-4 py-4 sm:py-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      {formatDate(comment.createdAt)}
                    </td>
                    <td className="px-4 py-4 sm:py-6 text-right">
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-500 dark:hover:text-white"
                      >
                        <Trash2 className="h-5 w-5" />
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

