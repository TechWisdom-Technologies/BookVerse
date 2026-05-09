"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Search, ArrowRight, BookOpen, User, Flame, ArrowLeft, Loader2, Compass } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Universe {
  id: string;
  name: string;
  description?: string;
  genre: string;
  coverUrl?: string;
  viewCount: number;
  _count: { stories: number; };
  user: { id: string; username: string; displayName: string; avatarUrl?: string };
}

export default function UniverseExplorationPage() {
  const router = useRouter();
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUniverses(); }, []);

  const fetchUniverses = async () => {
    try {
      const res = await fetch('/api/universes');
      if (res.ok) {
        const data = await res.json();
        setUniverses(data);
      }
    } finally { setLoading(false); }
  };

  const filteredUniverses = universes.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.genre.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
    </div>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Simple Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Browse Worlds.</h1>
              <p className="text-xs text-zinc-500 font-medium">Explore interconnected stories set in shared universes and expansive worlds.</p>
            </div>
          </div>

          {/* Simple Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-300" />
            <input
              type="text"
              placeholder="Search worlds..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            />
          </div>
        </header>

        {/* Universe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniverses.map((u) => (
            <Link
              key={u.id}
              href={`/universes/${u.id}`}
              className="group flex flex-col border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all relative overflow-hidden"
            >
              {/* Universe Cover */}
              <div className="h-48 w-full overflow-hidden bg-zinc-50 dark:bg-zinc-900 relative">
                {u.coverUrl ? (
                  <img
                    src={u.coverUrl}
                    alt=""
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-10">
                    <Compass className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent opacity-60" />
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4 relative z-10 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-400 text-[9px] font-bold uppercase tracking-widest border border-zinc-100 dark:border-zinc-800">
                    {u.genre}
                  </span>
                  <div className="flex items-center gap-1.5 text-zinc-300 text-[9px] font-bold uppercase tracking-widest">
                    <Flame className="w-3 h-3" />
                    {u.viewCount} Reads
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-bold mb-2 tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors uppercase">
                    {u.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-medium line-clamp-2 leading-relaxed">
                    {u.description || 'No description provided.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-50 dark:border-zinc-900 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-[8px] font-bold overflow-hidden border border-zinc-100 dark:border-zinc-800">
                      {u.user.avatarUrl ? (
                        <img src={u.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        u.user.username[0].toUpperCase()
                      )}
                    </div>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{u.user.displayName || u.user.username}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors uppercase tracking-[0.2em]">
                    <BookOpen className="w-3.5 h-3.5" />
                    {u._count?.stories || 0} Stories
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredUniverses.length === 0 && (
          <div className="text-center py-40 border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No worlds found matching your search.</p>
          </div>
        )}
      </div>
    </main>
  );
}
