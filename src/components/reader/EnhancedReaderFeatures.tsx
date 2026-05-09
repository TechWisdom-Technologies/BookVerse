'use client';

import { useState, useEffect } from 'react';
import { Volume2, BookOpen, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface EnhancedReaderFeatures {
  text: string;
  onHighlight?: (text: string) => void;
}

export function EnhancedReaderFeatures({ text, onHighlight }: EnhancedReaderFeatures) {
  const [selectedText, setSelectedText] = useState('');
  const [wordDefinition, setWordDefinition] = useState('');
  const [showDefinition, setShowDefinition] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
      toast.success('Done reading');
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
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
