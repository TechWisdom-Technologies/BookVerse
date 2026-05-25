'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { StoryCard } from './StoryCard';

export function StoryRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/stories/recommendations');
        if (res.ok) {
          const data = await res.json();
          setRecommendations(data);
        }
      } catch (err) {
        console.error('Failed to load story recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex items-center gap-2 border-b border-zinc-150 dark:border-zinc-900 pb-4">
          <div className="h-5 w-5 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="relative aspect-[2/3] w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-900 bg-gradient-to-br from-white/50 to-zinc-50/30 dark:from-zinc-950/20 dark:to-zinc-900/10 p-8 backdrop-blur-xl transition hover:shadow-lg">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-3xl" />
      
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-900">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> Recommended For You
        </h2>
        <span className="text-[9px] font-mono text-zinc-400 font-medium">Smart Curation Engine</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {recommendations.map((story) => (
          <div key={story.id} className="transition transform duration-300 hover:-translate-y-1">
            <StoryCard story={story} />
          </div>
        ))}
      </div>
    </section>
  );
}
