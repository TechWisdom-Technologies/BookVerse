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
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Community Reviews</h3>
      </div>

      {/* Review Form */}
      <ReviewForm
        bookId={bookId}
        onReviewSubmitted={onReviewSubmitted}
        existingRating={userReview?.rating}
        existingComment={userReview?.comment}
      />

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium">Be the first to review this book.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="group rounded-[2rem] border border-zinc-200/50 bg-white p-8 transition-all duration-300 hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
              >
                <div className="flex items-start justify-between mb-6">
                  {/* Reviewer Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white dark:border-zinc-900 shadow-md">
                      {review.user.avatarUrl ? (
                        <Image
                          src={review.user.avatarUrl}
                          alt={review.user.username}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 text-lg font-bold text-white">
                          {(review.user.displayName || review.user.username)[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">
                        {review.user.displayName || review.user.username}
                      </p>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-full">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-amber-200 dark:text-amber-900/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                {review.comment && (
                  <p className="text-zinc-700 dark:text-zinc-300 text-lg leading-relaxed whitespace-pre-wrap">
                    {review.comment}
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
