"use client";

import { useState } from "react";
import { Mail, Loader2, Check } from "lucide-react";
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
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <button
        onClick={handleToggleSubscribe}
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A] px-6 py-3 text-sm font-bold text-zinc-900 dark:text-white transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 active:scale-[0.98] shadow-sm"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4 text-emerald-500" />
        )}
        Subscribed
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleSubscribe}
      disabled={isLoading}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all hover:bg-orange-600 hover:shadow-lg hover:shadow-brand/20 active:scale-[0.98]"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Mail className="h-4 w-4" />
      )}
      Subscribe to Newsletter
    </button>
  );
}
