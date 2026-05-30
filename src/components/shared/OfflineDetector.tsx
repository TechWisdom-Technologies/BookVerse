"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { WifiOff, BookOpen, X } from "lucide-react";

export function OfflineDetector() {
  const [showModal, setShowModal] = useState(false);
  const [wasOnline, setWasOnline] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isOfflinePage = pathname?.startsWith("/offline-stories");

  const handleGoOffline = useCallback(() => {
    // If we were online and now went offline mid-session, show the modal
    if (wasOnline && !isOfflinePage) {
      setShowModal(true);
    }
    setWasOnline(false);
  }, [wasOnline, isOfflinePage]);

  const handleGoOnline = useCallback(() => {
    setWasOnline(true);
    setShowModal(false);
  }, []);

  useEffect(() => {
    // Check initial state on mount
    if (typeof navigator !== "undefined") {
      const online = navigator.onLine;
      setWasOnline(online);

      // If the user opens the app while offline, redirect immediately
      if (!online && !isOfflinePage) {
        router.replace("/offline-stories");
        return;
      }
    }

    window.addEventListener("offline", handleGoOffline);
    window.addEventListener("online", handleGoOnline);

    return () => {
      window.removeEventListener("offline", handleGoOffline);
      window.removeEventListener("online", handleGoOnline);
    };
  }, [handleGoOffline, handleGoOnline, isOfflinePage, router]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Close button */}
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center space-y-5">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-red-500" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              ইন্টারনেট সংযোগ নেই
            </h2>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
              আপনার ইন্টারনেট সংযোগ বিচ্ছিন্ন হয়ে গেছে। আপনি অফলাইনে সেভ করা গল্পগুলো পড়তে পারবেন।
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full pt-2">
            <button
              onClick={() => {
                setShowModal(false);
                router.push("/offline-stories");
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all hover:opacity-90"
            >
              <BookOpen className="w-3.5 h-3.5" />
              অফলাইন গল্প পড়ুন
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="w-full px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              পরে দেখব
            </button>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div className="h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />
      </div>
    </div>
  );
}
