"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";

interface TTSPlayerProps {
  htmlContent: string;
}

const chunkText = (text: string, maxLen = 1500): string[] => {
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let currentChunk = "";

  const splitIntoSentences = (t: string): string[] => {
    const marks = /[.!?।\n]/;
    const sentences: string[] = [];
    let start = 0;
    
    for (let i = 0; i < t.length; i++) {
      if (marks.test(t[i])) {
        sentences.push(t.slice(start, i + 1));
        start = i + 1;
      }
    }
    
    if (start < t.length) {
      sentences.push(t.slice(start));
    }
    
    return sentences.map(s => s.trim()).filter(Boolean);
  };

  for (let para of paragraphs) {
    para = para.trim();
    if (!para) continue;
    
    if ((currentChunk + "\n\n" + para).length > maxLen) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      
      if (para.length > maxLen) {
        const sentences = splitIntoSentences(para);
        let sentenceChunk = "";
        for (let sentence of sentences) {
          sentence = sentence.trim() + " ";
          if ((sentenceChunk + sentence).length > maxLen) {
            if (sentenceChunk.trim()) {
              chunks.push(sentenceChunk.trim());
            }
            sentenceChunk = sentence;
          } else {
            sentenceChunk += sentence;
          }
        }
        currentChunk = sentenceChunk;
      } else {
        currentChunk = para;
      }
    } else {
      currentChunk = currentChunk ? currentChunk + "\n\n" + para : para;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  return chunks.filter(Boolean);
};

const getVoicesAsync = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve([]);
      return;
    }
    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    
    // Fallback 1: listen to voiceschanged event
    const handleVoicesChanged = () => {
      voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        window.speechSynthesis.onvoiceschanged = null;
        resolve(voices);
      }
    };
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    
    // Fallback 2: Polling fallback (crucial iOS WebKit workaround)
    let retries = 0;
    const interval = setInterval(() => {
      voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        clearInterval(interval);
        window.speechSynthesis.onvoiceschanged = null;
        resolve(voices);
      } else if (retries >= 10) {
        clearInterval(interval);
        resolve([]);
      }
      retries++;
    }, 100);
  });
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
      // Pre-warm the voice list
      getVoicesAsync();
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

  const speakNextChunk = async () => {
    if (!isPlayingRef.current) return;

    if (currentChunkIndexRef.current >= chunksRef.current.length) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      currentChunkIndexRef.current = 0;
      return;
    }

    const chunk = chunksRef.current[currentChunkIndexRef.current];
    const utterance = new SpeechSynthesisUtterance(chunk);

    // Safari / iOS Garbage Collection Fix: Keep a strong reference to the utterance
    if (typeof window !== "undefined") {
      (window as any)._activeUtterance = utterance;
    }

    // Auto-detect if text contains Bengali characters
    const isBengali = /[\u0980-\u09FF]/.test(chunk);
    const voices = await getVoicesAsync();

    if (isBengali) {
      utterance.lang = "bn-BD";
      const bnVoices = voices.filter(v => 
        v.lang.toLowerCase().includes("bn") || 
        v.name.toLowerCase().includes("bengali") || 
        v.name.toLowerCase().includes("bangla")
      );

      if (bnVoices.length > 0) {
        // 1. Prioritize premium online/natural/google/siri female voices
        let preferredVoice = bnVoices.find(v => {
          const name = v.name.toLowerCase();
          return name.includes("natural") || name.includes("online") || name.includes("google") || name.includes("siri");
        });

        // 2. Fallback to local offline female voices
        if (!preferredVoice) {
          preferredVoice = bnVoices.find(v => {
            const name = v.name.toLowerCase();
            return name.includes("kalpana") || name.includes("lekha") || name.includes("female");
          });
        }

        // 3. Fallback to any voice that is NOT Microsoft Hemant (male)
        if (!preferredVoice) {
          preferredVoice = bnVoices.find(v => !v.name.toLowerCase().includes("hemant"));
        }

        // 4. Final fallback
        preferredVoice = preferredVoice || bnVoices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
          utterance.lang = preferredVoice.lang;
        }
      }
    } else {
      utterance.lang = "en-US";
      // Select a high-quality English voice if available (crucial for iOS Safari)
      const enVoices = voices.filter(v => 
        v.lang.toLowerCase().startsWith("en")
      );
      if (enVoices.length > 0) {
        let preferredVoice = enVoices.find(v => {
          const name = v.name.toLowerCase();
          return name.includes("natural") || name.includes("online") || name.includes("google");
        });

        if (!preferredVoice) {
          preferredVoice = enVoices.find(v => {
            const name = v.name.toLowerCase();
            return name.includes("siri") || name.includes("samantha") || name.includes("daniel");
          });
        }

        if (!preferredVoice) {
          preferredVoice = enVoices.find(v => v.name.toLowerCase().includes("premium"));
        }

        preferredVoice = preferredVoice || enVoices.find(v => v.lang.toLowerCase() === "en-us") || enVoices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
          utterance.lang = preferredVoice.lang;
        }
      }
    }

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      // Clear the strong reference when finished
      if (typeof window !== "undefined") {
        (window as any)._activeUtterance = null;
      }
      currentChunkIndexRef.current += 1;
      speakNextChunk();
    };

    utterance.onerror = (event) => {
      // Clear the strong reference on error
      if (typeof window !== "undefined") {
        (window as any)._activeUtterance = null;
      }
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

    const chunkList = chunkText(text, 1500);
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
