"use client";

import { useState } from "react";
import { Eye, Loader2, Share2 } from "lucide-react";
import toast from "react-hot-toast";

interface StorySharingActionsProps {
  storyId: string;
  authorId: string;
  currentUserId?: string | null;
}

export function StorySharingActions({ storyId, authorId, currentUserId }: StorySharingActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const isAuthor = currentUserId === authorId;

  async function logShareActivity(platform: string) {
    try {
      await fetch(`/api/stories/${storyId}/share-card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
    } catch (err) {
      console.error("Failed to log share activity:", err);
    }
  }

  const joinBetaReaders = async () => {
    if (!currentUserId) return toast.error("Please sign in first");
    setLoading("beta");
    try {
      const res = await fetch(`/api/stories/${storyId}/beta-readers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");
      toast.success("You joined the beta reader list");
    } catch (error: any) {
      toast.error(error.message || "Failed to join beta readers.");
    } finally {
      setLoading(null);
    }
  };

  const shareStory = (platform: string) => {
    const storyUrl = `${window.location.origin}/stories/${storyId}`;
    const shareText = `Check out this story on BookVerse!`;
    const encodedUrl = encodeURIComponent(storyUrl);
    const encodedText = encodeURIComponent(shareText);

    // Call window.open synchronously to prevent pop-up blockers from interrupting
    if (platform.toLowerCase() === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, "_blank", "width=600,height=400");
    } else if (platform.toLowerCase() === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank", "width=600,height=400");
    } else if (platform.toLowerCase() === "instagram") {
      navigator.clipboard.writeText(storyUrl).then(() => {
        toast.success("Link copied! Opening Instagram...");
        window.open(`https://www.instagram.com/`, "_blank");
      }).catch(() => {
        toast.error("Failed to copy link");
      });
    } else if (platform.toLowerCase() === "tiktok") {
      navigator.clipboard.writeText(storyUrl).then(() => {
        toast.success("Link copied! Opening TikTok...");
        window.open(`https://www.tiktok.com/`, "_blank");
      }).catch(() => {
        toast.error("Failed to copy link");
      });
    }

    // Run the logging process in the background
    void logShareActivity(platform);
  };

  return (
    <section className="my-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-50 dark:border-zinc-900">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <Share2 className="h-3.5 w-3.5" />
          Share Story & Support
        </div>
        <span className="text-[9px] font-mono font-bold text-zinc-300 uppercase tracking-widest">Viral Amplification</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Spread the Word</p>
          <div className="flex flex-wrap gap-2">
            {["Twitter", "Facebook", "Instagram", "TikTok"].map((platform) => (
              <button
                key={platform}
                onClick={() => shareStory(platform)}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded border border-zinc-100 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white transition-all shadow-sm bg-zinc-50/50 dark:bg-zinc-900/30"
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {!isAuthor && (
          <button
            onClick={joinBetaReaders}
            disabled={loading === "beta"}
            className="flex items-center justify-center gap-2 px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 disabled:opacity-50 shadow transition-all self-end md:self-auto shrink-0"
          >
            {loading === "beta" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
            Join Beta Readers
          </button>
        )}
      </div>
    </section>
  );
}
