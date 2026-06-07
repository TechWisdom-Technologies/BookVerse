"use client";

import { useState } from "react";
import { Sparkles, Loader2, Image as ImageIcon, Trash2, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface AiChapterIllustrationProps {
  storyId: string;
  chapterId: string;
  initialUrl?: string | null;
  onSave: (url: string | null) => void;
}

export function AiChapterIllustration({ storyId, chapterId, initialUrl, onSave }: AiChapterIllustrationProps) {
  const { dbUser, loading: authLoading } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(initialUrl || null);

  const isPro = dbUser?.membershipTier === "PRO" || dbUser?.membershipTier === "CREATOR";
  const showLock = !authLoading && !isPro;
  const isLocked = authLoading || !isPro;

  const handleGenerate = async () => {
    if (!isPro) {
      toast.error("You need a Pro plan to use this feature.");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate-illustration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, chapterId }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate illustration");
      }

      const data = await res.json();
      const newUrl = data.url;

      // Update the chapter via API
      const patchRes = await fetch(`/api/stories/${storyId}/chapters/${chapterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ illustrationUrl: newUrl }),
      });

      if (!patchRes.ok) throw new Error("Failed to save illustration to chapter");

      setCurrentUrl(newUrl);
      onSave(newUrl);
      toast.success("Illustration generated and saved!");
      setPrompt("");
    } catch (error) {
      console.error(error);
      toast.error("Error generating illustration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this illustration?")) return;
    
    try {
      const patchRes = await fetch(`/api/stories/${storyId}/chapters/${chapterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ illustrationUrl: null }),
      });

      if (!patchRes.ok) throw new Error("Failed to remove illustration");

      setCurrentUrl(null);
      onSave(null);
      toast.success("Illustration removed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove illustration");
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-zinc-50 dark:border-zinc-900">
        <Sparkles className="w-4 h-4 text-indigo-500" />
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
          AI Chapter Illustration
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Preview Area */}
        <div className="w-full md:w-1/3 aspect-[16/9] md:aspect-auto md:h-48 relative rounded overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 group shadow-inner">
          {currentUrl ? (
            <>
              <img src={currentUrl} alt="Chapter Illustration" className="w-full h-full object-cover grayscale" />
              <button
                onClick={handleRemove}
                className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity shadow"
                title="Remove Illustration"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-300 dark:text-zinc-700">
              <ImageIcon className="w-8 h-8" />
              <span className="text-[9px] font-bold uppercase tracking-widest">No Image</span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex-1 space-y-4 flex flex-col justify-center relative">
          {authLoading && (
            <div className="absolute inset-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center rounded">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          )}

          {showLock && (
            <div className="absolute inset-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center rounded">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-500/10 dark:to-amber-500/20 border border-amber-200/50 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-5 shadow-sm transform rotate-3">
                <Lock className="w-6 h-6 -rotate-3" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">Pro Feature</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-[280px] leading-relaxed">
                Upgrade to a <strong className="text-zinc-700 dark:text-zinc-300">Pro</strong> or <strong className="text-zinc-700 dark:text-zinc-300">Creator</strong> plan to generate stunning AI illustrations for your chapters.
              </p>
              <Link
                href="/premium"
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Unlock with Pro
              </Link>
            </div>
          )}
          
          <div className={`space-y-4 ${isLocked ? 'opacity-30 pointer-events-none' : ''}`}>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              Generate a stunning, realistic black and white hero image for this chapter to set the mood for your readers.
            </p>
            <div className="space-y-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A solitary knight walking through a snowy, bioluminescent forest..."
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-xs outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGenerate();
              }}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Image
                </>
              )}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
