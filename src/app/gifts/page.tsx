'use client';

import { useState, useEffect } from 'react';
import { GiftMembershipCard } from '@/components/gifts/GiftMembershipCard';
import { GiftRedemptionForm } from '@/components/gifts/GiftRedemptionForm';
import { Gift, ArrowLeft, Shield, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface GiftCard {
  id: string;
  code: string;
  tier: 'PRO' | 'CREATOR';
  duration: number;
  value: number;
  status: string;
  recipientEmail?: string;
}

export default function GiftsPage() {
  const [gifts, setGifts] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const res = await fetch('/api/gift-memberships');
        const data = await res.json();
        setGifts(data);
      } catch (error) {
        console.error('Failed to fetch gifts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGifts();
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Simple Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Gifts.</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">Manage your gift memberships and support your favorite authors.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded">
            <Gift className="w-3.5 h-3.5 text-zinc-300" />
            My Gifts
          </div>
        </header>

        {/* Redemption Module */}
        <div className="max-w-md mx-auto mb-20 p-10 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 shadow-sm">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-8 text-center">Redeem a Code</h2>
          <GiftRedemptionForm />
        </div>

        {/* Gift Registry */}
        <section>
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-zinc-50 dark:border-zinc-900">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2 italic">
              <Clock className="w-3.5 h-3.5" /> Your Gifts
            </h2>
          </div>

          <div className="min-h-[200px]">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-200 dark:text-zinc-800" />
              </div>
            ) : gifts.length === 0 ? (
              <div className="py-32 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">No gifts found in your account.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
                {gifts.map((gift) => (
                  <div key={gift.id} className="bg-white dark:bg-zinc-950 p-6">
                    <GiftMembershipCard gift={gift} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
