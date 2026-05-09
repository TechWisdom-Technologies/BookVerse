'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface Universe {
  id: string;
  name: string;
  description: string;
  genre: string;
  creator: { displayName: string };
  stories: number;
}

export function StoryUniverseBrowser() {
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniverses = async () => {
      try {
        const res = await fetch('/api/story-universes');
        const data = await res.json();
        setUniverses(data);
      } catch (error) {
        console.error('Failed to fetch universes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniverses();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading universes...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
        <h1 className="text-3xl font-bold">Story Universes</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {universes.map((universe) => (
          <Link
            key={universe.id}
            href={`/universes/${universe.id}`}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 cursor-pointer"
          >
            <h2 className="text-xl font-bold mb-2">{universe.name}</h2>
            <p className="text-gray-600 text-sm mb-2">{universe.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-600 font-medium">{universe.genre}</span>
              <span className="text-gray-500">{universe.stories} stories</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">by {universe.creator.displayName}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
