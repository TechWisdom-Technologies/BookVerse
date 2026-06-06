'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Sparkles, Layers, Check, Loader2 } from 'lucide-react';

const GENRES = [
  'Fantasy',
  'Romance',
  'Science Fiction',
  'Mystery',
  'Thriller',
  'Historical',
  'Young Adult',
  'Literary Fiction',
  'Horror',
  'Adventure',
];

export function OnboardingQuiz() {
  const [selected, setSelected] = useState<string[]>([]);
  const [readingLevel, setReadingLevel] = useState('INTERMEDIATE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenreToggle = (genre: string) => {
    setSelected((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      toast.error('Please select at least one genre.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/onboarding/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genrePreferences: selected,
          readingLevel,
          phoneNumber,
        }),
      });

      if (!res.ok) throw new Error('Failed to save preferences.');
      toast.success('Profile updated.');
      window.location.href = '/';
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950">
      <div className="mb-10 pb-6 border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Welcome
        </div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1 uppercase">
          Set up your Profile.
        </h1>
        <p className="text-xs text-zinc-500 font-medium italic">
          Select your favorite genres to help us recommend stories you&apos;ll love.
        </p>
      </div>

      <div className="mb-12">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-6">Choose Genres</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreToggle(genre)}
              className={`p-4 text-left transition-all relative group ${
                selected.includes(genre)
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                  : 'bg-white dark:bg-zinc-950 text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest">{genre}</span>
              {selected.includes(genre) && (
                <Check className="absolute top-4 right-4 w-3 h-3" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-3.5 h-3.5 text-zinc-300" />
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Reading Level</h3>
        </div>
        <select
          value={readingLevel}
          onChange={(e) => setReadingLevel(e.target.value)}
          className="w-full px-5 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white appearance-none cursor-pointer shadow-sm"
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>

      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-3.5 h-3.5 text-zinc-300" />
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Phone Number</h3>
        </div>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number"
          className="w-full px-5 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-[10px] font-bold tracking-widest text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Finish"}
      </button>
    </div>
  );
}
