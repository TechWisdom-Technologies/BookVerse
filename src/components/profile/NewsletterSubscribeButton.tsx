"use client";

import { useState } from "react";
import { Mail, Loader2, Check } from "lucide-react";
import { getFriendlyErrorMessage } from "@/lib/friendly-errors";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface NewsletterSubscribeButtonProps {
  authorId: string;
  initialIsSubscribed: boolean;
}

export function NewsletterSubscribeButton({ authorId, initialIsSubscribed }: NewsletterSubscribeButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggleSubscribe = async () => {
    try {
      setIsLoading(true);
      const action = isSubscribed ? "unsubscribe" : "subscribe";
      
      const res = await fetch("/api/author/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId, action }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Please sign in to subscribe");
          return;
        }
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update subscription");
      }

      setIsSubscribed(!isSubscribed);
      toast.success(
        !isSubscribed
          ? "Successfully subscribed to newsletter! 🎉"
          : "Unsubscribed from newsletter."
      );
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(getFriendlyErrorMessage(error, "Failed to update subscription. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <button
        onClick={handleToggleSubscribe}
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded text-[10px] font-bold uppercase tracking-widest transition-all bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        )}
        Subscribed
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleSubscribe}
      disabled={isLoading}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded text-[10px] font-bold uppercase tracking-widest transition-all bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Mail className="h-3.5 w-3.5" />
      )}
      Subscribe
    </button>
  );
}
