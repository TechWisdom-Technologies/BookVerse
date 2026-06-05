"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get("type") || "PREMIUM";
  const [countdown, setCountdown] = useState(8);

  const typeLabels: Record<string, { title: string; subtitle: string; redirectTo: string }> = {
    PREMIUM: {
      title: "Payment Received!",
      subtitle: "Your payment has been successfully logged. Your membership will be upgraded automatically as soon as an admin approves it.",
      redirectTo: "/",
    },
    PROMOTION: {
      title: "Promotion Live!",
      subtitle: "Your story promotion is now active. It will appear in promoted sections immediately.",
      redirectTo: "/write/dashboard",
    },
    TIP: {
      title: "Tip Delivered!",
      subtitle: "Your tip has been sent and verified instantly. The author will be notified.",
      redirectTo: "/",
    },
  };

  const info = typeLabels[type] || typeLabels.PREMIUM;

  useEffect(() => {
    if (countdown <= 0) {
      router.push(info.redirectTo);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, router, info.redirectTo]);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
            <Check className="w-10 h-10 text-emerald-500" strokeWidth={3} />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">
              Payment Verified
            </h1>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase">
            {info.title}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
            {info.subtitle}
          </p>
        </div>

        {/* Countdown */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Redirecting in {countdown}s...
        </p>

        {/* Manual Link */}
        <Link
          href={info.redirectTo}
          className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Go Now
        </Link>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
          <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-white rounded-full animate-spin" />
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
