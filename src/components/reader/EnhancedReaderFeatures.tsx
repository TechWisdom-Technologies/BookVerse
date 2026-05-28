'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, BookOpen, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface EnhancedReaderFeatures {
  text: string;
  onHighlight?: (text: string) => void;
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

export function EnhancedReaderFeatures({ text, onHighlight }: EnhancedReaderFeatures) {
  const [selectedText, setSelectedText] = useState('');
  const [wordDefinition, setWordDefinition] = useState('');
  const [showDefinition, setShowDefinition] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isSpeakingRef = useRef(false);
  const chunksRef = useRef<string[]>([]);
  const currentChunkIndexRef = useRef(0);
  const isBengaliRef = useRef(false);

  // Cancel SpeechSynthesis on unmount
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Pre-warm voices
      window.speechSynthesis.getVoices();
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString() || '';
      setSelectedText(text);
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
    };
  }, []);

  // Sequential speech synthesis player
  const speakNextChunk = () => {
    if (!isSpeakingRef.current) return;

    if (currentChunkIndexRef.current >= chunksRef.current.length) {
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      currentChunkIndexRef.current = 0;
      toast.success('Done reading');
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
      if (isSpeakingRef.current && event.error !== "interrupted" && event.error !== "canceled") {
        console.error("SpeechSynthesis error:", event);
      }
      if (!isSpeakingRef.current || event.error === "interrupted" || event.error === "canceled") {
        return;
      }
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      currentChunkIndexRef.current = 0;
    };

    window.speechSynthesis.speak(utterance);
  };

  // Text-to-Speech function
  const handleReadAloud = () => {
    const textToSpeak = selectedText || text;

    if (!('speechSynthesis' in window)) {
      toast.error('Text-to-speech not supported in this browser');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      return;
    }

    if (!textToSpeak.trim()) return;

    // Detect if the entire text contains Bangla characters
    const isBengali = /[\u0980-\u09FF]/.test(textToSpeak);
    isBengaliRef.current = isBengali;

    const chunkList = chunkText(textToSpeak, 200);
    if (chunkList.length === 0) return;

    window.speechSynthesis.cancel();

    chunksRef.current = chunkList;
    currentChunkIndexRef.current = 0;
    isSpeakingRef.current = true;
    setIsSpeaking(true);

    speakNextChunk();
  };

  // Dictionary lookup (mock implementation)
  const handleDictionaryLookup = async (word: string) => {
    if (!word.trim()) {
      toast.error('Select a word to look up');
      return;
    }

    try {
      setIsLoading(true);
      // Using free dictionary API
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);

      if (res.ok) {
        const data = await res.json();
        const meaning = data[0]?.meanings?.[0];

        if (meaning) {
          const definition = meaning.definitions?.[0]?.definition || 'Definition not found';
          const example = meaning.definitions?.[0]?.example;

          setWordDefinition(`
**${word}**

*Definition:* ${definition}

${example ? `*Example:* ${example}` : ''}
          `);
          setShowDefinition(true);
        } else {
          toast.error('Definition not found');
        }
      } else {
        toast.error('Word not found in dictionary');
      }
    } catch (error) {
      console.error('Error looking up word:', error);
      toast.error('Failed to look up word');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Reading Controls */}
      {selectedText && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 space-y-2 z-40 max-w-xs">
          <div className="text-sm text-gray-900 font-semibold mb-3">Selected Text:</div>
          <p className="text-sm text-gray-700 line-clamp-2 mb-3">{selectedText}</p>

          <div className="flex gap-2">
            <button
              onClick={handleReadAloud}
              className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition text-sm font-medium ${
                isSpeaking
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              {isSpeaking ? 'Stop' : 'Read'}
            </button>

            <button
              onClick={() => handleDictionaryLookup(selectedText.split(/\s+/)[0])}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition text-sm font-medium disabled:bg-gray-200"
            >
              {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
              {isLoading ? 'Loading' : 'Define'}
            </button>

            <button
              onClick={() => onHighlight?.(selectedText)}
              className="flex-1 p-2 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition text-sm font-medium"
            >
              ✓ Highlight
            </button>
          </div>
        </div>
      )}

      {/* Definition Popup */}
      {showDefinition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <button
              onClick={() => setShowDefinition(false)}
              className="float-right text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
            <div className="prose prose-sm max-w-none mt-4">
              <p>{wordDefinition}</p>
            </div>
            <button
              onClick={() => setShowDefinition(false)}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
