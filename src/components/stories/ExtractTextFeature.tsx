"use client";

import { useState, useRef } from "react";
import { ScanText, Loader2, Image as ImageIcon, X, Lock, FileText, Camera } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface ExtractTextFeatureProps {
  onExtracted: (text: string) => void;
}

export function ExtractTextFeature({ onExtracted }: ExtractTextFeatureProps) {
  const { dbUser, loading: authLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const isPro = dbUser?.membershipTier === "PRO" || dbUser?.membershipTier === "CREATOR";
  const showLock = !authLoading && !isPro;
  const isLocked = authLoading || !isPro;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset inputs
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";

    if (!isPro) {
      toast.error("You need a Pro plan to use this feature.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/ai/extract-text", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to extract text");
      }

      const data = await res.json();
      if (data.text) {
        onExtracted(data.text);
        toast.success("Text extracted successfully!");
        setIsOpen(false);
      } else {
        toast.error("No text could be extracted from this file.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error extracting text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title="Extract Text from Image/PDF/Doc"
        className="p-2 rounded transition-all text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
      >
        <ScanText className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded shadow-xl max-w-md w-full overflow-hidden relative">
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-2">
                <ScanText className="w-4 h-4 text-indigo-500" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-800 dark:text-zinc-200">
                  Extract Text from Document
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 relative">
              {authLoading && (
                <div className="absolute inset-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
              )}

              {showLock && (
                <div className="absolute inset-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-500/10 dark:to-amber-500/20 border border-amber-200/50 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-5 shadow-sm transform rotate-3">
                    <Lock className="w-6 h-6 -rotate-3" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">Pro Feature</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-[280px] leading-relaxed">
                    Upgrade to a <strong className="text-zinc-700 dark:text-zinc-300">Pro</strong> or <strong className="text-zinc-700 dark:text-zinc-300">Creator</strong> plan to unlock AI text extraction from your handwritten notes, PDFs, and documents.
                  </p>
                  <Link
                    href="/premium"
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Unlock with Pro
                  </Link>
                </div>
              )}

              <div className={`space-y-4 ${isLocked ? 'opacity-30 pointer-events-none' : ''}`}>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-6">
                  Upload a photo of your diary, a scanned PDF, or a Word document. Our AI will extract the text and insert it directly into your chapter.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="flex flex-col items-center justify-center gap-3 p-6 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    <FileText className="w-6 h-6 text-zinc-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-300">
                      Upload File
                    </span>
                  </button>

                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={loading}
                    className="flex flex-col items-center justify-center gap-3 p-6 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    <Camera className="w-6 h-6 text-zinc-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-300">
                      Take Photo
                    </span>
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileSelect}
                />
                
                <input
                  type="file"
                  ref={cameraInputRef}
                  className="hidden"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                />

                {loading && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-indigo-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Extracting text, please wait...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
