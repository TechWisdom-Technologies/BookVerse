"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Radio, WifiOff, BookOpen, Download, RotateCcw } from "lucide-react";

export default function Loading() {
  const [isOffline, setIsOffline] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    // Check immediately on mount
    if (!navigator.onLine) {
      setIsOffline(true);
      return;
    }

    // Listen for offline/online events
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    // If loading takes too long (8s), show timeout state
    // This handles cases where DB is unreachable but browser reports online
    const timeout = setTimeout(() => setTimedOut(true), 8000);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
      clearTimeout(timeout);
    };
  }, []);

  // ── Offline UI ─────────────────────────────────────────────────
  if (isOffline) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-12 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div className="max-w-[420px] w-full">
          {/* Header */}
          <div className="mb-10 pb-6 border-b border-zinc-100 dark:border-zinc-900 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center mb-5">
              <WifiOff className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-xl font-bold tracking-tight mb-2">You&apos;re Offline</h1>
            <p className="text-sm text-zinc-500 font-medium max-w-xs leading-relaxed">
              It looks like you&apos;ve lost your internet connection. This page requires a network connection to load.
            </p>
          </div>

          {/* Offline Stories CTA */}
          <div className="mb-8 p-5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-tight mb-1">Read Saved Stories Offline</h3>
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                  Stories you&apos;ve saved for offline reading are still available on this device.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/offline-stories"
              className="w-full py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2.5 hover:opacity-90 shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              Go to Offline Stories
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <RotateCcw className="w-3 h-3" />
              Try Again
            </button>
          </div>

          {/* Tip */}
          <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-900 text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300">
              Save stories for offline reading from any story page
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ── Timed Out UI ───────────────────────────────────────────────
  if (timedOut) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white dark:bg-zinc-950 px-6">
        <div className="max-w-sm w-full flex flex-col items-center text-center gap-6">
          <div className="relative">
            <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
            <Radio className="w-2.5 h-2.5 text-zinc-900 dark:text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">
              Taking longer than expected...
            </p>
            <p className="text-[10px] text-zinc-400 font-medium">
              The server might be slow or unreachable.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all hover:opacity-90 flex items-center gap-2"
            >
              <RotateCcw className="w-3 h-3" />
              Reload
            </button>
            <Link
              href="/offline-stories"
              className="px-6 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center gap-2"
            >
              <Download className="w-3 h-3" />
              Offline Stories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal Loading UI ──────────────────────────────────────────
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
          <Radio className="w-2.5 h-2.5 text-zinc-900 dark:text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 animate-pulse">
          Retrieving Archival Transmission...
        </p>
      </div>
    </div>
  );
}
