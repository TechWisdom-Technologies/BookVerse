"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Reply, Trash2 } from "lucide-react";
import { CommentForm } from "./CommentForm";

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

interface CommentItemProps {
  comment: CommentData;
  storyId?: string;
  bookId?: string;
  currentUserId?: string;
  depth?: number;
  onCommentAdded: (comment: CommentData) => void;
  onCommentDeleted: (commentId: string) => void;
}

export function CommentItem({
  comment,
  storyId,
  bookId,
  currentUserId,
  depth = 0,
  onCommentAdded,
  onCommentDeleted,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const maxDepth = 3;

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onCommentDeleted(comment.id);
      }
    } catch {
      console.error("Failed to delete comment");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReplyAdded = (newReply: CommentData) => {
    onCommentAdded(newReply);
    setShowReplyForm(false);
  };

  return (
    <div className="group">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.author.avatarUrl ? (
            <Image
              src={comment.author.avatarUrl}
              alt={comment.author.displayName || comment.author.username}
              width={depth === 0 ? 36 : 28}
              height={depth === 0 ? 36 : 28}
              className="rounded-full"
            />
          ) : (
            <div
              className="rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold"
              style={{
                width: depth === 0 ? 36 : 28,
                height: depth === 0 ? 36 : 28,
                fontSize: depth === 0 ? 14 : 11,
              }}
            >
              {(comment.author.displayName || comment.author.username)[0]?.toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {comment.author.displayName || comment.author.username}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
            {comment.content}
          </p>

          {/* Actions */}
          <div className="mt-1.5 flex items-center gap-3">
            {depth < maxDepth && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors"
              >
                <Reply className="h-3 w-3" />
                Reply
              </button>
            )}
            {currentUserId === comment.author.id && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                storyId={storyId}
                bookId={bookId}
                parentId={comment.id}
                onSubmit={handleReplyAdded}
                onCancel={() => setShowReplyForm(false)}
                compact
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ml-6 space-y-3 border-l-2 border-zinc-100 pl-4 dark:border-zinc-800">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              storyId={storyId}
              bookId={bookId}
              currentUserId={currentUserId}
              depth={depth + 1}
              onCommentAdded={onCommentAdded}
              onCommentDeleted={onCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
