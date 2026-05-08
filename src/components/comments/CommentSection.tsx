"use client";

import { useState, useEffect, useCallback } from "react";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { MessageSquare } from "lucide-react";

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

interface CommentSectionProps {
  storyId?: string;
  bookId?: string;
  currentUserId?: string;
}

export function CommentSection({
  storyId,
  bookId,
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchComments = useCallback(
    async (pageNum: number) => {
      setLoading(true);
      try {
        const endpoint = storyId
          ? `/api/stories/${storyId}/comments?page=${pageNum}&limit=20`
          : `/api/books/${bookId}/comments?page=${pageNum}&limit=20`;

        const res = await fetch(endpoint);
        if (res.ok) {
          const data = await res.json();
          if (pageNum === 1) {
            setComments(data.comments);
          } else {
            setComments((prev) => [...prev, ...data.comments]);
          }
          setTotalPages(data.totalPages);
          setTotal(data.total);
        }
      } catch {
        console.error("Failed to fetch comments");
      } finally {
        setLoading(false);
      }
    },
    [storyId, bookId]
  );

  useEffect(() => {
    fetchComments(1);
  }, [fetchComments]);

  const handleNewComment = (comment: CommentData) => {
    setComments((prev) => [comment, ...prev]);
    setTotal((prev) => prev + 1);
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments((prev) => removeComment(prev, commentId));
    setTotal((prev) => prev - 1);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Comments {total > 0 && <span className="text-zinc-500">({total})</span>}
        </h3>
      </div>

      {/* New Comment Form */}
      <CommentForm
        storyId={storyId}
        bookId={bookId}
        onSubmit={handleNewComment}
      />

      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              storyId={storyId}
              bookId={bookId}
              currentUserId={currentUserId}
              onCommentAdded={handleNewComment}
              onCommentDeleted={handleCommentDeleted}
            />
          ))}

          {page < totalPages && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="w-full rounded-lg border border-zinc-200 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
            >
              {loading ? "Loading..." : "Load more comments"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** Recursively remove a comment by ID from nested structure */
function removeComment(comments: CommentData[], id: string): CommentData[] {
  return comments
    .filter((c) => c.id !== id)
    .map((c) => ({
      ...c,
      replies: c.replies ? removeComment(c.replies, id) : [],
    }));
}
