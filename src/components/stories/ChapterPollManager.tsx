'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, PlusCircle, MinusCircle, AlertCircle, BarChart3, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PollWidget } from './PollWidget';

interface ChapterPollManagerProps {
  storyId: string;
  chapterId: string;
  isAuthor: boolean;
  userId: string | null;
}

export function ChapterPollManager({ storyId, chapterId, isAuthor, userId }: ChapterPollManagerProps) {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [expiresInDays, setExpiresInDays] = useState<string>('never');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPolls = async () => {
    try {
      const res = await fetch(`/api/stories/${storyId}/polls?chapterId=${chapterId}`);
      if (res.ok) {
        const data = await res.json();
        setPolls(data);
      }
    } catch (err) {
      console.error('Failed to load polls:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [storyId, chapterId]);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    } else {
      toast.error('Maximum 5 options allowed');
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const updated = options.filter((_, idx) => idx !== index);
      setOptions(updated);
    }
  };

  const handleOptionChange = (value: string, index: number) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuestion = question.trim();
    const filteredOptions = options.map((opt) => opt.trim()).filter(Boolean);

    if (!trimmedQuestion) {
      toast.error('Question is required');
      return;
    }

    if (filteredOptions.length < 2) {
      toast.error('At least 2 options are required');
      return;
    }

    try {
      setIsSubmitting(true);
      let expiresAt: string | null = null;
      if (expiresInDays !== 'never') {
        const date = new Date();
        date.setDate(date.getDate() + parseInt(expiresInDays));
        expiresAt = date.toISOString();
      }

      const res = await fetch(`/api/stories/${storyId}/polls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chapterId,
          question: trimmedQuestion,
          options: filteredOptions,
          expiresAt,
        }),
      });

      if (res.ok) {
        toast.success('Poll created successfully! 📊');
        setQuestion('');
        setOptions(['', '']);
        setExpiresInDays('never');
        setShowCreate(false);
        fetchPolls();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to create poll');
      }
    } catch (err) {
      console.error('Error creating poll:', err);
      toast.error('Failed to create poll');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    if (!confirm('Are you sure you want to delete this poll? All votes will be lost.')) return;

    try {
      const res = await fetch(`/api/polls/${pollId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Poll deleted');
        fetchPolls();
      } else {
        toast.error('Failed to delete poll');
      }
    } catch (err) {
      console.error('Error deleting poll:', err);
      toast.error('Failed to delete poll');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-16 pt-12 border-t border-zinc-100 dark:border-zinc-900">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-500" /> Reader Engagement Polls
        </h3>
        {isAuthor && !showCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded hover:opacity-90 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Create Poll
          </button>
        )}
      </div>

      {isAuthor && showCreate && (
        <form onSubmit={handleCreatePoll} className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">New Poll Setup</span>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Question</label>
            <input
              type="text"
              required
              placeholder="e.g., Which path should the hero choose?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-xs outline-none focus:border-zinc-900 dark:focus:border-white transition"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Options</label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(e.target.value, idx)}
                  className="flex-1 px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-xs outline-none focus:border-zinc-900 dark:focus:border-white transition"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="text-zinc-400 hover:text-red-500 transition"
                  >
                    <MinusCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            {options.length < 5 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add Choice
              </button>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Duration
            </label>
            <select
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-xs outline-none focus:border-zinc-900 dark:focus:border-white transition"
            >
              <option value="never">Never Expires</option>
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Poll...' : 'Publish Poll'}
            </button>
          </div>
        </form>
      )}

      {polls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-zinc-300 mb-2" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">No active polls in this chapter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {polls.map((poll) => {
            const formattedOptions = poll.options.map((opt: any) => ({
              id: opt.id,
              text: opt.text,
              votes: opt.votes.map((v: any) => ({ userId: v.userId })),
            }));

            return (
              <div key={poll.id} className="relative group">
                <PollWidget
                  pollId={poll.id}
                  question={poll.question}
                  options={formattedOptions}
                  expiresAt={poll.expiresAt}
                  onVote={fetchPolls}
                  userId={userId}
                />
                {isAuthor && (
                  <button
                    onClick={() => handleDeletePoll(poll.id)}
                    className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-red-500 rounded bg-white hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:border-zinc-800 shadow opacity-0 group-hover:opacity-100 transition duration-200"
                    title="Delete Poll"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
