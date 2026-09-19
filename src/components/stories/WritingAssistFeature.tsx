"use client";

import { useState } from "react";
import { Wand2, Loader2, X, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";

interface WritingAssistFeatureProps {
  editor: any;
}

export function WritingAssistFeature({ editor }: WritingAssistFeatureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<string>("");

  const handleAssist = async (selectedAction: string) => {
    if (!editor) return;
    
    const { from, to, empty } = editor.state.selection;
    if (empty) {
      toast.error("Please select some text first to use the AI assistant.");
      setIsOpen(false);
      return;
    }
    
    const text = editor.state.doc.textBetween(from, to, " ");
    
    setLoading(true);
    setAction(selectedAction);

    try {
      const res = await fetch("/api/ai/writing-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, action: selectedAction }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to process text");
      }

      const data = await res.json();
      if (data.suggestion) {
        // Replace selection
        editor.chain().focus().insertContent(data.suggestion).run();
        toast.success("AI suggestion applied!");
        setIsOpen(false);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error processing text. Please try again.");
    } finally {
      setLoading(false);
      setAction("");
    }
  };

  const actions = [
    { id: "rewrite", label: "Rewrite", desc: "Make it more engaging" },
    { id: "expand", label: "Expand", desc: "Add more details" },
    { id: "summarize", label: "Summarize", desc: "Keep it brief" },
    { id: "grammar", label: "Fix Grammar", desc: "Correct mistakes" },
    { id: "tone", label: "Professional Tone", desc: "Make it formal" },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title="AI Writing Assistant"
        className="p-2 rounded transition-all text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
      >
        <Wand2 className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded shadow-xl max-w-sm w-full overflow-hidden relative">
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
                  AI Writing Assistant
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 relative">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-4">
                Select text in your story and choose an action below to improve it.
              </p>

              <div className="flex flex-col gap-2">
                {actions.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => handleAssist(act.id)}
                    disabled={loading}
                    className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 text-left"
                  >
                    <div>
                      <span className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        {act.label}
                      </span>
                      <span className="block text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {act.desc}
                      </span>
                    </div>
                    {loading && action === act.id && (
                      <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
