'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface ReadingLogFormProps {
  userId: string;
  storyId?: string; // Optional story to track
  onSuccess?: () => void;
}

export function ReadingLogForm({ userId, storyId, onSuccess }: ReadingLogFormProps) {
  const [pagesRead, setPagesRead] = useState('');
  const [minutes, setMinutes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pagesRead && !minutes) {
      toast.error('Please enter pages read or reading time');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/reading-logs/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pagesRead: parseInt(pagesRead) || 0,
          minutes: parseInt(minutes) || 0,
          storyId,
        }),
      });

      if (res.ok) {
        toast.success('Reading logged successfully! 🎉');
        setPagesRead('');
        setMinutes('');
        onSuccess?.();
      } else {
        toast.error('Failed to log reading');
      }
    } catch (error) {
      console.error('Error logging reading:', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Log Your Reading</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pages Read
          </label>
          <input
            type="number"
            min="0"
            value={pagesRead}
            onChange={e => setPagesRead(e.target.value)}
            placeholder="e.g., 30"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minutes Read
          </label>
          <input
            type="number"
            min="0"
            value={minutes}
            onChange={e => setMinutes(e.target.value)}
            placeholder="e.g., 45"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        {isSubmitting ? 'Logging...' : 'Log Reading'}
      </button>
    </form>
  );
}
