"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Loader2, Megaphone, Users, CreditCard, ShieldCheck, Check, Lock, ArrowLeft, Globe } from "lucide-react";
import { getFriendlyErrorMessage } from "@/lib/friendly-errors";
import toast from "react-hot-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { BetaReaderManager } from "./BetaReaderManager";

interface BetaReader {
  id: string;
  createdAt: string;
  user?: {
    id: string;
    username: string;
    displayName: string | null;
  };
}

type PromotionStep = 'select-tier' | 'payment-method' | 'payment-form' | 'uddokta-confirm' | 'processing' | 'success';

export function AuthorStoryTools({ storyId }: { storyId: string }) {
  const [chapterNumber, setChapterNumber] = useState(1);
  const [releaseDateTime, setReleaseDateTime] = useState("");
  const [promotionTier, setPromotionTier] = useState("FEATURED");
  const [promotionDuration, setPromotionDuration] = useState(7);
  const [customBudget, setCustomBudget] = useState(100);
  const [betaReaders, setBetaReaders] = useState<BetaReader[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const { dbUser } = useAuth();
  const isPro = dbUser && ["PRO", "CREATOR"].includes(dbUser.membershipTier?.toUpperCase() || "");

  // Payment flow states
  const [promotionStep, setPromotionStep] = useState<PromotionStep>('select-tier');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentProgressText, setPaymentProgressText] = useState('');
  const [warningMsg, setWarningMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadBetaReaders = async () => {
      const res = await fetch(`/api/stories/${storyId}/beta-readers`);
      if (res.ok) {
        const data = await res.json();
        setBetaReaders(data.betaReaders || []);
      }
    };

    loadBetaReaders();
  }, [storyId]);

  async function post(path: string, body: unknown, success: string) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Request failed");
    toast.success(success);
    return data;
  }

  const scheduleChapter = async () => {
    setLoading("schedule");
    try {
      await post(`/api/stories/${storyId}/schedule`, { chapterNumber, releaseDateTime }, "Chapter scheduled");
      setReleaseDateTime("");
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, "Failed to schedule chapter. Please try again."));
    } finally {
      setLoading(null);
    }
  };

  const getDailyRate = () => {
    if (promotionTier === 'FEATURED') return 50;
    if (promotionTier === 'TRENDING') return 30;
    return customBudget;
  };

  const getTotalCost = () => getDailyRate() * promotionDuration;

  const promoteStory = async () => {
    if (!senderNumber.trim()) {
      toast.error('Please enter your bkash / Nagad sender mobile number');
      return;
    }
    if (!transactionId.trim()) {
      toast.error('Please enter your payment Transaction ID');
      return;
    }

    setPromotionStep('processing');

    const steps = [
      'Packaging promotion payment credentials...',
      'Auditing Sender Mobile Number format...',
      'Connecting to BookVerse promotion ledger...',
      'Publishing pending promotion to administrative queue...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setPaymentProgressText(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const res = await fetch("/api/story-promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId,
          tier: promotionTier,
          duration: promotionDuration,
          customBudget: promotionTier === "PROMOTED" ? customBudget : undefined,
          senderNumber: senderNumber.trim(),
          transactionId: transactionId.trim(),
        }),
      });

      if (res.ok) {
        setPromotionStep('success');
        toast.success("✨ Promotion payment receipt submitted for verification!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to submit promotion payment");
        setPromotionStep('payment-form');
      }
    } catch (error) {
      toast.error("Payment verification submission failure");
      setPromotionStep('payment-form');
    }
  };

  const handleUddoktaPromotion = async () => {
    setPromotionStep('processing');
    setPaymentProgressText('Connecting to UddoktaPay secure gateway...');

    try {
      const res = await fetch('/api/payment/uddokta/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PROMOTION',
          amount: getTotalCost(),
          metadata: {
            storyId,
            tier: promotionTier,
            duration: String(promotionDuration),
            customBudget: promotionTier === 'PROMOTED' ? String(customBudget) : undefined,
          },
        }),
      });

      const data = await res.json();

      if (res.ok && data.payment_url) {
        setPaymentProgressText('Redirecting to UddoktaPay...');
        window.location.href = data.payment_url;
      } else {
        toast.error(data.error || 'Failed to create payment session');
        setPromotionStep('payment-method');
      }
    } catch (error) {
      toast.error('Failed to connect to payment gateway');
      setPromotionStep('payment-method');
    }
  };

  const resetPromotion = () => {
    setPromotionStep('select-tier');
    setSenderNumber('');
    setTransactionId('');
    setWarningMsg(null);
    setPaymentProgressText('');
  };

  return (
    <section className="mb-12 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-zinc-100 dark:bg-zinc-900">
        {/* Schedule Chapter */}
        <div className="bg-white dark:bg-zinc-950 p-6 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <CalendarClock className="h-4 w-4" />
            Schedule Chapter
          </div>
          <input type="number" min={1} value={chapterNumber} onChange={(e) => setChapterNumber(Number(e.target.value))} className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs" />
          <input type="datetime-local" value={releaseDateTime} onChange={(e) => setReleaseDateTime(e.target.value)} className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs" />
          <button onClick={scheduleChapter} disabled={loading === "schedule" || !isPro} className="w-full px-3 py-2 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2">
            {!isPro && <Lock className="w-3 h-3" />}
            {loading === "schedule" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Schedule"}
          </button>
          {!isPro && <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-center mt-2">PRO Plan Required</p>}
        </div>

        <BetaReaderManager storyId={storyId} betaReaders={betaReaders} setBetaReaders={setBetaReaders} />

        {/* Paid Promotion — Full Payment Flow */}
        <div className="bg-white dark:bg-zinc-950 p-6 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <Megaphone className="h-4 w-4" />
            Paid Promotion
          </div>

          {/* Step: Processing */}
          {promotionStep === 'processing' && (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-900 dark:text-white" />
              <div className="space-y-1 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Processing...</p>
                <p className="text-[9px] text-zinc-400 font-medium italic animate-pulse">{paymentProgressText}</p>
              </div>
            </div>
          )}

          {/* Step: Success */}
          {promotionStep === 'success' && (
            <div className="flex flex-col items-center justify-center py-6 space-y-4 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 animate-bounce">
                <Check className="w-5 h-5" />
              </div>
              <div className="space-y-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-500">Receipt Submitted</p>
                <p className="text-[9px] text-zinc-400 leading-relaxed max-w-[220px] mx-auto">
                  Your <span className="font-bold text-zinc-600 dark:text-zinc-300">{promotionTier}</span> promotion payment is queued for admin verification. Mobile: <span className="font-mono font-bold text-zinc-600 dark:text-zinc-300">{senderNumber}</span>
                </p>
              </div>
              <button onClick={resetPromotion} className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors underline underline-offset-4">
                Submit Another
              </button>
            </div>
          )}

          {/* Step: Select Tier */}
          {promotionStep === 'select-tier' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">Promotion Tier</label>
                <select value={promotionTier} onChange={(e) => setPromotionTier(e.target.value)} className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs">
                  <option value="FEATURED">Featured (৳50/day — Recommended first)</option>
                  <option value="PROMOTED">Promoted (Custom/day — Spotlight)</option>
                  <option value="TRENDING">Trending (৳30/day — Stories page top)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">Duration (Days)</label>
                <input type="number" min={1} value={promotionDuration} onChange={(e) => setPromotionDuration(Number(e.target.value))} className="w-full rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs" />
              </div>

              {promotionTier === "PROMOTED" && (
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-indigo-500 block">Custom Budget Per Day (Taka)</label>
                  <input type="number" min={10} value={customBudget} onChange={(e) => setCustomBudget(Number(e.target.value))} className="w-full rounded border border-indigo-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs outline-none focus:border-indigo-500" />
                </div>
              )}

              <div className="text-[9px] text-zinc-400 space-y-1 font-medium bg-zinc-50/50 dark:bg-zinc-900/20 p-3 rounded-lg border border-zinc-100/50 dark:border-zinc-800/40">
                <p className="font-bold text-zinc-500">Tier Details:</p>
                {promotionTier === "FEATURED" && <p>• <span className="font-mono font-bold text-zinc-650 dark:text-zinc-300">৳50/day</span> × {promotionDuration} day(s) = <span className="font-mono font-bold text-zinc-650 dark:text-zinc-300">৳{50 * promotionDuration}</span>. Prioritized first inside the &quot;Recommended For You&quot; section.</p>}
                {promotionTier === "TRENDING" && <p>• <span className="font-mono font-bold text-zinc-650 dark:text-zinc-300">৳30/day</span> × {promotionDuration} day(s) = <span className="font-mono font-bold text-zinc-650 dark:text-zinc-300">৳{30 * promotionDuration}</span>. Placed at the top of the All Stories list.</p>}
                {promotionTier === "PROMOTED" && <p>• <span className="font-mono font-bold text-zinc-650 dark:text-zinc-300">৳{customBudget}/day</span> × {promotionDuration} day(s) = <span className="font-mono font-bold text-zinc-650 dark:text-zinc-300">৳{customBudget * promotionDuration}</span>. Displayed in homepage Spotlight Reads. Higher budget and quality rank highest.</p>}
              </div>

              <button
                onClick={() => setPromotionStep('payment-method')}
                className="w-full px-3 py-2.5 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest transition-all hover:opacity-90 shadow-sm flex items-center justify-center gap-2"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Proceed to Payment — ৳{getTotalCost()}
              </button>
            </div>
          )}

          {/* Step: Payment Method Selection */}
          {promotionStep === 'payment-method' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-1">
                <CreditCard className="w-3.5 h-3.5" />
                Select Payment Option
              </div>

              {warningMsg && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 text-[9px] font-bold uppercase tracking-wider text-center">
                  ⚠️ {warningMsg}
                </div>
              )}

              {/* Option 1: bkash/Nagad Manual */}
              <button
                type="button"
                onClick={() => { setWarningMsg(null); setPromotionStep('payment-form'); }}
                className="w-full p-3.5 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white rounded-lg text-left transition-all bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center gap-3 group"
              >
                <div className="p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-md font-bold text-[9px] h-7 w-7 flex items-center justify-center shrink-0">1</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white font-mono">Direct Manual bkash / Nagad</p>
                  <p className="text-[8px] text-zinc-400 font-medium italic">Submit credentials for manual wallet transfer</p>
                </div>
              </button>

              {/* Option 2: UddoktaPay */}
              <button
                type="button"
                onClick={() => { setWarningMsg(null); setPromotionStep('uddokta-confirm'); }}
                className="w-full p-3.5 border border-zinc-100 dark:border-zinc-800 hover:border-emerald-500/50 rounded-lg text-left transition-all bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 flex items-center gap-3 group"
              >
                <div className="p-2 bg-emerald-500 text-white rounded-md font-bold text-[9px] h-7 w-7 flex items-center justify-center shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Pay with UddoktaPay</p>
                  <p className="text-[8px] text-zinc-400 font-medium italic">bKash, Nagad, Rocket, Cards — Instant</p>
                </div>
                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[7px] font-bold uppercase tracking-wider rounded-full shrink-0">
                  Instant
                </span>
              </button>

              <button onClick={() => setPromotionStep('select-tier')} className="w-full text-center text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors py-1">
                ← Back to Tier Selection
              </button>
            </div>
          )}

          {/* Step: UddoktaPay Confirmation */}
          {promotionStep === 'uddokta-confirm' && (
            <div className="space-y-3">
              <div className="bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200/50 dark:border-emerald-500/20 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">UddoktaPay Checkout</p>
                </div>
                <p className="text-[9px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  You will be redirected to pay <span className="font-bold text-zinc-900 dark:text-white">৳{getTotalCost()}</span> for your <span className="font-bold text-zinc-900 dark:text-white">{promotionTier}</span> promotion ({promotionDuration} days). Payment is verified instantly.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPromotionStep('payment-method')}
                  className="flex-1 py-2 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 text-[9px] font-bold uppercase tracking-widest rounded-lg border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 text-center"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleUddoktaPromotion}
                  className="flex-1 py-2 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all hover:bg-emerald-600 text-center flex items-center justify-center gap-1.5"
                >
                  <Globe className="w-3 h-3" />
                  Pay ৳{getTotalCost()}
                </button>
              </div>
            </div>
          )}

          {/* Step: Payment Form (bkash/Nagad Manual) */}
          {promotionStep === 'payment-form' && (
            <div className="space-y-3">
              {/* Order Summary */}
              <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Promotion</span>
                  <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded ${
                    promotionTier === 'FEATURED' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                    promotionTier === 'TRENDING' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' :
                    'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                  }`}>{promotionTier}</span>
                </div>
                <div className="flex justify-between items-baseline border-t border-zinc-100 dark:border-zinc-800 pt-2">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Total</span>
                  <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">৳{getTotalCost()}</span>
                </div>
                <p className="text-[8px] text-zinc-400 italic">৳{getDailyRate()}/day × {promotionDuration} day(s)</p>
              </div>

              {/* Payment Instructions */}
              <div className="bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 space-y-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-400">Payment Instructions</p>
                <p className="text-[9px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Send Money (Personal bKash or Nagad) of <span className="font-bold text-zinc-900 dark:text-white">৳{getTotalCost()} BDT</span> to:
                </p>
                <div className="p-2 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-lg font-mono text-xs text-center font-bold tracking-widest select-all border border-zinc-200 dark:border-zinc-800">
                  01799269699
                </div>
                <p className="text-[8px] text-zinc-400 italic">
                  After transfer, submit both your sender number and Transaction ID below.
                </p>
              </div>

              {/* Sender Number */}
              <div className="space-y-1">
                <label className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 ml-0.5">Your bkash/Nagad Sender Number</label>
                <input
                  type="text"
                  value={senderNumber}
                  onChange={e => setSenderNumber(e.target.value)}
                  placeholder="e.g. 017XXXXXXXX"
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-lg outline-none focus:border-zinc-900 dark:focus:border-white text-xs font-mono text-center tracking-wider text-zinc-900 dark:text-white transition-colors"
                />
              </div>

              {/* Transaction ID */}
              <div className="space-y-1">
                <label className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 ml-0.5">Payment Transaction ID (TxnID)</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  placeholder="e.g. A1B2C3D4E5"
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-lg outline-none focus:border-zinc-900 dark:focus:border-white text-xs font-mono text-center tracking-wider text-zinc-900 dark:text-white uppercase transition-colors"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[8px] text-zinc-400 font-medium">
                <Lock className="w-3 h-3 text-zinc-300 shrink-0" />
                Your payment details are secure and encrypted.
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPromotionStep('payment-method')}
                  className="flex-1 py-2 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 text-[9px] font-bold uppercase tracking-widest rounded-lg border border-zinc-100 dark:border-zinc-800 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 text-center"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={promoteStory}
                  className="flex-1 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all hover:opacity-90 text-center flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Complete Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
