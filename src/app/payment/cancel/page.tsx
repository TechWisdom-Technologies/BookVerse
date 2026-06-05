"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

function CancelContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const reasonMessages: Record<string, string> = {
    incomplete: "The payment was not completed. You were not charged.",
    invalid_metadata: "The payment session data was invalid. Please try again.",
    missing_story: "The story for promotion could not be found.",
    missing_receiver: "The tip recipient could not be found.",
    verify_error: "We could not verify the payment status. If you were charged, please contact support.",
  };

  const message =
    reason && reasonMessages[reason]
      ? reasonMessages[reason]
      : "Your payment was cancelled or could not be completed. No charges were made.";

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Cancel Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-rose-500/10 border-2 border-rose-500/20 flex items-center justify-center">
          <XCircle className="w-10 h-10 text-rose-500" />
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">
            Payment Cancelled
          </h1>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase">
            Transaction Not Completed
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return Home
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:text-zinc-900 dark:hover:text-white transition-all"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
          <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-white rounded-full animate-spin" />
        </main>
      }
    >
      <CancelContent />
    </Suspense>
  );
}
