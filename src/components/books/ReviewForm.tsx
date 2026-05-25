"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { getFriendlyErrorMessage } from "@/lib/friendly-errors";
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
      <div className="border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10 p-10 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">Sign in to leave a review.</p>
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
      toast.error(getFriendlyErrorMessage(err, "Failed to post review. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 p-10 shadow-sm">
      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-4 block italic">Your Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRating(r)}
              className="group p-1.5 transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                className={`h-6 w-6 transition-colors duration-300 ${
                  r <= rating
                    ? "fill-zinc-900 text-zinc-900 dark:fill-white dark:text-white"
                    : "text-zinc-100 dark:text-zinc-800 group-hover:text-zinc-300 dark:group-hover:text-zinc-600"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-4 block italic">Your Thoughts</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think of this book?"
          className="block w-full border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-4 text-xs font-bold text-zinc-900 dark:text-white placeholder-zinc-300 transition-all focus:border-zinc-900 dark:focus:border-white focus:outline-none rounded resize-none shadow-sm"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-12 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all hover:opacity-90 disabled:opacity-40 border border-zinc-900 dark:border-white shadow-md"
      >
        {submitting ? "Posting..." : existingRating ? "Update Review" : "Post Review"}
      </button>
    </form>
  );
}
