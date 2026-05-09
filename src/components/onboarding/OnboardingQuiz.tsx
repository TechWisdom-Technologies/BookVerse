'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

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
  const [loading, setLoading] = useState(false);

  const handleGenreToggle = (genre: string) => {
    setSelected((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      toast.error('Please select at least one genre');
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
        }),
      });

      if (!res.ok) throw new Error('Failed to save quiz');
      toast.success('Preferences saved!');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">What genres do you love?</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreToggle(genre)}
            className={`p-3 rounded-lg border-2 transition ${
              selected.includes(genre)
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Reading Level</label>
        <select
          value={readingLevel}
          onChange={(e) => setReadingLevel(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
}
