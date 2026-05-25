"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw, Terminal } from "lucide-react";
import { getFriendlyErrorMessage } from "@/lib/friendly-errors";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  const friendlyMessage = useMemo(
    () => getFriendlyErrorMessage(error, "Something unexpected happened. Please try again or return home."),
    [error]
  );

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
