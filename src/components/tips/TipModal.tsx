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

const TIP_AMOUNTS = [30, 50, 150];

export function TipModal({
  authorId,
  authorName,
  storyId,
  storyTitle,
  isOpen,
  onClose,
  onSuccess,
}: TipModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(30);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const amount = customAmount ? parseInt(customAmount) : selectedAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || amount < 1) {
      toast.error('Please select or enter a tip amount');
      return;
    }

    if (!senderNumber.trim()) {
      toast.error('Please enter your bKash / Nagad sender number');
      return;
    }

    if (!transactionId.trim()) {
      toast.error('Please enter your payment Transaction ID (TxnID)');
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
          senderNumber: senderNumber.trim(),
          transactionId: transactionId.trim(),
        }),
      });

      if (res.ok) {
        toast.success(`✨ Tip receipt submitted for administrative verification!`);
        onClose();
        onSuccess?.();
        // Reset form
        setSelectedAmount(null);
        setCustomAmount('');
        setMessage('');
        setSenderNumber('');
        setTransactionId('');
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
              Select amount (Taka / BDT)
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
                  ৳{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div>
            <label htmlFor="custom" className="block text-sm font-medium text-gray-700 mb-2">
              Or enter custom amount (Taka)
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
              placeholder="Enter custom Taka amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">
              {message.length}/200
            </p>
          </div>

          {/* Manual Payment Section */}
          {amount && amount >= 1 && (
            <div className="space-y-4 border-t border-dashed border-gray-200 pt-4">
              <div className="bg-[#fcf8f2] border border-[#f5ebd6] rounded-lg p-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">bKash / Nagad payment instructions</span>
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  Please Send Money (Personal) of <span className="font-bold text-lg text-amber-950">৳{amount} BDT</span> to:
                </p>
                <div className="p-2.5 bg-white text-gray-900 rounded-lg font-mono text-sm text-center font-bold tracking-widest select-all border border-gray-200">
                  01799269699
                </div>
                <p className="text-[10px] text-amber-700 italic">
                  After sending, enter your sender number and Transaction ID below for admin verification.
                </p>
              </div>

              {/* Sender mobile number */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Your bKash/Nagad Sender Number</label>
                <input 
                  type="text" 
                  value={senderNumber}
                  onChange={e => setSenderNumber(e.target.value)}
                  placeholder="e.g. 017XXXXXXXX"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs font-mono text-center tracking-wider text-gray-950"
                />
              </div>

              {/* Transaction ID */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Payment Transaction ID (TxnID)</label>
                <input 
                  type="text" 
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  placeholder="e.g. A1B2C3D4E5"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-xs font-mono text-center tracking-wider text-gray-950 uppercase"
                />
              </div>
            </div>
          )}

          {/* Summary */}
          {amount && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tip amount:</span>
                <span className="text-2xl font-bold text-red-500">৳{amount}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                The author will receive ৳{Math.round(amount * 0.95)} after fees once verified.
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
              {isSubmitting ? 'Processing...' : `Send Tip ${amount ? `৳${amount}` : ''}`}
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
