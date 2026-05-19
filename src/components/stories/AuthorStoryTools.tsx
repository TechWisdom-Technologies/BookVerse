"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Loader2, Megaphone, Users } from "lucide-react";
import toast from "react-hot-toast";

interface BetaReader {
  id: string;
  createdAt: string;
  user?: {
    id: string;
    username: string;
    displayName: string | null;
  };
}

export function AuthorStoryTools({ storyId }: { storyId: string }) {
  const [chapterNumber, setChapterNumber] = useState(1);
  const [releaseDateTime, setReleaseDateTime] = useState("");
  const [promotionTier, setPromotionTier] = useState("FEATURED");
  const [promotionDuration, setPromotionDuration] = useState(7);
  const [betaReaders, setBetaReaders] = useState<BetaReader[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const loadBetaReaders = async () => {
      const res = await fetch(`/api/stories/${storyId}/beta-readers`);
      if (res.ok) {
        const data = await res.json();
        setBetaReaders(data.betaReaders || []);
      }
    };

    loadBetaReaders();
  }, [storyId]);

  async function post(path: string, body: unknown, success: string) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Request failed");
    toast.success(success);
    return data;
  }

  const scheduleChapter = async () => {
    setLoading("schedule");
    try {
      await post(`/api/stories/${storyId}/schedule`, { chapterNumber, releaseDateTime }, "Chapter scheduled");
      setReleaseDateTime("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to schedule");
    } finally {
      setLoading(null);
    }
  };

  const promoteStory = async () => {
    setLoading("promotion");
    try {
      await post("/api/story-promotions", {
        storyId,
        tier: promotionTier,
        duration: promotionDuration,
      }, "Story promotion started");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to promote story");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="mb-12 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-zinc-100 dark:bg-zinc-900">
        <div className="bg-white dark:bg-zinc-950 p-6 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <CalendarClock className="h-4 w-4" />
            Schedule Chapter
          </div>
          <input type="number" min={1} value={chapterNumber} onChange={(e) => setChapterNumber(Number(e.target.value))} className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs" />
          <input type="datetime-local" value={releaseDateTime} onChange={(e) => setReleaseDateTime(e.target.value)} className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs" />
          <button onClick={scheduleChapter} disabled={loading === "schedule"} className="w-full px-3 py-2 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50">
            {loading === "schedule" ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Schedule"}
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-6 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <Users className="h-4 w-4" />
            Beta Readers
          </div>
          <div className="space-y-2 max-h-36 overflow-auto">
            {betaReaders.length === 0 ? (
              <p className="text-xs text-zinc-400 italic">No beta readers yet.</p>
            ) : betaReaders.map((reader) => (
              <p key={reader.id} className="text-xs text-zinc-500">
                {reader.user?.displayName || reader.user?.username || "Reader"}
              </p>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 p-6 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <Megaphone className="h-4 w-4" />
            Promotion
          </div>
          <select value={promotionTier} onChange={(e) => setPromotionTier(e.target.value)} className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs">
            <option value="FEATURED">Featured</option>
            <option value="PROMOTED">Promoted</option>
            <option value="TRENDING">Trending</option>
          </select>
          <input type="number" min={1} value={promotionDuration} onChange={(e) => setPromotionDuration(Number(e.target.value))} className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs" />
          <button onClick={promoteStory} disabled={loading === "promotion"} className="w-full px-3 py-2 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50">
            Promote
          </button>
        </div>
      </div>
    </section>
  );
}
