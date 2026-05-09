'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Gift, Copy } from 'lucide-react';

interface GiftCard {
  id: string;
  code: string;
  tier: 'PRO' | 'CREATOR';
  duration: number;
  value: number;
  status: string;
  recipientEmail?: string;
}

export function GiftMembershipCard({ gift }: { gift: GiftCard }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(gift.code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <Gift className="w-5 h-5 text-purple-600 mr-2" />
        <h3 className="font-bold text-lg">{gift.tier} Membership</h3>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Duration:</span> {gift.duration} months
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Value:</span> ${gift.value.toFixed(2)}
        </p>
        {gift.recipientEmail && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Recipient:</span> {gift.recipientEmail}
          </p>
        )}
        <div className="inline-block px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded capitalize">
          {gift.status}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <code className="flex-1 bg-white p-2 rounded border text-xs font-mono">
          {gift.code}
        </code>
        <button
          onClick={handleCopyCode}
          className="p-2 hover:bg-purple-200 rounded transition"
          title="Copy code"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
