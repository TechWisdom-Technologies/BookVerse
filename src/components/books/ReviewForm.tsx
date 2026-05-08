"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import toast from "react-hot-toast";

interface ReviewFormProps {
  bookId: string;
  onReviewSubmitted?: () => void;
  existingRating?: number | null;
  existingComment?: string | null;
}

export function ReviewForm({
  bookId,
  onReviewSubmitted,
  existingRating,
  existingComment,
}: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingRating || 0);
  const [comment, setComment] = useState(existingComment || "");
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Sign in to leave a review</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/books/${bookId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating, comment: comment || null }),
      });

      if (!res.ok) throw new Error("Failed to submit review");
      toast.success(existingRating ? "Review updated" : "Review posted!");
      onReviewSubmitted?.();
      setComment("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error posting review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div>
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Your Rating</label>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRating(r)}
              className="transition"
            >
              <Star
                className={`h-6 w-6 ${
                  r <= rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-zinc-300 dark:text-zinc-700"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts (optional)"
          className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        {submitting ? "Posting..." : existingRating ? "Update Review" : "Post Review"}
      </button>
    </form>
  );
}
