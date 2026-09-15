"use client";

import { Sparkles, ArrowRight, KeyRound } from "lucide-react";
import Link from "next/link";
import { PaidTier } from "@/lib/tier-check";

interface AccessDeniedModalProps {
  requiredTier: PaidTier | "ADMIN" | "USER";
  redirectTo: string;
}

const TIER_MESSAGES: Record<string, { title: string; subtitle: string; desc: string }> = {
  AUTHOR: {
    title: "Author Access",
    subtitle: "Publishing & Distribution",
    desc: "You need the Author plan to unlock this publishing feature and start building your audience.",
  },
  PRO: {
    title: "Pro Access",
    subtitle: "Analytics & Insights",
    desc: "Unlock advanced analytics, deep reader insights, and professional tools with the Pro plan.",
  },
  CREATOR: {
    title: "Creator Access",
    subtitle: "Ultimate Control",
    desc: "Gain ultimate control, custom branding, and exclusive creator features to dominate the platform.",
  },
  ADMIN: {
    title: "System Oversight",
    subtitle: "Clearance Required",
    desc: "This sector is restricted to administrative personnel only. Your credentials are insufficient.",
  },
  USER: {
    title: "Authentication",
    subtitle: "Identity Required",
    desc: "You must be signed in to access this page. Please log in or create an account.",
  }
};

export function AccessDeniedModal({ requiredTier, redirectTo }: AccessDeniedModalProps) {
  const content = TIER_MESSAGES[requiredTier] || TIER_MESSAGES.USER;

  const isTier = requiredTier === "AUTHOR" || requiredTier === "PRO" || requiredTier === "CREATOR";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#070708]/90 backdrop-blur-xl">

      <div className="max-w-[400px] w-full bg-[#0c0c0e] border border-zinc-900 rounded-xl p-10 shadow-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        
        <div className="relative z-10 flex flex-col items-center text-center">
          
          <div className="mb-8 relative">
            <div className="w-16 h-16 rounded-xl bg-[#070708] border border-zinc-800 flex items-center justify-center relative z-10">
              <img src="/bookverse.png" alt="BookVerse Logo" className="w-8 h-8 object-contain" />
            </div>
          </div>

          <div className="space-y-4 mb-10 w-full">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-2">
                {content.subtitle}
              </p>
              <h2 className="text-xl font-bold tracking-tight text-white">
                {content.title}
              </h2>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed max-w-[280px] mx-auto">
              {content.desc}
            </p>
          </div>

          <div className="w-full">
            {isTier ? (
              <Link
                href={redirectTo}
                className="group w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 transition-all duration-300 shadow-md"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-900 transition-colors">
                  Upgrade Plan
                </span>
                <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-colors duration-300 shadow-sm">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ) : (
              <Link
                href={redirectTo}
                className="group w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 transition-all duration-300 shadow-md"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-900 transition-colors">
                  {requiredTier === "ADMIN" ? "Return to Safety" : "Sign In Now"}
                </span>
                <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-colors duration-300 shadow-sm">
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            )}
            
            {isTier && (
              <Link 
                href="/"
                className="mt-4 block text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Maybe Later
              </Link>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
