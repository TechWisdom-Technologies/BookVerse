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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Reviews</h3>
      </div>

      {/* Review Form */}
      <ReviewForm
        bookId={bookId}
        onReviewSubmitted={onReviewSubmitted}
        existingRating={userReview?.rating}
        existingComment={userReview?.comment}
      />

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No reviews yet</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="space-y-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              {/* Reviewer Info */}
              <div className="flex items-center gap-3">
                {review.user.avatarUrl ? (
                  <Image
                    src={review.user.avatarUrl}
                    alt={review.user.username}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                )}
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {review.user.displayName || review.user.username}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-300 dark:text-zinc-700"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              {review.comment && (
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
