"use client";

import { useState } from "react";
import { Sparkles, Loader2, Image as ImageIcon, Check } from "lucide-react";
import Image from "next/image";

interface AiCoverGeneratorProps {
  onCoverGenerated: (url: string) => void;
}

export function AiCoverGenerator({ onCoverGenerated }: AiCoverGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedUrl(null);

    try {
      const res = await fetch("/api/ai/cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Failed to generate image");

      const data = await res.json();
      setGeneratedUrl(data.url);
    } catch (err) {
      console.error(err);
      setError("Failed to generate cover. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseCover = () => {
    if (generatedUrl) {
      onCoverGenerated(generatedUrl);
    }
  };

  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/30 dark:bg-indigo-950/20">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">
          AI Cover Studio
        </h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., A dark fantasy castle at midnight, watercolor style"
            className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            disabled={isGenerating}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        )}

        {generatedUrl && (
          <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="relative aspect-[2/3] w-32 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedUrl}
                alt="Generated Cover"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              onClick={handleUseCover}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
            >
              <Check className="h-4 w-4" />
              Use This Cover
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
