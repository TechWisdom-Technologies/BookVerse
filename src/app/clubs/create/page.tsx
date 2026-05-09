'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

const GENRES = [
  'Fantasy',
  'Science Fiction',
  'Romance',
  'Mystery',
  'Thriller',
  'Horror',
  'Historical Fiction',
  'Literary Fiction',
  'Non-Fiction',
  'Biography',
  'Self-Help',
  'Young Adult',
  'Children',
];

export default function CreateClubPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    genre: '',
    isPrivate: false,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to create a club</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Club name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const club = await res.json();
        toast.success('Club created successfully! 🎉');
        router.push(`/clubs/${club.id}`);
      } else if (res.status === 409) {
        toast.error('Club name already taken');
      } else {
        toast.error('Failed to create club');
      }
    } catch (error) {
      console.error('Error creating club:', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create a Book Club</h1>
          <p className="text-lg text-gray-600">
            Start a community around your favorite books and genres
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Club Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Fantasy Lovers United"
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.name.length}/100
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell members what your club is about..."
              maxLength={500}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500
            </p>
          </div>

          {/* Genre */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
              Primary Genre
            </label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a genre</option>
              {GENRES.map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Privacy */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Make this club private
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Private clubs require approval to join. Public clubs are open to anyone.
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              {isSubmitting ? 'Creating...' : 'Create Club'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
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
