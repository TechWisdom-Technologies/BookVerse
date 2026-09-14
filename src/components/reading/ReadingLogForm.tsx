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
    <div className="space-y-8">
      <div className="flex items-center gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-900">
        <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          Log Reading Session
        </h3>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest ml-1">
              Pages Read
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-300 dark:text-zinc-700">
                <BookOpen className="h-4 w-4" />
              </div>
              <input
                type="number"
                min="0"
                value={pagesRead}
                onChange={e => setPagesRead(e.target.value)}
                placeholder="0"
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 pl-10 pr-4 py-3 text-xs outline-none rounded focus:border-zinc-900 dark:focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest ml-1">
              Minutes Read
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-300 dark:text-zinc-700">
                <Clock className="h-4 w-4" />
              </div>
              <input
                type="number"
                min="0"
                value={minutes}
                onChange={e => setMinutes(e.target.value)}
                placeholder="0"
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 pl-10 pr-4 py-3 text-xs outline-none rounded focus:border-zinc-900 dark:focus:border-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Quick Add Presets */}
        <div className="space-y-3">
          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
            <Plus className="w-3 h-3" /> Quick Add Time
          </label>
          <div className="flex flex-wrap gap-2">
            {[15, 30, 60].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSubmit(undefined, preset)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded text-[10px] font-bold uppercase tracking-widest transition-all focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white disabled:opacity-50 flex items-center gap-1.5"
              >
                <Clock className="w-3 h-3 opacity-70" />
                +{preset}m
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isSuccess || (!pagesRead && !minutes)}
          className={`w-full py-3.5 px-4 rounded text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2
            ${isSuccess 
              ? 'bg-emerald-500 text-white' 
              : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:text-zinc-400'
            }
          `}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
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
