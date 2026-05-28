"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";

interface TTSPlayerProps {
  htmlContent: string;
}

const chunkText = (text: string, maxLen = 200): string[] => {
  const sentences = text.match(/[^.!?\n]+[.!?\n]+(\s|$)/g) || [text];
  const chunks: string[] = [];
  let currentChunk = "";

  for (let sentence of sentences) {
    sentence = sentence.trim() + " ";
    if ((currentChunk + sentence).length > maxLen) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      if (sentence.length > maxLen) {
        const words = sentence.split(/\s+/);
        let wordChunk = "";
        for (const word of words) {
          if ((wordChunk + " " + word).length > maxLen) {
            if (wordChunk.trim()) {
              chunks.push(wordChunk.trim());
            }
            wordChunk = word;
          } else {
            wordChunk = wordChunk ? wordChunk + " " + word : word;
          }
        }
        currentChunk = wordChunk + " ";
      } else {
        currentChunk = sentence;
      }
    } else {
      currentChunk += sentence;
    }
  }
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  return chunks.filter(Boolean);
};

export function TTSPlayer({ htmlContent }: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(false);

  const isPlayingRef = useRef(false);
  const chunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef(0);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getTextFromHtml = (html: string) => {
    if (typeof window === "undefined") return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const speakNextChunk = () => {
    if (!isPlayingRef.current) return;

    if (currentChunkIndexRef.current >= chunksRef.current.length) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      currentChunkIndexRef.current = 0;
      return;
    }

    const chunk = chunksRef.current[currentChunkIndexRef.current];
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      currentChunkIndexRef.current += 1;
      speakNextChunk();
    };

    utterance.onerror = (event) => {
      if (isPlayingRef.current && event.error !== "interrupted" && event.error !== "canceled") {
        console.error("SpeechSynthesis error:", event);
      }
      if (!isPlayingRef.current || event.error === "interrupted" || event.error === "canceled") {
        return;
      }
      setIsPlaying(false);
      isPlayingRef.current = false;
      currentChunkIndexRef.current = 0;
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    const text = getTextFromHtml(htmlContent);
    if (!text.trim()) return;

    const chunkList = chunkText(text, 200);
    if (chunkList.length === 0) return;

    window.speechSynthesis.cancel();

    chunksRef.current = chunkList;
    currentChunkIndexRef.current = 0;
    isPlayingRef.current = true;
    setIsPlaying(true);

    speakNextChunk();
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
              Play
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="flex items-center gap-1.5 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-all"
            >
              <Pause className="w-3 h-3" />
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
