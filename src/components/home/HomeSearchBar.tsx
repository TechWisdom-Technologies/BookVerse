"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, TrendingUp, Book, User, Compass, Loader2, Mic } from "lucide-react";
import toast from "react-hot-toast";

const PLACEHOLDERS = [
  "Search books, stories...",
  "Try searching 'Adventure'...",
  "Find your next series...",
  "Discover trending authors...",
  "Search for 'Space Opera'...",
];

const DEFAULT_SUGGESTIONS = [
  { text: "Adventure", icon: TrendingUp },
  { text: "Space Opera", icon: Compass },
  { text: "Romance", icon: Book },
  { text: "Dark Fantasy", icon: Book },
  { text: "Trending Authors", icon: User },
];

export function HomeSearchBar({ initialQuery = "", variant = "home" }: { initialQuery?: string, variant?: "home" | "searchPage" }) {
  const [query, setQuery] = useState(initialQuery);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") || "all";

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setHasSpeechSupport(true);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceSearch = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(transcript)}&type=${typeParam}`);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === "not-allowed") {
        toast.error("Microphone blocked. Click the lock icon in your browser's URL bar to allow it, or ensure you are on localhost (HTTPS is required for IPs).", { duration: 5000 });
      } else if (event.error === "network") {
        toast.error("Network error occurred during speech recognition.");
      } else {
        toast.error("Failed to recognize speech. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  };

  useEffect(() => {
    if (isFocused) return;
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isFocused]);

  useEffect(() => {
    if (!query.trim()) {
      setLiveResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=5`);
        const data = await res.json();
        if (data.results) {
          setLiveResults(data.results);
        }
      } catch (err) {
        console.error("Live search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}&type=${typeParam}`);
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setQuery(text);
    router.push(`/search?q=${encodeURIComponent(text)}&type=${typeParam}`);
    setIsFocused(false);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "book":
      case "story": return Book;
      case "author": return User;
      case "universe": return Compass;
      default: return Search;
    }
  };

  const inner = (
    <div className={`relative w-full ${variant === "searchPage" ? "max-w-3xl mx-auto z-50 mb-16" : "max-w-2xl"}`}>
      <form onSubmit={handleSearch} className="relative flex items-center group z-20 w-full">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors z-10" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={PLACEHOLDERS[placeholderIdx]}
          className={`w-full pl-14 ${hasSpeechSupport ? 'pr-32' : 'pr-24'} py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-full text-[11px] font-bold outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-all shadow-sm placeholder:text-zinc-400 focus:bg-white dark:focus:bg-zinc-950 relative z-10 duration-500 ease-in-out`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
          {hasSpeechSupport && (
            <button
              type="button"
              onClick={handleVoiceSearch}
              title="Voice Search"
              className={`p-2.5 rounded-full transition-all ${isListening
                  ? "bg-red-100 text-red-500 animate-pulse"
                  : "text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </div>
      </form>

      {isFocused && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col z-10">
          <div className="px-6 py-4 border-b border-zinc-50 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
              {query.trim() ? "Search Results" : "Popular Suggestions"}
            </span>
            {isLoading && <Loader2 className="w-3 h-3 text-zinc-400 animate-spin" />}
          </div>
          <div className="py-2">
            {!query.trim() ? (
              // Show default suggestions when query is empty
              DEFAULT_SUGGESTIONS.map((item, idx) => (
                <button
                  key={`default-${idx}`}
                  type="button"
                  onMouseDown={() => handleSuggestionClick(item.text)}
                  className="w-full text-left px-6 py-3 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group"
                >
                  <item.icon className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{item.text}</span>
                </button>
              ))
            ) : liveResults.length > 0 ? (
              // Show live search results
              liveResults.map((item, idx) => {
                const Icon = getIconForType(item._type);
                // Use display_name/username for authors, or title/name for books/stories/universes
                const displayText = item.title || item.name || item.authorDisplayName || item.authorUsername || item.username || "Unknown";

                return (
                  <button
                    key={`live-${idx}`}
                    type="button"
                    onMouseDown={() => handleSuggestionClick(displayText)}
                    className="w-full text-left px-6 py-3 flex flex-col gap-1 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors shrink-0" />
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors line-clamp-1">{displayText}</span>
                      <span className="ml-auto text-[8px] uppercase tracking-widest text-zinc-400">{item._type}</span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-6 py-4 text-xs font-bold text-zinc-500 italic">
                {isLoading ? "Searching..." : "No results found. Press enter to search all."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (variant === "searchPage") {
    return inner;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 relative z-50">
      {inner}
    </div>
  );
}
