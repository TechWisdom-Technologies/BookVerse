'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { BookOpen, Clock, Loader2, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

interface ReadingLogFormProps {
  userId: string;
  storyId?: string;
  onSuccess?: () => void;
}

export function ReadingLogForm({ userId, storyId, onSuccess }: ReadingLogFormProps) {
  const [pagesRead, setPagesRead] = useState('');
  const [minutes, setMinutes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e?: React.FormEvent, quickAddMinutes?: number) => {
    e?.preventDefault();

    const minsToSubmit = quickAddMinutes !== undefined ? quickAddMinutes : parseInt(minutes) || 0;
    const pagesToSubmit = quickAddMinutes !== undefined ? 0 : parseInt(pagesRead) || 0;

    if (!pagesToSubmit && !minsToSubmit) {
      toast.error('Please enter pages read or reading time');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/reading-logs/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pagesRead: pagesToSubmit,
          minutes: minsToSubmit,
          storyId,
          action: quickAddMinutes !== undefined ? 'increment' : 'overwrite', // Quick add acts as an increment
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        toast.success('Reading log saved! 🎉', {
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          },
        });
        setPagesRead('');
        setMinutes('');
        setTimeout(() => setIsSuccess(false), 2000);
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
    <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md">
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            Log Reading Session
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Track your progress and keep your streak alive.</p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="relative z-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Pages Read
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-blue-500 transition-colors">
                <BookOpen className="h-5 w-5" />
              </div>
              <input
                type="number"
                min="0"
                value={pagesRead}
                onChange={e => setPagesRead(e.target.value)}
                placeholder="0"
                className="block w-full pl-10 pr-3 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Minutes Read
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-indigo-500 transition-colors">
                <Clock className="h-5 w-5" />
              </div>
              <input
                type="number"
                min="0"
                value={minutes}
                onChange={e => setMinutes(e.target.value)}
                placeholder="0"
                className="block w-full pl-10 pr-3 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Quick Add Presets */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Plus className="w-3 h-3" /> Quick Add Time
          </label>
          <div className="flex flex-wrap gap-2">
            {[15, 30, 60].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSubmit(undefined, preset)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 opacity-70" />
                +{preset} min
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isSuccess || (!pagesRead && !minutes)}
          className={`w-full relative overflow-hidden font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2
            ${isSuccess 
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
              : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 shadow-md disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:text-zinc-500 disabled:shadow-none'
            }
          `}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Logged Successfully
            </>
          ) : (
            'Save Reading Log'
          )}
        </button>
      </form>
    </div>
  );
}
