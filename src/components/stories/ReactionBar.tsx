"use client";

import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import type { ReactionType } from "@prisma/client";
import { cn } from "@/lib/utils";

const reactions: { type: ReactionType; emoji: string; label: string }[] = [
  { type: "LIKE", emoji: "👍", label: "Like" },
  { type: "LOVE", emoji: "❤️", label: "Love" },
  { type: "FIRE", emoji: "🔥", label: "Fire" },
  { type: "CRY", emoji: "😢", label: "Cry" },
  { type: "WOW", emoji: "😮", label: "Wow" },
];

interface ReactionBarProps {
  storyId: string;
  initialReactions: Record<ReactionType, number>;
  initialUserReaction: ReactionType | null;
}

export function ReactionBar({
  storyId,
  initialReactions,
  initialUserReaction,
}: ReactionBarProps) {
  const [counts, setCounts] = useState(initialReactions);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(
    initialUserReaction
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleReaction = useCallback(
    async (type: ReactionType) => {
      if (isSubmitting) return;

      const previousCounts = { ...counts };
      const previousReaction = userReaction;
      setIsSubmitting(true);

      if (userReaction === type) {
        setUserReaction(null);
        setCounts((current) => ({
          ...current,
          [type]: Math.max(0, current[type] - 1),
        }));
      } else {
        setUserReaction(type);
        setCounts((current) => ({
          ...current,
          ...(userReaction
            ? { [userReaction]: Math.max(0, current[userReaction] - 1) }
            : {}),
          [type]: current[type] + 1,
        }));
      }

      try {
        const response = await fetch(`/api/stories/${storyId}/reactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reactionType: type }),
        });

        if (response.status === 401) {
          toast.error("Sign in to react to stories.");
          setCounts(previousCounts);
          setUserReaction(previousReaction);
          return;
        }

        if (!response.ok) {
          throw new Error("Reaction failed");
        }
      } catch {
        toast.error("Could not update reaction.");
        setCounts(previousCounts);
        setUserReaction(previousReaction);
      } finally {
        setIsSubmitting(false);
      }
    },
    [counts, isSubmitting, storyId, userReaction]
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {reactions.map(({ type, emoji, label }) => {
        const isActive = userReaction === type;
        const count = counts[type];

        return (
          <button
            key={type}
            type="button"
            onClick={() => toggleReaction(type)}
            disabled={isSubmitting}
            title={label}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all",
              "hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70",
              isActive
                ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            )}
          >
            <span className="text-base leading-none">{emoji}</span>
            {count > 0 && <span className="font-medium tabular-nums">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
