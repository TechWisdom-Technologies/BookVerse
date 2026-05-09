"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/shared/FileUpload";
import { ArrowLeft, BookOpen, PenTool, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewStoryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title registration required."); return; }
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim() || null,
          coverUrl: coverUrl || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Registry error.");
        return;
      }
      const data = await res.json();
      router.push(`/write/${data.story.id}/edit`);
    } catch {
      setError("System malfunction. Retry transmission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[480px]">
        
        {/* Minimal Header */}
        <div className="mb-10 pb-6 border-b border-zinc-100 dark:border-zinc-900">
          <Link href="/write" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3 h-3" />
            Return to Studio
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
            <PenTool className="w-3.5 h-3.5" />
            Manuscript Initialization
          </div>
          <h1 className="text-xl font-bold tracking-tight mb-1">New Volume Registration.</h1>
          <p className="text-xs text-zinc-500 font-medium">Define the core metadata to initialize your archival record.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Volume Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Echoes of the Void"
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-xs font-medium outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Volume Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Provide a concise archival summary..."
              rows={4}
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-xs font-medium outline-none focus:border-zinc-900 dark:focus:border-white transition-all resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Visual Record Record</label>
            <div className="p-4 border border-dashed border-zinc-100 dark:border-zinc-800 rounded bg-zinc-50/20 dark:bg-zinc-900/10">
              <FileUpload
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                onUpload={(url) => setCoverUrl(url)}
                label="Initialize Cover Record"
              />
              {coverUrl && (
                <div className="mt-2 text-[9px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Cover Registry Confirmed
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 border border-rose-500/20 bg-rose-500/5 text-[10px] font-bold text-rose-500 rounded uppercase tracking-tight">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Commit Volume"}
          </button>
        </form>
      </div>
    </main>
  );
}
