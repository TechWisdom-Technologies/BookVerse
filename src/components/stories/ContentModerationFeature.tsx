"use client";

import { useState } from "react";
import { ShieldCheck, Loader2, X, AlertTriangle, ShieldAlert } from "lucide-react";
import { toast } from "react-hot-toast";

interface ContentModerationFeatureProps {
  editor: any;
  storyId: string;
}

export function ContentModerationFeature({ editor, storyId }: ContentModerationFeatureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ flagged: boolean; reason?: string; severity?: string } | null>(null);

  const handleCheck = async () => {
    if (!editor) return;
    
    // Get full text from the editor
    const text = editor.getText();
    if (!text.trim()) {
      toast.error("Your story is empty.");
      return;
    }
    
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/moderation/check-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, storyId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to check content");
      }

      const data = await res.json();
      setResult(data);
      
      if (data.flagged) {
        toast.error("Content flagged! See details.");
      } else {
        toast.success("Content looks safe!");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error checking content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setResult(null);
        }}
        title="Content Safety Check"
        className="p-2 rounded transition-all text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded shadow-xl max-w-sm w-full overflow-hidden relative">
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
                  Content Safety Check
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

            <div className="p-6 relative text-center">
              {!result && !loading && (
                <>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                    Run an AI check on your story to ensure it complies with our community guidelines (no hate speech, explicit content, etc.).
                  </p>
                  <button
                    onClick={handleCheck}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors"
                  >
                    Run Safety Check
                  </button>
                </>
              )}

              {loading && (
                <div className="flex flex-col items-center gap-4 py-4">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  <p className="text-xs text-zinc-500 font-medium">Analyzing your story...</p>
                </div>
              )}

              {result && !loading && (
                <div className="flex flex-col items-center gap-4">
                  {result.flagged ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                        <ShieldAlert className="w-6 h-6 text-rose-500" />
                      </div>
                      <h3 className="text-sm font-bold text-rose-500">Content Flagged</h3>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400 text-left bg-zinc-50 dark:bg-zinc-900 p-4 rounded w-full">
                        <p className="mb-2"><span className="font-bold">Severity:</span> {result.severity}</p>
                        <p><span className="font-bold">Reason:</span> {result.reason}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                      </div>
                      <h3 className="text-sm font-bold text-emerald-500">All Clear!</h3>
                      <p className="text-xs text-zinc-500">Your content looks safe and follows our guidelines.</p>
                    </>
                  )}
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-2 px-6 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-bold uppercase tracking-widest rounded transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
