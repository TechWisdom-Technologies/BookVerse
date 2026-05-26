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

const PRESET_AMOUNTS = [30, 50, 150];

export function TipAuthorDialog({ authorId, authorName, storyId }: TipAuthorDialogProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number>(30);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [message, setMessage] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    
    if (!finalAmount || finalAmount < 1) {
      toast.error("Minimum tip is ৳1 Taka");
      return;
    }

    if (!senderNumber.trim()) {
      toast.error("Please enter your bKash / Nagad sender number");
      return;
    }

    if (!transactionId.trim()) {
      toast.error("Please enter your payment Transaction ID (TxnID)");
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

      const res = await fetch(`/api/tips/${authorId}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          amount: finalAmount,
          receiverId: authorId,
          storyId,
          message: message.trim() || undefined,
          senderNumber: senderNumber.trim(),
          transactionId: transactionId.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Checkout failed");

      toast.success("✨ Tip receipt submitted for administrative verification!");
      setIsOpen(false);
      // Reset states
      setSenderNumber("");
      setTransactionId("");
      setMessage("");
      setCustomAmount("");
    } catch (error: any) {
      toast.error(getFriendlyErrorMessage(error, "Failed to submit payment. Please try again."));
    } finally {
      setIsProcessing(false);
    }
  };  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-indigo-400">
          <Coffee className="h-4 w-4" />
          Tip Author
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-5 shadow-2xl dark:bg-zinc-950 dark:border dark:border-zinc-800 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <Dialog.Title className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            Support {authorName}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Send a direct manual tip to show appreciation for their incredible work.
          </Dialog.Description>

          <div className="mt-4 space-y-4">
            {/* Amount Selection */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Select Amount (Taka)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount("");
                    }}
                    className={`rounded-xl border py-2.5 text-xs font-bold tracking-wide transition-all ${
                      amount === amt && !customAmount
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-300"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-500/50"
                    }`}
                  >
                    ৳{amt}
                  </button>
                ))}
              </div>
              
              <div className="mt-2.5 flex items-center gap-2.5">
                <div className="h-[1px] flex-1 bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">or custom amount</span>
                <div className="h-[1px] flex-1 bg-zinc-200 dark:bg-zinc-800" />
              </div>
              
              <div className="relative mt-2">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-bold">৳</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter custom Taka amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setAmount(0);
                  }}
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-7 pr-4 text-xs font-medium text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                />
              </div>
            </div>

            {/* Optional Message */}
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Leave a message <span className="text-zinc-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="Thanks for the great story!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </div>

            {/* Manual Payment Section */}
            {((customAmount && parseFloat(customAmount) >= 1) || (!customAmount && amount >= 1)) && (
              <div className="space-y-3.5 border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-3 text-zinc-900 dark:text-zinc-100">
                <div className="bg-[#fcf8f2] dark:bg-amber-950/20 border border-[#f5ebd6] dark:border-amber-500/20 rounded-xl p-3 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">bKash / Nagad instructions</span>
                  <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed font-medium">
                    Send Money (Personal) of <span className="font-bold text-base text-amber-950 dark:text-amber-200">৳{((customAmount ? parseFloat(customAmount) : amount)).toLocaleString()} BDT</span> to:
                  </p>
                  <div className="p-2 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-lg font-mono text-sm text-center font-bold tracking-widest select-all border border-zinc-200 dark:border-zinc-800">
                    01799269699
                  </div>
                  <p className="text-[9px] text-amber-700 dark:text-amber-400 italic">
                    Submit both your sender number and payment TxnID below for admin verification.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Sender mobile number */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Sender Number</label>
                    <input 
                      type="text" 
                      value={senderNumber}
                      onChange={e => setSenderNumber(e.target.value)}
                      placeholder="e.g. 017XXXXXXXX"
                      required
                      className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs font-mono text-center tracking-wider text-zinc-950 dark:text-zinc-100"
                    />
                  </div>

                  {/* Transaction ID */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">TxnID (TxID)</label>
                    <input 
                      type="text" 
                      value={transactionId}
                      onChange={e => setTransactionId(e.target.value)}
                      placeholder="e.g. A1B2C3D4E5"
                      required
                      className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs font-mono text-center tracking-wider text-zinc-950 dark:text-zinc-100 uppercase"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={isProcessing || (!amount && (!customAmount || parseFloat(customAmount) < 1))}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Coffee className="h-4 w-4" />
              )}
              {isProcessing ? "Processing..." : `Send Manual Tip`}
            </button>
            <p className="text-center text-[9px] text-zinc-450 dark:text-zinc-500 font-medium">Verify direct mobile payments (bkash/Nagad), confirm txnID, and authorize tip.</p>
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
