"use client";

import { useState } from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { useAuth, useSignInModal } from "@/app/providers";

interface FollowButtonProps {
  targetUserId: string;
  isFollowing: boolean;
}

export function FollowButton({ targetUserId, isFollowing: initialIsFollowing }: FollowButtonProps) {
  const { user } = useAuth();
  const { requireSignIn } = useSignInModal();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFollow = async () => {
    if (!user) {
      requireSignIn("Sign in to follow authors and fellow readers.");
      return;
    }

    setIsLoading(true);
    try {
      if (isFollowing) {
        const res = await fetch(`/api/follow?followingId=${targetUserId}`, {
          method: "DELETE",
        });
        if (res.status === 401) {
          requireSignIn("Sign in to follow authors and fellow readers.");
          return;
        }
        if (res.ok) {
          setIsFollowing(false);
        }
      } else {
        const res = await fetch("/api/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followingId: targetUserId }),
        });
        if (res.status === 401) {
          requireSignIn("Sign in to follow authors and fellow readers.");
          return;
        }
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
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 ${
        isFollowing
          ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
          : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100"
      }`}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck className="h-3.5 w-3.5" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-3.5 w-3.5" />
          Follow
        </>
      )}
    </button>
  );
}
