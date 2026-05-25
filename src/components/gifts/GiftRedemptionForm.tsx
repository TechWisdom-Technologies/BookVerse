'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { getFriendlyErrorMessage } from '@/lib/friendly-errors';

export function GiftRedemptionForm() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast.error('Please enter a gift code');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/gift-memberships/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to redeem');

      toast.success(`✨ Redeemed! ${data.membershipTier} membership activated!`);
      setCode('');
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, 'Failed to redeem gift. Please check your code and try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Redeem Gift Membership</h2>
      <p className="text-gray-600 text-sm mb-4">
        Enter your gift code to activate your membership
      </p>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="GIFT-XXXX-XXXX"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="w-full px-3 py-2 border rounded-lg font-mono text-center"
          disabled={loading}
        />
        <button
          onClick={handleRedeem}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition font-medium"
        >
          {loading ? 'Redeeming...' : 'Redeem Now'}
        </button>
      </div>
    </div>
  );
}
