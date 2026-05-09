'use client';

import { useState, useEffect } from 'react';
import { GiftMembershipCard } from '@/components/gifts/GiftMembershipCard';
import { GiftRedemptionForm } from '@/components/gifts/GiftRedemptionForm';
import { Gift } from 'lucide-react';

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
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <Gift className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-4xl font-bold">Gift Memberships</h1>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <GiftRedemptionForm />
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Your Gifts</h2>
          {loading ? (
            <div className="text-center">Loading gifts...</div>
          ) : gifts.length === 0 ? (
            <p className="text-center text-gray-600">
              No gifts yet. Share the joy of reading!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gifts.map((gift) => (
                <GiftMembershipCard key={gift.id} gift={gift} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
