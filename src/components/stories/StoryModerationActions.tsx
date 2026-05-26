"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

interface StoryModerationActionsProps {
  storyId: string;
  authorId: string;
  currentUserId?: string | null;
}

export function StoryModerationActions({ storyId, authorId, currentUserId }: StoryModerationActionsProps) {
  const [reportReason, setReportReason] = useState("HATE_SPEECH");
  const [reportDescription, setReportDescription] = useState("");
  const [dmcaOpen, setDmcaOpen] = useState(false);
  const [dmca, setDmca] = useState({
    originalWorkTitle: "",
    originalWorkAuthor: "",
    copyrightHolder: "",
    description: "",
  });
  const [loading, setLoading] = useState<string | null>(null);

  const isAuthor = currentUserId === authorId;

  const reportStory = async () => {
    if (!currentUserId) return toast.error("Please sign in first");
    if (!reportDescription.trim()) return toast.error("Please provide description or details of the violation");
    setLoading("report");
    try {
      const res = await fetch("/api/content-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId, reason: reportReason, description: reportDescription }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to submit report");
      toast.success("Content report submitted successfully");
      setReportDescription("");
    } catch (error: any) {
      toast.error(error.message || "Failed to report content.");
    } finally {
      setLoading(null);
    }
  };

  const submitDmca = async () => {
    if (!currentUserId) return toast.error("Please sign in first");
    setLoading("dmca");
    try {
      const res = await fetch("/api/dmca-notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId, ...dmca }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to submit DMCA notice");
      toast.success("DMCA copyright notice submitted");
      setDmca({ originalWorkTitle: "", originalWorkAuthor: "", copyrightHolder: "", description: "" });
      setDmcaOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit copyright claim.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="my-10 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 p-6 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-50 dark:border-zinc-900">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <AlertTriangle className="h-3.5 w-3.5" />
          Content Moderation & Safety
        </div>
        <span className="text-[9px] font-mono font-bold text-red-500 bg-red-500/5 px-2 py-0.5 rounded border border-red-500/10 uppercase tracking-widest">Security Guard</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Report Content Flag */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-1">Flag Content Violation</h4>
            <p className="text-[10px] text-zinc-400 font-medium">Report hate speech, harassment, explicit/offensive themes, or other guidelines violations.</p>
          </div>
          <div className="space-y-3">
            <select
              value={reportReason}
              onChange={(event) => setReportReason(event.target.value)}
              className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-[10px] font-bold uppercase tracking-wide cursor-pointer focus:border-zinc-900 outline-none"
            >
              <option value="HATE_SPEECH">Hate Speech & Discrimination</option>
              <option value="HARASSMENT">Harassment & Cyberbullying</option>
              <option value="EXPLICIT">Explicit & Adult Material</option>
              <option value="OTHER">Other Guidelines Breach</option>
            </select>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Please provide details, evidence, or context for the moderation team..."
              className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs outline-none focus:border-zinc-900 resize-none font-medium text-zinc-800 dark:text-zinc-200"
              rows={3}
            />
            <button
              onClick={reportStory}
              disabled={loading === "report"}
              className="w-full py-2.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 shadow-sm shrink-0"
            >
              {loading === "report" ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : "Submit Violation Report"}
            </button>
          </div>
        </div>

        {/* DMCA Copyright Claim Accordion */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-1">Copyright Infringement Claim</h4>
            <p className="text-[10px] text-zinc-400 font-medium">Submit a formal DMCA takedown affidavit if your exclusive intellectual property is breached.</p>
          </div>
          <button
            onClick={() => setDmcaOpen((value) => !value)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-100 dark:border-red-950/40 bg-red-50/10 dark:bg-red-950/5 hover:bg-red-500/5 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-widest rounded transition-all shadow-sm"
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            File DMCA Notice
          </button>
        </div>

      </div>

      {dmcaOpen && (
        <div className="p-6 border border-dashed border-red-200/60 dark:border-red-900/40 bg-red-50/5 rounded-lg space-y-4 pt-6">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-red-100 dark:border-red-950/20">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">Legal Infringement Affidavit</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Original Work Title *</label>
              <input
                value={dmca.originalWorkTitle}
                onChange={(e) => setDmca({ ...dmca, originalWorkTitle: e.target.value })}
                placeholder="e.g. Harry Potter and the Sorcerer's Stone"
                className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs outline-none focus:border-red-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Original Work Author</label>
              <input
                value={dmca.originalWorkAuthor}
                onChange={(e) => setDmca({ ...dmca, originalWorkAuthor: e.target.value })}
                placeholder="e.g. J.K. Rowling"
                className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs outline-none focus:border-red-400"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Copyright Holder / Organization *</label>
              <input
                value={dmca.copyrightHolder}
                onChange={(e) => setDmca({ ...dmca, copyrightHolder: e.target.value })}
                placeholder="e.g. Warner Bros. Entertainment Inc."
                className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs outline-none focus:border-red-400"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Affidavit Statements & description *</label>
              <textarea
                value={dmca.description}
                onChange={(e) => setDmca({ ...dmca, description: e.target.value })}
                placeholder="Identify where the copyrighted material is copied and provide details of the infringement..."
                className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs outline-none focus:border-red-400 resize-none"
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={submitDmca}
              disabled={loading === "dmca"}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest rounded disabled:opacity-50 transition-all shadow"
            >
              {loading === "dmca" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Submit DMCA Affidavit"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
