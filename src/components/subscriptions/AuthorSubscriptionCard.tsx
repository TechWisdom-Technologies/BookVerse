'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';

interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price: number;
  benefits: string[];
}

export function AuthorSubscriptionCard({
  tier,
  authorId,
}: {
  tier: SubscriptionTier;
  authorId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/author-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId,
          tier: tier.name.toUpperCase(),
        }),
      });

      if (!res.ok) throw new Error('Failed to subscribe');
      toast.success('✨ Subscription activated!');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to subscribe'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
      <div className="flex items-center mb-3">
        <Star className="w-5 h-5 text-amber-600 mr-2" />
        <h3 className="font-bold text-lg">{tier.name}</h3>
      </div>

      <p className="text-2xl font-bold text-amber-700 mb-3">
        ${tier.price.toFixed(2)}<span className="text-sm text-gray-600">/mo</span>
      </p>

      <p className="text-sm text-gray-700 mb-3">{tier.description}</p>

      <ul className="space-y-2 mb-4">
        {tier.benefits.map((benefit, i) => (
          <li key={i} className="text-sm flex items-start">
            <span className="text-amber-600 mr-2">✓</span>
            {benefit}
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 transition font-medium"
      >
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </div>
  );
}
