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
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Comments
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Manage user comments
      </p>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          </div>
        ) : comments.length === 0 ? (
          <div className="py-12 text-center text-zinc-500">No comments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Comment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">On</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {comments.map((comment) => (
                  <tr key={comment.id}>
                    <td className="px-4 py-3 max-w-md">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        {truncateContent(comment.content)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        @{comment.author.username}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {comment.story && (
                        <Link
                          href={`/stories/${comment.story.id}`}
                          className="flex items-center gap-1 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          <FileText className="h-3 w-3" />
                          {comment.story.title}
                        </Link>
                      )}
                      {comment.book && (
                        <Link
                          href={`/library/${comment.book.id}`}
                          className="flex items-center gap-1 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          <BookOpen className="h-3 w-3" />
                          {comment.book.title}
                        </Link>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                      {formatDate(comment.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(comment.id)}
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

