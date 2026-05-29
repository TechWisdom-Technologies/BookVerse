"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw, Terminal, WifiOff, BookOpen, Download } from "lucide-react";
import { getFriendlyErrorMessage } from "@/lib/friendly-errors";

function isNetworkError(error: Error): boolean {
  const msg = (error.message || "").toLowerCase();
  const networkKeywords = [
    "enotfound",
    "econnrefused",
    "econnreset",
    "etimedout",
    "enetunreach",
    "enetdown",
    "fetch failed",
    "network request failed",
    "failed to fetch",
    "networkerror",
    "getaddrinfo",
    "dns",
    "socket hang up",
    "connection refused",
  ];
  return networkKeywords.some((keyword) => msg.includes(keyword));
}

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    console.error("Application error:", error);
    setIsOffline(!navigator.onLine);

    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, [error]);

  const isNetwork = useMemo(() => isNetworkError(error), [error]);

  const friendlyMessage = useMemo(
    () => getFriendlyErrorMessage(error, "Something unexpected happened. Please try again or return home."),
    [error]
  );

  // ── Offline / Network Error UI ─────────────────────────────────
  if (isNetwork || isOffline) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div className="max-w-[420px] w-full">
          {/* Header */}
          <div className="mb-10 pb-6 border-b border-zinc-100 dark:border-zinc-900 flex flex-col items-center text-center">
            <Link href="/" className="flex flex-col items-center gap-2 group mb-6">
              <img
                src="/bookverse.png"
                alt="BookVerse Logo"
                className="w-16 h-16 object-contain rounded-xl transition-transform group-hover:scale-105 duration-300"
              />
              <div className="flex flex-col items-center">
                <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                  BookVerse
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                  By TechWisdom Technologies
                </span>
              </div>
            </Link>

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
              onClick={reset}
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

  // ── Default Error UI ───────────────────────────────────────────
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-[400px] w-full">
        
        {/* Malfunction Header */}
        <div className="mb-10 pb-6 border-b border-zinc-100 dark:border-zinc-900 flex flex-col items-center text-center">
          <Link href="/" className="flex flex-col items-center gap-2 group mb-6">
            <img
              src="/bookverse.png"
              alt="BookVerse Logo"
              className="w-16 h-16 object-contain rounded-xl transition-transform group-hover:scale-105 duration-300"
            />
            <div className="flex flex-col items-center">
              <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                BookVerse
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                By TechWisdom Technologies
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Execution Malfunction
          </div>
          <h1 className="text-xl font-bold tracking-tight mb-1">System Interruption.</h1>
          <p className="text-xs text-zinc-500 font-medium">An unexpected malfunction has occurred during the archival transmission process.</p>
        </div>

        {/* Diagnostic Registry */}
        <div className="mb-12 p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/20 dark:bg-zinc-900/10">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-900">
            <Terminal className="w-3 h-3 text-zinc-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Diagnostic Data</span>
          </div>
          <div className="text-[10px] font-mono text-zinc-500 break-all leading-relaxed">
            {friendlyMessage}
            {error.digest && <div className="mt-2 pt-2 border-t border-zinc-50 dark:border-zinc-900 text-[9px] text-zinc-400">REF: {error.digest}</div>}
          </div>
        </div>

        {/* Recovery Protocols */}
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3 h-3" /> Re-execute Transmission
          </button>

          <Link
            href="/"
            className="w-full py-3 border border-zinc-100 dark:border-zinc-900 text-zinc-900 dark:text-zinc-100 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <Home className="w-3 h-3" /> Terminate & Return Home
          </Link>
        </div>

        {/* System Support Registry */}
        <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-900 text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300">Continuous malfunctions should be reported to system administration.</p>
        </div>
      </div>
    </main>
  );
}

