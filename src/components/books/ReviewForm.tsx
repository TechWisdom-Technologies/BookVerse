"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
      router.refresh();
      onReviewSubmitted?.();
      setComment("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error posting review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-zinc-200/50 bg-white/50 p-8 shadow-xl shadow-zinc-200/20 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/30 dark:shadow-none">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 block">Your Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRating(r)}
              className="group p-2 -ml-2 transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                className={`h-8 w-8 transition-colors duration-300 ${
                  r <= rating
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                    : "text-zinc-300 dark:text-zinc-700 group-hover:text-amber-200 dark:group-hover:text-amber-900"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="group">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 ml-2 block group-focus-within:text-brand transition-colors">Your Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think of this book?"
          className="block w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 px-6 py-4 text-lg font-medium text-zinc-900 placeholder-zinc-400 transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900 resize-none"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand px-10 py-4 text-base font-bold text-white transition-all hover:bg-orange-600 hover:shadow-xl hover:shadow-brand/20 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {submitting ? "Posting..." : existingRating ? "Update Review" : "Post Review"}
      </button>
    </form>
  );
}
