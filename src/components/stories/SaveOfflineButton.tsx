"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, Check, Loader2, Trash2, WifiOff } from "lucide-react";
import toast from "react-hot-toast";
import {
  saveStoryOffline,
  removeOfflineStory,
  isStorySaved,
  getTimeRemaining,
  type SaveStoryInput,
} from "@/lib/offlineStoryDb";

interface ChapterData {
  id: string;
  title: string;
  chapterOrder: number;
  content: unknown;
}

interface SaveOfflineButtonProps {
  storyId: string;
  storyTitle: string;
  storySummary: string | null;
  storyCoverUrl: string | null;
  authorName: string;
  authorUsername: string;
  authorAvatarUrl: string | null;
  chapters: ChapterData[];
}

function estimateReadingTime(content: unknown): number {
  if (!content) return 1;

  function countWords(node: unknown): number {
    if (!node || typeof node !== "object") return 0;
    const n = node as Record<string, unknown>;
    let count = 0;
    if (n.type === "text" && typeof n.text === "string") {
      count += n.text.trim().split(/\s+/).filter(Boolean).length;
    }
    if (n.content && Array.isArray(n.content)) {
      for (const child of n.content) {
        count += countWords(child);
      }
    }
    return count;
  }

  const words = countWords(content);
  return Math.max(1, Math.ceil(words / 200));
}

export function SaveOfflineButton({
  storyId,
  storyTitle,
  storySummary,
  storyCoverUrl,
  authorName,
  authorUsername,
  authorAvatarUrl,
  chapters,
}: SaveOfflineButtonProps) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const checkSavedStatus = useCallback(async () => {
    try {
      const isSaved = await isStorySaved(storyId);
      setSaved(isSaved);
      if (isSaved) {
        // We need to get the expiresAt from the story data
        const { getOfflineStory } = await import("@/lib/offlineStoryDb");
        const result = await getOfflineStory(storyId);
        if (result) {
          setExpiresAt(result.story.expiresAt);
        }
      }
    } catch {
      // IndexedDB not available
    }
  }, [storyId]);

  useEffect(() => {
    setMounted(true);
    checkSavedStatus();
  }, [checkSavedStatus]);

  if (!mounted) return null;

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const input: SaveStoryInput = {
        id: storyId,
        title: storyTitle,
        summary: storySummary,
        coverUrl: storyCoverUrl,
        authorName,
        authorUsername,
        authorAvatarUrl,
        chapters: chapters.map((ch) => ({
          id: ch.id,
          title: ch.title,
          chapterOrder: ch.chapterOrder,
          htmlContent: null, // HTML will be rendered on the offline page
          rawContent: ch.content,
          readingTimeMin: estimateReadingTime(ch.content),
        })),
      };

      await saveStoryOffline(input);
      setSaved(true);

      // Refresh expiration
      const { getOfflineStory } = await import("@/lib/offlineStoryDb");
      const result = await getOfflineStory(storyId);
      if (result) setExpiresAt(result.story.expiresAt);

      toast.success("Story saved for offline reading (7 days)");
    } catch (err) {
      console.error("Failed to save story offline:", err);
      toast.error("Failed to save story offline");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (removing) return;
    setRemoving(true);

    try {
      await removeOfflineStory(storyId);
      setSaved(false);
      setExpiresAt(null);
      toast.success("Removed from offline stories");
    } catch (err) {
      console.error("Failed to remove offline story:", err);
      toast.error("Failed to remove offline story");
    } finally {
      setRemoving(false);
    }
  };

  if (saved) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded transition-all">
          <WifiOff className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Saved Offline
          </span>
          {expiresAt && (
            <span className="text-[9px] font-mono font-bold text-emerald-500/70 dark:text-emerald-500/60">
              · {getTimeRemaining(expiresAt)}
            </span>
          )}
        </div>
        <button
          onClick={handleRemove}
          disabled={removing}
          className="flex items-center gap-1.5 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-300 dark:hover:border-rose-800 text-zinc-400 hover:text-rose-500 transition-all group"
          title="Remove from offline"
        >
          {removing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSave}
      disabled={saving || chapters.length === 0}
      className="flex items-center gap-2 px-5 py-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
    >
      {saving ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Saving…
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
          Save Offline
        </>
      )}
    </button>
  );
}
