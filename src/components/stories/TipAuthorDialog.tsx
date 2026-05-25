"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Coffee, Loader2, X, Heart } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getFriendlyErrorMessage } from "@/lib/friendly-errors";
import toast from "react-hot-toast";

interface TipAuthorDialogProps {
  authorId: string;
  authorName: string;
  storyId?: string;
}

const PRESET_AMOUNTS = [3, 5, 10];

export function TipAuthorDialog({ authorId, authorName, storyId }: TipAuthorDialogProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    
    if (!finalAmount || finalAmount < 1) {
      toast.error("Minimum tip is $1.00");
      return;
    }

    setIsProcessing(true);
    try {
      const token = await user?.getIdToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers,
        body: JSON.stringify({
          amount: Math.round(finalAmount * 100), // convert to cents
          receiverId: authorId,
          storyId,
          message: message.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Checkout failed");

      // Redirect to Stripe
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(getFriendlyErrorMessage(error, "Failed to initiate checkout. Please try again."));
      setIsProcessing(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-indigo-400">
          <Coffee className="h-4 w-4" />
          Tip Author
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-950 dark:border dark:border-zinc-800 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <Dialog.Title className="flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            Support {authorName}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Send a tip to show your appreciation for their work.
          </Dialog.Description>

          <div className="mt-6 space-y-5">
            {/* Amount Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-300">
                Select Amount (USD)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount("");
                    }}
                    className={`rounded-xl border py-3 text-sm font-semibold transition-all ${
                      amount === amt && !customAmount
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-300"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-500/50"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-xs text-zinc-400 uppercase font-medium tracking-wider">or</span>
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="relative mt-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount(0);
                  }}
                  className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-8 pr-4 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                />
              </div>
            </div>

            {/* Optional Message */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-300">
                Leave a message <span className="text-zinc-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Thanks for the great story!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing || (!amount && (!customAmount || parseFloat(customAmount) < 1))}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Coffee className="h-5 w-5" />
              )}
              {isProcessing ? "Processing..." : `Checkout with Stripe`}
            </button>
            <p className="text-center text-xs text-zinc-400">Secure payment powered by Stripe</p>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
