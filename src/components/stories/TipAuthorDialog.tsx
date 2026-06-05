"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Coffee, Loader2, X, Heart, Globe } from "lucide-react";
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
  const [paymentMode, setPaymentMode] = useState<'select' | 'manual' | 'uddokta'>('select');

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;
  const isAmountValid = finalAmount && finalAmount >= 1;

  const handleManualCheckout = async () => {
    if (!isAmountValid) {
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
      resetStates();
    } catch (error: any) {
      toast.error(getFriendlyErrorMessage(error, "Failed to submit payment. Please try again."));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUddoktaCheckout = async () => {
    if (!isAmountValid) {
      toast.error("Minimum tip is ৳1 Taka");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch('/api/payment/uddokta/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'TIP',
          amount: finalAmount,
          metadata: {
            receiverId: authorId,
            storyId: storyId || '',
            message: message.trim() || '',
          },
        }),
      });

      const data = await res.json();

      if (res.ok && data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        toast.error(data.error || 'Failed to create payment session');
      }
    } catch (error) {
      toast.error('Failed to connect to payment gateway');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetStates = () => {
    setSenderNumber("");
    setTransactionId("");
    setMessage("");
    setCustomAmount("");
    setPaymentMode('select');
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetStates(); }}>
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
            Send a tip to show appreciation for their incredible work.
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

            {/* Payment Method Selection */}
            {isAmountValid && paymentMode === 'select' && (
              <div className="space-y-2.5 border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Choose Payment Method</p>
                
                {/* UddoktaPay Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('uddokta')}
                  className="w-full p-3 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-400 dark:hover:border-emerald-500/50 rounded-xl text-left transition-all bg-white dark:bg-zinc-900 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 flex items-center gap-3"
                >
                  <div className="p-2 bg-emerald-500 text-white rounded-lg shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Pay with UddoktaPay</p>
                    <p className="text-[9px] text-zinc-400 italic">bKash, Nagad, Rocket, Cards — Instant verification</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[8px] font-bold uppercase tracking-wider rounded-full shrink-0">
                    Instant
                  </span>
                </button>

                {/* Manual Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('manual')}
                  className="w-full p-3 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 rounded-xl text-left transition-all bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center gap-3"
                >
                  <div className="p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg shrink-0">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Direct Manual bKash / Nagad</p>
                    <p className="text-[9px] text-zinc-400 italic">Submit TxnID for admin verification</p>
                  </div>
                </button>
              </div>
            )}

            {/* UddoktaPay Confirmation */}
            {isAmountValid && paymentMode === 'uddokta' && (
              <div className="space-y-3 border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-3 animate-fade-in">
                <div className="bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200/50 dark:border-emerald-500/20 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">UddoktaPay Checkout</p>
                  </div>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    You will be redirected to pay <span className="font-bold text-zinc-900 dark:text-white">৳{finalAmount?.toLocaleString()}</span> to support <span className="font-bold text-zinc-900 dark:text-white">{authorName}</span>. Payment is verified instantly.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('select')}
                    className="flex-1 py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-center"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleUddoktaCheckout}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Globe className="h-4 w-4" />
                    )}
                    {isProcessing ? "Processing..." : `Pay ৳${finalAmount?.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}

            {/* Manual Payment Section */}
            {isAmountValid && paymentMode === 'manual' && (
              <div className="space-y-3.5 border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-3 text-zinc-900 dark:text-zinc-100 animate-fade-in">
                <button
                  type="button"
                  onClick={() => setPaymentMode('select')}
                  className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  ← Back to Method Selection
                </button>

                <div className="bg-[#fcf8f2] dark:bg-amber-950/20 border border-[#f5ebd6] dark:border-amber-500/20 rounded-xl p-3 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">bKash / Nagad instructions</span>
                  <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed font-medium">
                    Send Money (Personal) of <span className="font-bold text-base text-amber-950 dark:text-amber-200">৳{finalAmount?.toLocaleString()} BDT</span> to:
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

                <button
                  onClick={handleManualCheckout}
                  disabled={isProcessing || !isAmountValid}
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
            )}

            {/* Show amount prompt if no amount selected yet */}
            {!isAmountValid && paymentMode !== 'select' && (
              <p className="text-center text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                Please select or enter a tip amount above first.
              </p>
            )}
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
