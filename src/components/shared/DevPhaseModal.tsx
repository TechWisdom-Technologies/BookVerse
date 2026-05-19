"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AlertCircle, ArrowRight, MessageSquare, ShieldAlert } from "lucide-react";
import Link from "next/link";

export function DevPhaseModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const isDismissed = localStorage.getItem(`dev-notice-dismissed-${user.uid}`);
      if (!isDismissed) {
        // Add a premium entrance delay
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } else {
      setIsOpen(false);
    }
  }, [user]);

  const handleDismiss = () => {
    if (user) {
      localStorage.setItem(`dev-notice-dismissed-${user.uid}`, "true");
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with premium blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500" 
        onClick={handleDismiss}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl shadow-2xl p-8 overflow-hidden transform scale-100 transition-all duration-300 animate-in fade-in zoom-in-95">
        
        {/* Subtle decorative cosmic background gradient */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-pink-500/10 dark:bg-pink-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Animated Icon Ring */}
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 animate-ping duration-3000" />
            <ShieldAlert className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
              System Notice
            </span>
            <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              Under Development
            </h3>
          </div>

          {/* Message */}
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed space-y-4">
            <p>
              Welcome to <span className="font-bold text-zinc-900 dark:text-white">BookVerse By TechWisdom Technologies</span>! We are currently in the active development and testing phase.
            </p>
            <p className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 rounded-lg italic text-zinc-600 dark:text-zinc-300">
              &quot;If you find any bugs, glitches, or errors, feel free to submit a report, suggest features, or share your valuable feedback.&quot;
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3 pt-2">
            <Link 
              href="/support" 
              onClick={handleDismiss}
              className="w-full py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg transition-all flex items-center justify-center gap-2 border border-zinc-900 dark:border-white hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Provide Feedback
            </Link>
            
            <button
              onClick={handleDismiss}
              className="w-full py-3.5 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg transition-all flex items-center justify-center gap-2 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800"
            >
              Acknowledge & Proceed
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
