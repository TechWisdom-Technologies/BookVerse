'use client';

import { useState } from 'react';
import { Heart, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TipModalProps {
  authorId: string;
  authorName: string;
  storyId?: string;
  storyTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const TIP_AMOUNTS = [1, 2, 5, 10, 25, 50];

export function TipModal({
  authorId,
  authorName,
  storyId,
  storyTitle,
  isOpen,
  onClose,
  onSuccess,
}: TipModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const amount = customAmount ? parseInt(customAmount) : selectedAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || amount < 1) {
      toast.error('Please select or enter a tip amount');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/tips/${authorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          message,
          storyId: storyId || null,
        }),
      });

      if (res.ok) {
        toast.success(`Sent a $${amount} tip to ${authorName}! 🎉`);
        onClose();
        onSuccess?.();
        // Reset form
        setSelectedAmount(null);
        setCustomAmount('');
        setMessage('');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to send tip');
      }
    } catch (error) {
      console.error('Error sending tip:', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Support {authorName}
          </h2>
          {storyTitle && (
            <p className="text-sm text-gray-600">for "{storyTitle}"</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preset Amounts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select amount (USD)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TIP_AMOUNTS.map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`py-2 px-3 rounded-lg font-semibold transition ${
                    selectedAmount === amt && !customAmount
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label htmlFor="custom" className="block text-sm font-medium text-gray-700 mb-2">
              Or enter custom amount ($)
            </label>
            <input
              id="custom"
              type="number"
              min="1"
              max="10000"
              value={customAmount}
              onChange={e => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              placeholder="Enter amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message (optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Thank you for your amazing work!"
              maxLength={200}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/200
            </p>
          </div>

          {/* Summary */}
          {amount && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tip amount:</span>
                <span className="text-2xl font-bold text-red-500">${amount}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                The author will receive {Math.round(amount * 0.95)}$ after fees
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !amount}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              {isSubmitting ? 'Processing...' : `Send Tip ${amount ? `$${amount}` : ''}`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
