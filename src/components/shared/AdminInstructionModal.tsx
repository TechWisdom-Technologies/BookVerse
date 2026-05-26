"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Mail, ArrowRight, Settings, X } from "lucide-react";
import Link from "next/link";

export function AdminInstructionModal() {
  const { user, dbUser, refreshUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    if (!user || !dbUser) {
      setIsOpen(false);
      return;
    }

    // Check if there's an unseen admin instruction
    const hasUnseen =
      dbUser.adminInstruction &&
      dbUser.adminInstruction.trim().length > 0 &&
      !dbUser.instructionSeen;

    if (hasUnseen) {
      setInstruction(dbUser.adminInstruction!);
      // Show after the DevPhaseModal has had time to appear and be dismissed
      const devDismissed = localStorage.getItem(`dev-notice-dismissed-${user.uid}`);
      const delay = devDismissed ? 600 : 3000;
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
    }
  }, [user, dbUser]);

  const handleDismiss = async () => {
    setDismissing(true);
    try {
      // Mark instruction as seen via the user profile PATCH endpoint
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructionSeen: true }),
      });
      await refreshUser();
    } catch (err) {
      console.error("Failed to mark instruction as seen:", err);
    } finally {
      setDismissing(false);
      setIsOpen(false);
    }
  };

  if (!isOpen || !instruction) return null;

  return (
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl shadow-2xl p-8 overflow-hidden transform scale-100 transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* Decorative gradients */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleDismiss}
          disabled={dismissing}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Animated Icon */}
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
            <div className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 animate-ping" />
            <Mail className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
              Admin Notice
            </span>
            <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              Message from Admin
            </h3>
          </div>

          {/* Instruction Message */}
          <div className="w-full text-left">
            <div className="px-5 py-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 rounded-xl">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap">
                {instruction}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3 pt-2">
            <Link
              href="/settings"
              onClick={handleDismiss}
              className="w-full py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg transition-all flex items-center justify-center gap-2 border border-zinc-900 dark:border-white hover:bg-zinc-800 dark:hover:bg-zinc-100 shadow-md"
            >
              <Settings className="w-3.5 h-3.5" />
              Go to Settings
            </Link>

            <button
              onClick={handleDismiss}
              disabled={dismissing}
              className="w-full py-3.5 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg transition-all flex items-center justify-center gap-2 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 disabled:opacity-50"
            >
              {dismissing ? "Acknowledging..." : "Acknowledge & Continue"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
