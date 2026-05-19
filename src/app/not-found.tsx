"use client";

import Link from "next/link";
import { Search, Home, ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-[400px] w-full">
        
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
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-4 italic">
            <AlertCircle className="w-3.5 h-3.5" />
            Page Not Found
          </div>
          <h1 className="text-xl font-bold tracking-tight mb-2 uppercase">404.</h1>
          <p className="text-[11px] text-zinc-500 font-medium italic leading-relaxed">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        </div>

        {/* Error Code */}
        <div className="mb-12 flex items-center justify-center py-10 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10 relative overflow-hidden">
          <span className="text-6xl font-bold tracking-tighter text-zinc-100 dark:text-zinc-900 absolute -bottom-4 -right-2">404</span>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-300 italic">Not Found</div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all flex items-center justify-center gap-3 border border-zinc-900 dark:border-white shadow-md"
          >
            <Home className="w-3.5 h-3.5" /> Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full py-3.5 border border-zinc-100 dark:border-zinc-900 text-zinc-900 dark:text-zinc-100 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all flex items-center justify-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </button>
        </div>

        {/* Search */}
        <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-900 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-6 italic">Looking for something?</p>
          <Link
            href="/search"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-white hover:underline underline-offset-8 flex items-center justify-center gap-3"
          >
            <Search className="w-3.5 h-3.5" /> Search BookVerse
          </Link>
        </div>
      </div>
    </main>
  );
}
