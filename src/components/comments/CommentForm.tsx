"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface CommentAuthor {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

interface CommentData {
  id: string;
  content: string;
  createdAt: string;
  author: CommentAuthor;
  replies?: CommentData[];
}

interface CommentFormProps {
  storyId?: string;
  bookId?: string;
  parentId?: string;
  onSubmit: (comment: CommentData) => void;
  onCancel?: () => void;
  compact?: boolean;
}

export function CommentForm({
  storyId,
  bookId,
  parentId,
  onSubmit,
  onCancel,
  compact,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const endpoint = storyId
        ? `/api/stories/${storyId}/comments`
        : `/api/books/${bookId}/comments`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          parentId: parentId || null,
        }),
      });

      if (res.status === 401) {
        setError("Please sign in to comment.");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to post comment");
        return;
      }

      const data = await res.json();
      onSubmit(data.comment);
      setContent("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "Write a reply..." : "Share your thoughts..."}
        rows={compact ? 2 : 3}
        className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-indigo-500"
      />

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-3 w-3" />
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
