"use client";

import { useState } from "react";
import { Sparkles, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface AiChapterIllustrationProps {
  storyId: string;
  chapterId: string;
  initialUrl?: string | null;
  onSave: (url: string | null) => void;
}

export function AiChapterIllustration({ storyId, chapterId, initialUrl, onSave }: AiChapterIllustrationProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(initialUrl || null);

  const handleGenerate = async () => {
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
        <div className="flex-1 space-y-4 flex flex-col justify-center">
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
  );
}
