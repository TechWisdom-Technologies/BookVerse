"use client";

import { useState } from "react";
import { AlertTriangle, Eye, Loader2, Share2, ShieldAlert, Star } from "lucide-react";
import toast from "react-hot-toast";

interface StoryFeatureActionsProps {
  storyId: string;
  authorId: string;
  currentUserId?: string | null;
}

export function StoryFeatureActions({ storyId, authorId, currentUserId }: StoryFeatureActionsProps) {
  const [reportReason, setReportReason] = useState("OTHER");
  const [dmcaOpen, setDmcaOpen] = useState(false);
  const [dmca, setDmca] = useState({
    originalWorkTitle: "",
    originalWorkAuthor: "",
    copyrightHolder: "",
    description: "",
  });
  const [loading, setLoading] = useState<string | null>(null);

  const isAuthor = currentUserId === authorId;

  async function submitJson(path: string, body: unknown, success: string) {
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

  const reportStory = async () => {
    if (!currentUserId) return toast.error("Please sign in first");
    setLoading("report");
    try {
      await submitJson("/api/content-reports", { storyId, reason: reportReason }, "Report submitted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to report");
    } finally {
      setLoading(null);
    }
  };

  const submitDmca = async () => {
    if (!currentUserId) return toast.error("Please sign in first");
    setLoading("dmca");
    try {
      await submitJson("/api/dmca-notices", { storyId, ...dmca }, "DMCA notice submitted");
      setDmca({ originalWorkTitle: "", originalWorkAuthor: "", copyrightHolder: "", description: "" });
      setDmcaOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit DMCA");
    } finally {
      setLoading(null);
    }
  };

  const joinBetaReaders = async () => {
    if (!currentUserId) return toast.error("Please sign in first");
    setLoading("beta");
    try {
      await submitJson(`/api/stories/${storyId}/beta-readers`, {}, "You joined the beta reader list");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to join beta readers");
    } finally {
      setLoading(null);
    }
  };

  const shareStory = async (platform: string) => {
    setLoading(`share-${platform}`);
    try {
      await submitJson(`/api/stories/${storyId}/share-card`, { platform }, "Share activity logged");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to log share");
    } finally {
      setLoading(null);
    }
  };

  const subscribe = async (tier: string) => {
    if (!currentUserId) return toast.error("Please sign in first");
    setLoading(`tier-${tier}`);
    try {
      await submitJson("/api/author-subscriptions", { authorId, tier }, "Subscription activated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to subscribe");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="mt-12 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100 dark:bg-zinc-900">
        <div className="bg-white dark:bg-zinc-950 p-6 space-y-5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <Share2 className="h-3.5 w-3.5" />
            Sharing
          </div>
          <div className="flex flex-wrap gap-2">
            {["Twitter", "Facebook", "Instagram", "TikTok"].map((platform) => (
              <button
                key={platform}
                onClick={() => shareStory(platform)}
                disabled={loading === `share-${platform}`}
                className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest rounded border border-zinc-100 dark:border-zinc-800 hover:border-zinc-400 disabled:opacity-50"
              >
                {platform}
              </button>
            ))}
          </div>

          {!isAuthor && (
            <button
              onClick={joinBetaReaders}
              disabled={loading === "beta"}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-widest rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 disabled:opacity-50"
            >
              {loading === "beta" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
              Join Beta Readers
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-zinc-950 p-6 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Moderation
          </div>
          <div className="flex gap-2">
            <select
              value={reportReason}
              onChange={(event) => setReportReason(event.target.value)}
              className="flex-1 rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs"
            >
              <option value="COPYRIGHTED">Copyrighted</option>
              <option value="EXPLICIT">Explicit</option>
              <option value="HATE_SPEECH">Hate Speech</option>
              <option value="HARASSMENT">Harassment</option>
              <option value="OTHER">Other</option>
            </select>
            <button onClick={reportStory} disabled={loading === "report"} className="px-4 py-2 rounded bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest disabled:opacity-50">
              Report
            </button>
          </div>
          <button onClick={() => setDmcaOpen((value) => !value)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <ShieldAlert className="h-3.5 w-3.5" />
            DMCA Notice
          </button>
          {dmcaOpen && (
            <div className="space-y-2">
              <input value={dmca.originalWorkTitle} onChange={(e) => setDmca({ ...dmca, originalWorkTitle: e.target.value })} placeholder="Original work title" className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs" />
              <input value={dmca.originalWorkAuthor} onChange={(e) => setDmca({ ...dmca, originalWorkAuthor: e.target.value })} placeholder="Original author" className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs" />
              <input value={dmca.copyrightHolder} onChange={(e) => setDmca({ ...dmca, copyrightHolder: e.target.value })} placeholder="Copyright holder" className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs" />
              <textarea value={dmca.description} onChange={(e) => setDmca({ ...dmca, description: e.target.value })} placeholder="Claim details" className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs" rows={3} />
              <button onClick={submitDmca} disabled={loading === "dmca"} className="w-full px-4 py-2 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50">
                Submit Notice
              </button>
            </div>
          )}
        </div>

        {!isAuthor && (
          <div className="bg-white dark:bg-zinc-950 p-6 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <Star className="h-3.5 w-3.5" />
              Author Subscription
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: "BASIC", price: 2.99 },
                { name: "PREMIUM", price: 4.99 },
                { name: "VIP", price: 9.99 },
              ].map((tier) => (
                <div key={tier.name} className="border border-zinc-100 dark:border-zinc-800 rounded p-4 space-y-3">
                  <div>
                    <h3 className="text-sm font-bold">{tier.name}</h3>
                    <p className="text-xs text-zinc-500">${tier.price.toFixed(2)}/mo</p>
                  </div>
                  <button onClick={() => subscribe(tier.name)} disabled={loading === `tier-${tier.name}`} className="w-full px-3 py-2 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50">
                    Subscribe
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
