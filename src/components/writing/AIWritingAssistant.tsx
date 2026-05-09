'use client';

import { useState } from 'react';
import { Wand2, Copy, Loader, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AIWritingAssistantProps {
  selectedText: string;
  onApply?: (newText: string) => void;
}

export function AIWritingAssistant({ selectedText, onApply }: AIWritingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<'rewrite' | 'expand' | 'summarize' | 'grammar' | 'tone'>('rewrite');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const actions = [
    { id: 'rewrite', label: '✨ Rewrite', description: 'Make it more engaging' },
    { id: 'expand', label: '📝 Expand', description: 'Add more details' },
    { id: 'summarize', label: '📌 Summarize', description: 'Make it concise' },
    { id: 'grammar', label: '✓ Grammar', description: 'Fix errors' },
    { id: 'tone', label: '🎭 Tone', description: 'Make it professional' },
  ];

  const handleGetSuggestion = async () => {
    if (!selectedText.trim()) {
      toast.error('Select some text first');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/ai/writing-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selectedText,
          action,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuggestion(data.suggestion);
      } else {
        toast.error('Failed to get suggestion');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  const handleApply = () => {
    onApply?.(suggestion);
    toast.success('Applied! ✨');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition text-sm font-medium"
      >
        <Wand2 className="w-4 h-4" />
        AI Assist
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-blue-600" />
            AI Writing Assistant
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Selected Text */}
        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Selected text:</p>
          <p className="text-sm text-gray-900 line-clamp-2">{selectedText}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {actions.map((a) => (
            <button
              key={a.id}
              onClick={() => setAction(a.id as any)}
              className={`p-2 rounded-lg text-left text-sm transition ${
                action === a.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <div className="font-semibold">{a.label}</div>
              <div className={`text-xs ${action === a.id ? 'text-blue-100' : 'text-gray-600'}`}>
                {a.description}
              </div>
            </button>
          ))}
        </div>

        {/* Get Suggestion Button */}
        <button
          onClick={handleGetSuggestion}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 mb-4"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Getting suggestion...
            </>
          ) : (
            '✨ Get Suggestion'
          )}
        </button>

        {/* Suggestion Display */}
        {suggestion && (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-700 font-semibold mb-1">Suggestion:</p>
              <p className="text-sm text-gray-900">{suggestion}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={handleApply}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
