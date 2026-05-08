"use client";

import { useState } from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";

interface FollowButtonProps {
  targetUserId: string;
  isFollowing: boolean;
}

export function FollowButton({ targetUserId, isFollowing: initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFollow = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        const res = await fetch(`/api/follow?followingId=${targetUserId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setIsFollowing(false);
        }
      } else {
        const res = await fetch("/api/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followingId: targetUserId }),
        });
        if (res.ok) {
          setIsFollowing(true);
        }
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFollow}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        isFollowing
          ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
      } disabled:opacity-50`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck className="h-4 w-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow
        </>
      )}
    </button>
  );
}
