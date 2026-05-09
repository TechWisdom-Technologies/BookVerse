"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { ReviewForm } from "./ReviewForm";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
}

interface BookReviewsProps {
  bookId: string;
  reviews: Review[];
  currentUserId?: string | null;
  onReviewSubmitted?: () => void;
}

export function BookReviews({
  bookId,
  reviews,
  currentUserId,
  onReviewSubmitted,
}: BookReviewsProps) {
  const userReview = reviews.find((r) => r.user.id === currentUserId);

  return (
    <div className="space-y-16">
      <div className="flex items-center justify-between pb-6 border-b border-zinc-50 dark:border-zinc-900">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">Reader Reviews</h3>
      </div>

      {/* Review Form */}
      <ReviewForm
        bookId={bookId}
        onReviewSubmitted={onReviewSubmitted}
        existingRating={userReview?.rating}
        existingComment={userReview?.comment}
      />

      {/* Reviews List */}
      <div className="space-y-10">
        {reviews.length === 0 ? (
          <div className="py-32 border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">No reviews found. Be the first to share your thoughts.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 shadow-sm">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="group flex flex-col p-10 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all"
              >
                <div className="flex items-start justify-between mb-8">
                  {/* Reviewer Info */}
                  <div className="flex items-center gap-5">
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all duration-700">
                      {review.user.avatarUrl ? (
                        <Image
                          src={review.user.avatarUrl}
                          alt={review.user.username}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-zinc-400 uppercase">
                          {(review.user.displayName || review.user.username)[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase tracking-widest">
                        {review.user.displayName || review.user.username}
                      </p>
                      <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest italic">
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.rating
                            ? "text-zinc-900 dark:text-white fill-current"
                            : "text-zinc-100 dark:text-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                {review.comment && (
                  <p className="text-zinc-500 dark:text-zinc-400 text-[11px] font-medium leading-relaxed italic border-l-2 border-zinc-100 dark:border-zinc-900 pl-6 py-1">
                    &quot;{review.comment}&quot;
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
