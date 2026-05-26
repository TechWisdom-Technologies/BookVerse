"use client";

import { useState, useEffect } from 'react';
import { 
  Gift, 
  ArrowLeft, 
  Clock, 
  Loader2, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Zap, 
  Heart,
  CreditCard,
  ShieldCheck,
  Mail,
  Ticket,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface GiftCard {
  id: string;
  code: string;
  tier: 'PRO' | 'CREATOR';
  duration: number;
  value: number;
  status: string;
  recipientEmail?: string;
  createdAt: string;
}

export default function GiftsPage() {
  const [gifts, setGifts] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Purchase Form States
  const [purchaseTier, setPurchaseTier] = useState<'PRO' | 'CREATOR'>('PRO');
  const [duration, setDuration] = useState(3); // Default 3 Months
  const [recipientEmail, setRecipientEmail] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  // Redemption Form States
  const [redeemCode, setRedeemCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  // Mock Stripe Payment Dialog States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'none' | 'contact'>('none');
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'success'>('idle');
  const [paymentProgressText, setPaymentProgressText] = useState('');

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const res = await fetch('/api/gift-memberships');
      if (res.ok) {
        const data = await res.json();
        setGifts(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch gifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail.trim()) {
      toast.error('Recipient email address is required');
      return;
    }
    setPaymentStep('idle');
    setPaymentMethod('none');
    setWarningMsg(null);
    setSenderNumber('');
    setTransactionId('');
    setShowPaymentModal(true);
  };

  const handleMockPayment = async () => {
    if (paymentMethod === 'contact' && !senderNumber.trim()) {
      toast.error('Please enter your bkash / Nagad sender mobile number');
      return;
    }
    if (paymentMethod === 'contact' && !transactionId.trim()) {
      toast.error('Please enter your payment Transaction ID (TxnID)');
      return;
    }
    
    setPurchasing(true);
    setPaymentStep('processing');
    
    const steps = [
      'Initiating secure bkash/Nagad direct clearing tunnel...',
      'Verifying transaction status with centralized ledgers...',
      'Securing cryptographic token hash for gift allocation...',
      'Finalizing database ledger entry and registering code...',
    ];

    for (let i = 0; i < steps.length; i++) {
      setPaymentProgressText(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 850));
    }

    try {
      const res = await fetch('/api/gift-memberships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: recipientEmail.trim(),
          tier: purchaseTier,
          duration,
          senderNumber: senderNumber.trim(),
          transactionId: transactionId.trim(),
        }),
      });

      if (res.ok) {
        setPaymentStep('success');
        await new Promise(resolve => setTimeout(resolve, 1200));
        setShowPaymentModal(false);
        toast.success(`✨ Receipt submitted for verification! The gift code will activate once approved by our admin team.`);
        setRecipientEmail('');
        setSenderNumber('');
        setTransactionId('');
        setCardNumber('');
        setCardExpiry('');
        setCardCvc('');
        setCardName('');
        fetchGifts();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to complete transaction');
        setPaymentStep('idle');
      }
    } catch (error) {
      toast.error('Network connection failure');
      setPaymentStep('idle');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemCode.trim()) {
      toast.error('Please enter a valid gift code');
      return;
    }

    setRedeeming(true);
    try {
      const res = await fetch('/api/gift-memberships/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: redeemCode.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`✨ Success! Activated ${data.membershipTier} subscription!`);
        setRedeemCode('');
        fetchGifts();
      } else {
        toast.error(data.error || 'Invalid gift code or already redeemed');
      }
    } catch (error) {
      toast.error('Failed to process redemption');
    } finally {
      setRedeeming(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Gift invitation token copied to clipboard! 📋');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getTierPricing = (tier: 'PRO' | 'CREATOR') => {
    return tier === 'PRO' ? 499 : 999;
  };

  return (
    <main className="min-h-screen bg-[#070708] text-zinc-100 pb-36 relative overflow-hidden">
      
      {/* Decorative Luxury Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-900/20 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute top-48 right-1/4 w-96 h-96 bg-zinc-800/10 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-16 relative z-10">
        
        {/* Header Section */}
        <header className="mb-14 pb-8 border-b border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors duration-200">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight font-serif mb-2 bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                Gifting & Invite Tokens.
              </h1>
              <p className="text-xs text-zinc-400 max-w-xl font-medium leading-relaxed">
                Purchase secure gift invitation cards for friends, or claim incoming complimentary premium tiers immediately below.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-300 bg-zinc-900/80 px-5 py-3 border border-zinc-800 rounded-xl shadow-sm">
            <Gift className="w-4 h-4 text-zinc-400 animate-pulse" />
            Premium Gift Hub
          </div>
        </header>

        {/* Master Two-Column Gifting Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          
          {/* Purchase Gift Form Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="border border-zinc-900 rounded-2xl p-8 bg-[#0c0c0e] shadow-xl relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[4px] bg-white" />
              
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-450 mb-8 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-zinc-450" />
                Select Subscription Tier & Card details
              </h2>

              <form onSubmit={handlePurchaseSubmit} className="space-y-8">
                
                {/* Plan Tier Selection */}
                <div className="space-y-3">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-450 ml-1">Subscription Plan Level</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* PRO Tier Card */}
                    <button
                      type="button"
                      onClick={() => setPurchaseTier('PRO')}
                      className={`group relative flex items-start gap-4 p-5 border rounded-xl text-left transition-all duration-300 outline-none ${
                        purchaseTier === 'PRO'
                          ? 'border-white bg-zinc-900/40 shadow-sm' 
                          : 'border-zinc-850 hover:border-zinc-650 bg-transparent'
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg transition-all duration-350 ${
                        purchaseTier === 'PRO' 
                          ? 'bg-white text-zinc-900' 
                          : 'bg-zinc-900 text-zinc-500 group-hover:text-white'
                      }`}>
                        <Heart className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                          BookVerse PRO
                          <span className="text-[9px] font-mono font-normal text-zinc-400 bg-zinc-850 px-1.5 py-0.5 rounded font-medium">৳499/mo</span>
                        </div>
                        <p className="text-[10px] text-zinc-455 leading-normal font-medium italic">Unlimited reading logs, customizable spoiler tags, and direct author feedback tools.</p>
                      </div>
                    </button>

                    {/* CREATOR Tier Card */}
                    <button
                      type="button"
                      onClick={() => setPurchaseTier('CREATOR')}
                      className={`group relative flex items-start gap-4 p-5 border rounded-xl text-left transition-all duration-300 outline-none ${
                        purchaseTier === 'CREATOR'
                          ? 'border-white bg-zinc-900/40 shadow-sm' 
                          : 'border-zinc-850 hover:border-zinc-650 bg-transparent'
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg transition-all duration-350 ${
                        purchaseTier === 'CREATOR' 
                          ? 'bg-white text-zinc-900' 
                          : 'bg-zinc-900 text-zinc-500 group-hover:text-white'
                      }`}>
                        <Zap className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                          BookVerse CREATOR
                          <span className="text-[9px] font-mono font-normal text-zinc-400 bg-zinc-850 px-1.5 py-0.5 rounded font-medium">৳999/mo</span>
                        </div>
                        <p className="text-[10px] text-zinc-455 leading-normal font-medium italic">Creative analytics dashboard panels, exclusive newsletters, and author distribution feeds.</p>
                      </div>
                    </button>

                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Duration Selection Dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="duration" className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-450 ml-1">
                      Gift Code Duration
                    </label>
                    <div className="relative">
                      <select
                        id="duration"
                        value={duration}
                        onChange={e => setDuration(parseInt(e.target.value))}
                        className="w-full px-4 py-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl outline-none focus:border-white transition-all text-xs font-bold uppercase tracking-wider text-zinc-400 cursor-pointer appearance-none"
                      >
                        <option value="1">1 MONTH (৳{(getTierPricing(purchaseTier) * 1).toLocaleString()})</option>
                        <option value="3">3 MONTHS (৳{(getTierPricing(purchaseTier) * 3).toLocaleString()})</option>
                        <option value="6">6 MONTHS (৳{(getTierPricing(purchaseTier) * 6).toLocaleString()})</option>
                        <option value="12">12 MONTHS (৳{(getTierPricing(purchaseTier) * 12).toLocaleString()})</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[10px]">▼</div>
                    </div>
                  </div>

                  {/* Recipient Email Input Field */}
                  <div className="space-y-2">
                    <label htmlFor="recipientEmail" className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-450 ml-1">
                      Recipient Email Address
                    </label>
                    <input 
                      type="email"
                      id="recipientEmail"
                      value={recipientEmail}
                      onChange={e => setRecipientEmail(e.target.value)}
                      placeholder="e.g. friend@email.com"
                      required
                      className="w-full px-5 py-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl outline-none focus:border-white transition-all text-xs font-medium text-white placeholder-zinc-650"
                    />
                  </div>
                </div>

                {/* Purchase Button */}
                <button 
                  type="submit"
                  disabled={purchasing}
                  className="w-full py-4.5 bg-white text-zinc-950 hover:bg-zinc-100 text-[10px] font-bold uppercase tracking-[0.25em] disabled:opacity-50 transition-all flex items-center justify-center gap-2 rounded-xl shadow-sm duration-300"
                >
                  {purchasing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                      Allocating Secure Invite Card Token...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Buy Invite Code — ৳{(getTierPricing(purchaseTier) * duration).toLocaleString()} BDT
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

          {/* Redemption Form Column */}
          <div>
            <div className="border border-zinc-900 rounded-2xl p-8 bg-[#0c0c0e] text-white shadow-xl relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[4px] bg-zinc-800" />
              
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-450 mb-4 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-zinc-500" />
                Redeem a Code
              </h2>
              <p className="text-[10px] text-zinc-400 mb-6 leading-relaxed font-medium">
                Have an invitation token key? Input it below to activate your premium subscription access immediately!
              </p>

              <form onSubmit={handleRedeem} className="space-y-4">
                <input 
                  type="text" 
                  value={redeemCode}
                  onChange={e => setRedeemCode(e.target.value.toUpperCase())}
                  placeholder="GIFT-XXXX-XXXX"
                  required
                  className="w-full px-4 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center text-xs font-mono tracking-widest outline-none focus:border-white transition-all text-white placeholder-zinc-600"
                />

                <button 
                  type="submit"
                  disabled={redeeming}
                  className="w-full py-4 bg-white text-zinc-950 hover:bg-zinc-100 text-[10px] font-bold uppercase tracking-[0.2em] disabled:opacity-50 transition-all flex items-center justify-center gap-2 rounded-xl shadow-sm"
                >
                  {redeeming ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                      Redeeming token...
                    </>
                  ) : (
                    <>
                      Claim Membership
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Gift Registry Panel */}
        <section className="border border-zinc-900 rounded-2xl p-8 bg-[#0c0c0e] shadow-xl relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-white" />
          
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-450 mb-8 flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-400" />
            Your Purchased Gift Registry ({gifts.length})
          </h2>

          <div className="min-h-[220px]">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
              </div>
            ) : gifts.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-zinc-850 rounded-2xl bg-zinc-950/20 animate-fade-in">
                <Gift className="w-8 h-8 text-zinc-700 mx-auto mb-3 animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 italic">No purchased gift keys have been registered yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {gifts.map(gift => (
                  <div 
                    key={gift.id} 
                    className="relative group overflow-hidden rounded-2xl border border-zinc-850 bg-zinc-950 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Glassmorphism glow */}
                    <div className="absolute -inset-px bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                    
                    {/* Card notches matching dark background */}
                    <div className="absolute top-1/2 -left-3.5 w-7 h-7 rounded-full bg-[#070708] border border-zinc-850 -translate-y-1/2 hidden md:block" />
                    <div className="absolute top-1/2 -right-3.5 w-7 h-7 rounded-full bg-[#070708] border border-zinc-850 -translate-y-1/2 hidden md:block" />

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest leading-none block mb-1">Access Tier</span>
                          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            {gift.tier === 'CREATOR' ? <Zap className="w-4 h-4 text-zinc-400" /> : <Heart className="w-4 h-4 text-zinc-400" />}
                            BookVerse {gift.tier}
                          </span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full border text-[8px] font-bold uppercase tracking-widest ${
                          gift.status === 'PENDING' 
                            ? 'bg-amber-500/5 text-amber-500 border-amber-500/15' 
                            : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/15'
                        }`}>
                          {gift.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dashed border-zinc-900">
                        <div>
                          <span className="text-[8px] font-bold text-zinc-550 uppercase tracking-widest block mb-0.5">Value</span>
                          <span className="text-xs font-mono font-bold text-zinc-300">৳{gift.value.toLocaleString()} BDT</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-bold text-zinc-550 uppercase tracking-widest block mb-0.5">Duration</span>
                          <span className="text-xs font-bold text-zinc-300">{gift.duration} Months</span>
                        </div>
                      </div>

                      {gift.recipientEmail && (
                        <div className="flex items-center gap-2 pt-1 text-zinc-400">
                          <Mail className="w-3.5 h-3.5 text-zinc-550 shrink-0" />
                          <span className="text-[10px] font-medium truncate">Sent to: {gift.recipientEmail}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 bg-[#0c0c0e] p-2.5 rounded-xl border border-zinc-900">
                      <code className="flex-1 text-[10px] font-mono text-zinc-350 truncate select-all">{gift.code}</code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(gift.code)}
                        className="p-2 text-zinc-400 hover:text-white transition-colors"
                        title="Copy gift invitation code"
                      >
                        {copiedCode === gift.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Payment Overlay Modal Popup */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="border border-zinc-850 rounded-2xl p-8 bg-[#0c0c0e] shadow-2xl relative max-w-md w-full overflow-hidden text-white animate-scale-up">
            <div className="absolute top-0 left-0 w-full h-[4px] bg-white" />
            
            {paymentStep === 'idle' && (
              <>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-450 mb-6 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-zinc-400" />
                  Select Payment Option
                </h3>
                
                <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 text-center mb-6">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Total Payable</span>
                  <span className="text-2xl font-bold tracking-tight text-white">
                    ৳{(getTierPricing(purchaseTier) * duration).toLocaleString()} BDT
                  </span>
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block mt-1">
                    BookVerse {purchaseTier} Subscription ({duration} Months)
                  </span>
                </div>

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
                      className="w-full p-4 border border-zinc-800 hover:border-white rounded-xl text-left transition-all bg-zinc-900/40 hover:bg-zinc-900 flex items-center gap-3 animate-fade-in"
                    >
                      <div className="p-2 bg-white text-zinc-900 rounded-lg font-bold text-[10px] w-7 h-7 flex items-center justify-center shrink-0">1</div>
                      <div className="flex-1">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">Direct Manual bkash / Nagad</h4>
                        <p className="text-[9px] text-zinc-450 font-medium italic">Instant clearance via manual mobile wallet send money</p>
                      </div>
                    </button>

                    {/* Option 2: Autopay Card */}
                    <button
                      type="button"
                      onClick={() => setWarningMsg("we are working on it Please pay manually using Bkash/Nagad with this 01799269699")}
                      className="w-full p-4 border border-zinc-800 hover:border-white rounded-xl text-left transition-all bg-zinc-900/40 hover:bg-zinc-900 flex items-center gap-3"
                    >
                      <div className="p-2 bg-white text-zinc-900 rounded-lg font-bold text-[10px] w-7 h-7 flex items-center justify-center shrink-0">2</div>
                      <div className="flex-1">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">Autopay with Credit Card</h4>
                        <p className="text-[9px] text-zinc-450 font-medium italic">Recurring Stripe subscription gateway</p>
                      </div>
                    </button>

                    {/* Option 3: Merchant Pay */}
                    <button
                      type="button"
                      onClick={() => setWarningMsg("we are working on it Please pay manually using Bkash/Nagad with this 01799269699")}
                      className="w-full p-4 border border-zinc-800 hover:border-white rounded-xl text-left transition-all bg-zinc-900/40 hover:bg-zinc-900 flex items-center gap-3"
                    >
                      <div className="p-2 bg-white text-zinc-900 rounded-lg font-bold text-[10px] w-7 h-7 flex items-center justify-center shrink-0">3</div>
                      <div className="flex-1">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-white">Merchant Online Checkout</h4>
                        <p className="text-[9px] text-zinc-455 font-medium italic">Redirect to online SSLCommerz secure merchant portal</p>
                      </div>
                    </button>

                    <button 
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl border border-zinc-800 transition-all text-center"
                    >
                      Cancel Purchase
                    </button>
                  </div>
                )}

                {paymentMethod === 'contact' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-zinc-900/80 p-5 rounded-xl border border-zinc-800 space-y-3">
                      <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Payment Instructions</h4>
                      <p className="text-[10px] text-zinc-350 leading-relaxed font-medium">
                        Please send money (Personal) of **৳{(getTierPricing(purchaseTier) * duration).toLocaleString()} BDT** to:
                      </p>
                      <div className="p-3 bg-zinc-950 text-white rounded-xl font-mono text-xs text-center font-bold tracking-widest select-all border border-zinc-850">
                        01799269699
                      </div>
                      <p className="text-[9px] text-zinc-500 font-medium italic">
                        After sending, enter your sender number or Transaction ID below to verify your purchase instantly.
                      </p>
                      
                      <div className="space-y-4">
                        {/* Input 1: Sender Mobile Number */}
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-450 ml-1 font-mono">Your bkash/Nagad Sender Number</label>
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
                          <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-450 ml-1 font-mono">Payment Transaction ID (TxnID)</label>
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
                    </div>

                    <div className="flex items-center gap-4">
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('none')}
                        className="flex-1 py-3.5 bg-zinc-900 text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-zinc-800 transition-all text-center hover:bg-zinc-850"
                      >
                        Back
                      </button>
                      <button 
                        type="button"
                        onClick={handleMockPayment}
                        className="flex-1 py-3.5 bg-white text-zinc-950 hover:bg-zinc-100 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Complete Payment
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {paymentStep === 'processing' && (
              <div className="py-16 text-center space-y-6">
                <Loader2 className="w-10 h-10 animate-spin text-white mx-auto" />
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-200">Processing Payment...</p>
                  <p className="text-[10px] text-zinc-400 font-medium italic animate-pulse">{paymentProgressText}</p>
                </div>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="py-16 text-center space-y-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 animate-bounce">
                  <Check className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Transaction Approved</p>
                  <p className="text-[10px] text-zinc-400 font-medium">Your premium invitation card code has been generated!</p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </main>
  );
}
