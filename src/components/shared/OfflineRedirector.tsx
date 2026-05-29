"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { WifiOff, Download, X, BookOpen } from "lucide-react";

/**
 * OfflineRedirector
 *
 * When the browser loses internet connection, shows a modal overlay
 * informing the user they're offline, with a button to go to the
 * offline stories dashboard. Does not show on offline-stories pages.
 */
export function OfflineRedirector() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      // Don't show modal if already on offline pages
      if (pathname?.startsWith("/offline-stories")) return;
      setShowModal(true);
    };

    const handleOnline = () => {
      setShowModal(false);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Check on mount
    if (!navigator.onLine && !pathname?.startsWith("/offline-stories")) {
      setShowModal(true);
    }

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [pathname]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300" />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
        {/* Decorative top gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" />

        {/* Close button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all z-10"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 pt-10 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center mb-6">
            <WifiOff className="w-7 h-7 text-amber-600 dark:text-amber-400" />
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
            You&apos;re Offline
          </h2>

          {/* Description */}
          <p className="text-sm text-zinc-500 font-medium mb-8 max-w-xs leading-relaxed">
            It looks like you&apos;ve lost your internet connection. You can still read stories you&apos;ve saved for offline reading.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 w-full">
            <Link
              href="/offline-stories"
              onClick={() => setShowModal(false)}
              className="flex items-center justify-center gap-2.5 w-full px-6 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all hover:opacity-90 shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              Go to Offline Stories
            </Link>

            <button
              onClick={() => setShowModal(false)}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Stay on This Page
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-8 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900">
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 text-center flex items-center justify-center gap-1.5">
            <Download className="w-3 h-3" />
            Save stories in advance from any story page
          </p>
        </div>
      </div>
    </div>
  );
}
