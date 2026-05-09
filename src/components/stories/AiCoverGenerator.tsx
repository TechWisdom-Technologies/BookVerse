"use client";

import { useState } from "react";
import { Sparkles, Loader2, Image as ImageIcon, Check, Radio, Terminal, AlertCircle, BookmarkCheck } from "lucide-react";
import { toast } from "react-hot-toast";

interface AiCoverGeneratorProps {
  onCoverGenerated: (url: string) => void;
}

export function AiCoverGenerator({ onCoverGenerated }: AiCoverGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCaptured, setIsCaptured] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setIsCaptured(false);
    setError(null);
    setGeneratedUrl(null);
    try {
      const res = await fetch("/api/ai/cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setGeneratedUrl(data.url);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to make cover. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseCover = () => {
    if (generatedUrl) { 
      onCoverGenerated(generatedUrl); 
      setIsCaptured(true);
      toast.success("Cover added to your story!", {
        style: {
          borderRadius: '2px',
          background: '#000',
          color: '#fff',
          fontSize: '10px',
          fontWeight: 'bold',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          border: '1px solid #333'
        }
      });
    }
  };

  return (
    <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden">
      
      {/* Simple Header */}
      <div className="px-4 py-3 bg-zinc-50/50 dark:bg-zinc-900/10 border-b border-zinc-50 dark:border-zinc-900 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <Sparkles className="w-3.5 h-3.5" />
          AI Cover Maker
        </div>
        <div className="flex items-center gap-2 px-2 py-0.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-[9px] font-bold text-zinc-300">
          Studio Active
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Describe your cover</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => { setPrompt(e.target.value); setIsCaptured(false); }}
              placeholder="e.g. A dark castle, oil painting style..."
              className="flex-1 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-[11px] font-medium text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
              disabled={isGenerating}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Make"}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 bg-rose-500/5 border border-rose-500/10 rounded">
            <AlertCircle className="w-3 h-3 text-rose-500" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-rose-500">{error}</p>
          </div>
        )}

        {generatedUrl && (
          <div className="pt-6 border-t border-zinc-50 dark:border-zinc-900 flex flex-col items-center gap-6">
            <div className="relative aspect-[2/3] w-48 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 overflow-hidden group">
              <img src={generatedUrl} alt="" className="h-full w-full object-cover transition-all duration-500" />
              {isCaptured && (
                <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
                  <BookmarkCheck className="w-8 h-8 text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-white dark:bg-zinc-900 px-2 py-1 rounded border border-emerald-500/20">Saved</span>
                </div>
              )}
            </div>
            
            <button
              onClick={handleUseCover}
              disabled={isCaptured}
              className={`w-full py-2.5 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 ${
                isCaptured 
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default" 
                  : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 shadow-lg"
              }`}
            >
              {isCaptured ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
              {isCaptured ? "Cover Saved" : "Use this Cover"}
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-zinc-50 dark:border-zinc-900 bg-zinc-50/10 flex items-center justify-between">
        <div className="text-[8px] font-bold uppercase tracking-widest text-zinc-300">Powered by AI</div>
        <div className="text-[8px] font-bold uppercase tracking-widest text-zinc-300">Status: {isCaptured ? "Ready" : "Pending"}</div>
      </div>
    </div>
  );
}
