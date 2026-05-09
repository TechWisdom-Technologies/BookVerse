"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, Volume2, Loader2, Radio } from "lucide-react";

interface TTSPlayerProps {
  htmlContent: string;
}

export function TTSPlayer({ htmlContent }: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true);
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const getTextFromHtml = (html: string) => {
    if (typeof window === "undefined") return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const handlePlay = () => {
    if (!synthRef.current) return;

    if (isPaused) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    const text = getTextFromHtml(htmlContent);
    if (!text.trim()) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        console.error("Audio Error:", e);
      }
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const handlePause = () => {
    if (!synthRef.current) return;
    synthRef.current.pause();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!supported) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
          {isPlaying ? <Loader2 className="w-3 h-3 animate-spin text-zinc-300" /> : <Volume2 className="w-3 h-3" />}
          Listen to Story
        </div>
        
        <div className="h-3 w-px bg-zinc-100 dark:bg-zinc-800" />

        <div className="flex items-center gap-1">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="flex items-center gap-1.5 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-all"
            >
              <Play className="w-3 h-3" />
              {isPaused ? "Resume" : "Play"}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-1.5 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-all"
            >
              <Pause className="w-3 h-3" />
              Pause
            </button>
          )}

          {(isPlaying || isPaused) && (
            <button
              onClick={handleStop}
              className="flex items-center gap-1.5 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-rose-500 hover:bg-rose-500/5 rounded transition-all"
            >
              <Square className="w-2.5 h-2.5" />
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
