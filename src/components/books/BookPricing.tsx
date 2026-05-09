'use client';

import { useState } from 'react';
import { Lock, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

interface BookPricingProps {
  bookId: string;
  price?: number;
  isPaid?: boolean;
  onPurchaseSuccess?: () => void;
}

export function BookPricing({
  bookId,
  price = 0,
  isPaid = false,
  onPurchaseSuccess,
}: BookPricingProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please log in to purchase');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`/api/books/${bookId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price }),
      });

      if (res.ok) {
        toast.success('Book purchased! 🎉');
        onPurchaseSuccess?.();
      } else {
        toast.error('Purchase failed');
      }
    } catch (error) {
      console.error('Error purchasing:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (price === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 font-semibold">Free Book</p>
        <p className="text-sm text-green-700 mt-1">Available to all readers</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
      <div>
        <p className="text-sm text-gray-600">Price</p>
        <p className="text-3xl font-bold text-gray-900">${price.toFixed(2)}</p>
      </div>

      <button
        onClick={handlePurchase}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
      >
        {isPaid ? (
          <>
            <Download className="w-5 h-5" />
            Download Book
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            {isLoading ? 'Processing...' : `Purchase for $${price.toFixed(2)}`}
          </>
        )}
      </button>

      {!isPaid && (
        <p className="text-xs text-center text-gray-600">
          Secure payment powered by Stripe
        </p>
      )}
    </div>
  );
}
