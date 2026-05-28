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

const getBestBengaliVoice = (voices: SpeechSynthesisVoice[]) => {
  const bnVoices = voices.filter(v => 
    v.lang.toLowerCase().includes("bn-bd") || 
    v.lang.toLowerCase().includes("bn-in") || 
    v.lang.toLowerCase().startsWith("bn") ||
    v.name.toLowerCase().includes("bengali") ||
    v.name.toLowerCase().includes("bangla")
  );

  if (bnVoices.length === 0) return null;

  // 1. Prioritize premium online/natural female voices (Edge: Nabanita)
  const premiumOnlineFemale = bnVoices.find(v => 
    v.name.toLowerCase().includes("nabanita")
  );
  if (premiumOnlineFemale) return premiumOnlineFemale;

  // 2. Prioritize macOS/iOS female voice (Lekha)
  const macOSFemale = bnVoices.find(v => 
    v.name.toLowerCase().includes("lekha")
  );
  if (macOSFemale) return macOSFemale;

  // 3. Prioritize Windows local female voice (Kalpana)
  const localWindowsFemale = bnVoices.find(v => 
    v.name.toLowerCase().includes("kalpana")
  );
  if (localWindowsFemale) return localWindowsFemale;

  // 4. Prioritize Google voices (usually very high quality online female voices)
  const googleVoice = bnVoices.find(v => 
    v.name.toLowerCase().includes("google")
  );
  if (googleVoice) return googleVoice;

  // 5. Prioritize any voice containing "female" or "natural" or "online"
  const generalFemaleOrNatural = bnVoices.find(v => 
    v.name.toLowerCase().includes("female") || 
    v.name.toLowerCase().includes("natural") || 
    v.name.toLowerCase().includes("online")
  );
  if (generalFemaleOrNatural) return generalFemaleOrNatural;

  // 6. If no female voice is explicitly matched, try to filter out known male voices
  const nonMaleVoice = bnVoices.find(v => 
    !v.name.toLowerCase().includes("hemant") && 
    !v.name.toLowerCase().includes("pradeep") && 
    !v.name.toLowerCase().includes("male")
  );
  if (nonMaleVoice) return nonMaleVoice;

  return bnVoices[0];
};

export function TTSPlayer({ htmlContent }: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(false);

  const isPlayingRef = useRef(false);
  const chunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef(0);
  const isBengaliRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true);
      // Pre-warm the voice list
      window.speechSynthesis.getVoices();
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

    if (isBengaliRef.current) {
      utterance.lang = "bn-BD";
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        const bnVoice = getBestBengaliVoice(voices);
        if (bnVoice) {
          utterance.voice = bnVoice;
        }
      }
    } else {
      utterance.lang = "en-US";
    }

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

    // Detect if the entire text contains Bangla characters
    const isBengali = /[\u0980-\u09FF]/.test(text);
    isBengaliRef.current = isBengali;

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
