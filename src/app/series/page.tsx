'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Library, Plus, Loader, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Series {
  id: string;
  name: string;
  description?: string;
  genre: string;
  books: Array<{
    id: string;
    title: string;
    sequenceNumber: number;
  }>;
  user: { id: string; username: string; displayName: string };
}

export default function SeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Fiction');

  const GENRES = [
    'Fantasy',
    'Science Fiction',
    'Romance',
    'Mystery',
    'Thriller',
    'Horror',
    'Historical Fiction',
    'Literary Fiction',
  ];

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const res = await fetch('/api/series');
      if (res.ok) {
        const data = await res.json();
        setSeries(data);
      }
    } catch (error) {
      console.error('Error fetching series:', error);
      toast.error('Failed to load series');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Series name is required');
      return;
    }

    try {
      setIsCreating(true);
      const res = await fetch('/api/series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          genre,
        }),
      });

      if (res.ok) {
        toast.success('Series created! 📚');
        setName('');
        setDescription('');
        setGenre('Fiction');
        fetchSeries();
      } else {
        toast.error('Failed to create series');
      }
    } catch (error) {
      console.error('Error creating series:', error);
      toast.error('An error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSeries = async (seriesId: string) => {
    if (!confirm('Delete this series?')) return;

    try {
      const res = await fetch(`/api/series/${seriesId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Series deleted');
        fetchSeries();
      } else {
        toast.error('Failed to delete series');
      }
    } catch (error) {
      console.error('Error deleting series:', error);
      toast.error('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Library className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Book Series</h1>
              <p className="text-gray-600">Organize your books into collections</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Series</h2>
              <form onSubmit={handleCreateSeries} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Series Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Chronicles of..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {isCreating ? 'Creating...' : 'Create Series'}
                </button>
              </form>
            </div>
          </div>

          {/* Series List */}
          <div className="lg:col-span-2 space-y-6">
            {series.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <Library className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No series yet</h3>
                <p className="text-gray-600">Create your first series to organize your books</p>
              </div>
            ) : (
              series.map((s) => (
                <div key={s.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{s.name}</h3>
                      {s.description && (
                        <p className="text-sm text-gray-600 mt-1">{s.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-gray-100 rounded">{s.genre}</span>
                        <span>{s.books.length} book{s.books.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSeries(s.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Books in Series */}
                  {s.books.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Books</h4>
                      <ul className="space-y-2">
                        {s.books
                          .sort((a, b) => (a.sequenceNumber || 0) - (b.sequenceNumber || 0))
                          .map((book) => (
                            <li key={book.id} className="flex items-center gap-2 text-sm text-gray-700">
                              <span className="font-semibold text-blue-600">
                                #{book.sequenceNumber || '?'}
                              </span>
                              <Link
                                href={`/library/${book.id}`}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                {book.title}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
