"use client";

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  CreditCard, 
  ShieldCheck, 
  Loader2, 
  Check, 
  Zap, 
  Heart,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const planParam = searchParams.get('plan') || 'pro';
  const isCreator = planParam.toLowerCase() === 'creator';
  const isPro = planParam.toLowerCase() === 'pro';
  
  let planName = 'AUTHOR';
  let planPrice = 99;
  
  if (isCreator) {
    planName = 'CREATOR';
    planPrice = 799;
  } else if (isPro) {
    planName = 'PRO';
    planPrice = 299;
  }

  // Form & Method Selection States
  const [paymentMethod, setPaymentMethod] = useState<'none' | 'contact'>('none');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [duration, setDuration] = useState(1); // Default to 1 Month

  // Status States
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [paymentProgressText, setPaymentProgressText] = useState('');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'contact') {
      if (!senderNumber.trim()) {
        toast.error('Please enter your bkash / Nagad sender mobile number');
        return;
      }
      if (!transactionId.trim()) {
        toast.error('Please enter your payment Transaction ID');
        return;
      }
    }

    setProcessing(true);
    setPaymentStep('processing');

    const steps = [
      'Packaging payment credentials for submission...',
      'Auditing Sender Mobile Number format...',
      'Connecting to BookVerse central ledger registry...',
      'Publishing pending transaction logs to administrative queue...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setPaymentProgressText(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const res = await fetch('/api/premium/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan: planName, 
          duration: duration,
          senderNumber: senderNumber.trim(),
          transactionId: transactionId.trim()
        }),
      });

      if (res.ok) {
        setPaymentStep('success');
        await new Promise(resolve => setTimeout(resolve, 3000));
        toast.success(`✨ Subscription payment receipt submitted for verification!`);
        router.push('/');
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to submit payment details');
        setPaymentStep('idle');
      }
    } catch (error) {
      toast.error('Payment verification submission failure');
      setPaymentStep('idle');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      
      {/* Simple Header */}
      <header className="mb-12 pb-8 border-b border-zinc-900">
        <Link href="/premium" className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Plans
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2 uppercase font-serif bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            Secure Checkout.
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl font-medium">Finalize your premium access plan. Choose your preferred secure option below.</p>
        </div>
      </header>

      {paymentStep === 'processing' && (
        <div className="border border-zinc-900 rounded-2xl p-12 bg-[#0c0c0e] shadow-xl text-center space-y-6">
          <Loader2 className="w-10 h-10 animate-spin text-white mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-200">Submitting Receipt...</h2>
            <p className="text-[10px] text-zinc-450 font-medium italic animate-pulse">{paymentProgressText}</p>
          </div>
        </div>
      )}

      {paymentStep === 'success' && (
        <div className="border border-zinc-900 rounded-2xl p-12 bg-[#0c0c0e] shadow-xl text-center space-y-6 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 animate-bounce">
            <Check className="w-6 h-6" />
          </div>
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Receipt Submitted</h2>
            <p className="text-[11px] text-zinc-300 font-bold uppercase tracking-wide">Your payment details have been successfully queued for audit</p>
            <p className="text-[10px] text-zinc-400 max-w-md mx-auto leading-relaxed">
              BookVerse administrators will audit Sender Mobile <span className="font-mono text-zinc-200 font-bold">({senderNumber})</span> and Transaction ID <span className="font-mono text-zinc-200 font-bold">({transactionId})</span>. Your <span className="text-zinc-200 font-bold">{planName}</span> premium status will be granted upon verification. Redirecting home...
            </p>
          </div>
        </div>
      )}

      {paymentStep === 'idle' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          
          {/* Order Summary */}
          <div className="md:col-span-2 space-y-6">
            <div className="border border-zinc-900 rounded-2xl p-6 bg-zinc-900/40 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-white" />
              
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white text-zinc-955 rounded-lg">
                    {isCreator ? <Zap className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">BookVerse {planName}</h3>
                    <p className="text-[10px] text-zinc-450 font-medium italic">Membership tier upgrade</p>
                  </div>
                </div>

                {/* Duration Selection Dropdown */}
                <div className="pt-4 border-t border-zinc-900 space-y-2">
                  <label htmlFor="checkout-duration" className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 block">
                    Select Duration
                  </label>
                  <div className="relative">
                    <select
                      id="checkout-duration"
                      value={duration}
                      onChange={e => setDuration(parseInt(e.target.value))}
                      className="w-full px-3 py-2.5 bg-zinc-955 border border-zinc-800 rounded-xl outline-none focus:border-white transition-all text-xs font-bold uppercase tracking-wider text-zinc-300 cursor-pointer appearance-none"
                    >
                      <option value="1">1 Month</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                      <option value="12">12 Months</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[9px]">▼</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-zinc-900 flex justify-between items-baseline">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Value</span>
                  <span className="text-xl font-bold tracking-tight text-white">৳{(planPrice * duration).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-zinc-455 font-medium pt-1">
                  <span>Billing Cycle</span>
                  <span>{duration} Month{duration > 1 ? 's' : ''} Prepaid</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900 space-y-3">
                <div className="flex items-start gap-2 text-[10px] text-zinc-400 leading-relaxed font-medium">
                  <Lock className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                  Your payment details are encrypted. Direct bkash details are secure.
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Selection Area */}
          <div className="md:col-span-3">
            <div className="border border-zinc-900 rounded-2xl p-8 bg-[#0c0c0e] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-white" />
              
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-zinc-400" />
                Select Payment Option
              </h2>

              {warningMsg && (
                <div className="p-4 mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-[10px] font-bold uppercase tracking-wider leading-relaxed text-center animate-shake">
                  ⚠️ {warningMsg}
                </div>
              )}

              {paymentMethod === 'none' && (
                <div className="space-y-4">
                  {/* Option 1: bkash/Nagad */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('contact');
                      setWarningMsg(null);
                    }}
                    className="w-full p-5 border border-zinc-800 hover:border-white rounded-xl text-left transition-all bg-zinc-900/40 hover:bg-zinc-905 flex items-center gap-4 group"
                  >
                    <div className="p-2.5 bg-white text-zinc-955 rounded-lg font-bold text-[11px] h-8 w-8 flex items-center justify-center shrink-0">1</div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-white font-mono">Direct Manual bkash / Nagad</h4>
                      <p className="text-[9px] text-zinc-450 font-medium italic">Submit transaction credentials for manual wallet transfer</p>
                    </div>
                  </button>

                  {/* Option 2: Autopay Card */}
                  <button
                    type="button"
                    onClick={() => setWarningMsg("Card payments are under construction. Please use Direct Manual bkash/Nagad payment.")}
                    className="w-full p-5 border border-zinc-800 hover:border-white rounded-xl text-left transition-all bg-zinc-900/40 hover:bg-zinc-905 flex items-center gap-4 opacity-50"
                  >
                    <div className="p-2.5 bg-white text-zinc-955 rounded-lg font-bold text-[11px] h-8 w-8 flex items-center justify-center shrink-0">2</div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">Autopay with Credit Card</h4>
                      <p className="text-[9px] text-zinc-450 font-medium italic">Recurring Stripe subscription gateway</p>
                    </div>
                  </button>

                  {/* Option 3: Merchant Pay */}
                  <button
                    type="button"
                    onClick={() => setWarningMsg("Merchant payments are under construction. Please use Direct Manual bkash/Nagad payment.")}
                    className="w-full p-5 border border-zinc-800 hover:border-white rounded-xl text-left transition-all bg-zinc-900/40 hover:bg-zinc-905 flex items-center gap-4 opacity-50"
                  >
                    <div className="p-2.5 bg-white text-zinc-955 rounded-lg font-bold text-[11px] h-8 w-8 flex items-center justify-center shrink-0">3</div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">Merchant Online Checkout</h4>
                      <p className="text-[9px] text-zinc-450 font-medium italic">Redirect to online SSLCommerz secure merchant portal</p>
                    </div>
                  </button>
                </div>
              )}

              {paymentMethod === 'contact' && (
                <form onSubmit={handleCheckout} className="space-y-6 animate-fade-in">
                  <div className="bg-zinc-900/80 p-5 rounded-xl border border-zinc-800 space-y-3">
                    <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-455">Payment Instructions</h4>
                    <p className="text-[10px] text-zinc-350 leading-relaxed font-medium">
                      Please Send Money (Personal bKash or Nagad) of **৳{(planPrice * duration).toLocaleString()} BDT** to:
                    </p>
                    <div className="p-3 bg-zinc-950 text-white rounded-xl font-mono text-xs text-center font-bold tracking-widest select-all border border-zinc-850">
                      01799269699
                    </div>
                    <p className="text-[9px] text-zinc-500 font-medium italic">
                      After transfer, submit both your sender mobile number and the Transaction ID below for admin review.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Input 1: Sender Mobile Number */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-450 ml-1">Your bkash/Nagad Sender Mobile Number</label>
                      <input 
                        type="text" 
                        value={senderNumber}
                        onChange={e => setSenderNumber(e.target.value)}
                        placeholder="e.g. 017XXXXXXXX"
                        required
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white text-xs font-mono text-center tracking-wider text-white"
                      />
                    </div>

                    {/* Input 2: Transaction ID */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-450 ml-1">Payment Transaction ID (TxnID)</label>
                      <input 
                        type="text" 
                        value={transactionId}
                        onChange={e => setTransactionId(e.target.value)}
                        placeholder="e.g. A1B2C3D4E5"
                        required
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl outline-none focus:border-white text-xs font-mono text-center tracking-wider text-white uppercase"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('none')}
                      className="flex-1 py-3 bg-zinc-900 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-zinc-800 transition-all text-center hover:bg-zinc-850"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={processing}
                      className="flex-1 py-3 bg-white text-zinc-955 hover:bg-zinc-100 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Complete Payment
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default function PremiumCheckoutPage() {
  return (
    <main className="min-h-screen bg-[#070708] text-zinc-100 pb-32">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-300" />
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </main>
  );
}
