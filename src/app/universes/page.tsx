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

const getUniverseGraphic = (name: string) => {
  const colors = [
    "from-indigo-600 via-purple-600 to-pink-600",
    "from-cyan-500 via-blue-600 to-indigo-700",
    "from-emerald-500 via-teal-600 to-cyan-700",
    "from-rose-500 via-pink-600 to-purple-700",
    "from-amber-500 via-orange-600 to-rose-700",
    "from-violet-600 via-fuchsia-600 to-pink-700"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

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
              className="group block relative rounded-xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 overflow-hidden shadow-sm hover:shadow-md"
            >
              <div className="p-2">
                <div className="relative h-[22rem] w-full overflow-hidden rounded-lg">
                  {u.coverUrl ? (
                    <img src={u.coverUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getUniverseGraphic(u.name)} flex flex-col items-center justify-center relative`}>
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] animate-pulse duration-1000" />
                       <Compass className="w-16 h-16 text-white/80 drop-shadow-lg mb-4" />
                       <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-white/60 relative z-10 drop-shadow-sm">
                         {u.genre} Realm
                       </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end h-full">
                    <div className="flex items-center gap-2 mb-4 transform opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <span className="px-2.5 py-1 rounded bg-white/10 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest border border-white/20">
                        {u.genre}
                      </span>
                      <span className="flex items-center gap-1.5 text-white text-[9px] font-bold uppercase tracking-widest backdrop-blur-md bg-black/40 px-2.5 py-1 rounded border border-white/10">
                        <Flame className="w-3 h-3 text-orange-400" /> {u.viewCount} Reads
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold tracking-tight text-white mb-2 group-hover:text-zinc-200 transition-colors line-clamp-2">
                      {u.name}
                    </h3>
                    
                    <p className="text-[11px] text-zinc-400 font-medium line-clamp-2 leading-relaxed mb-6">
                      {u.description || 'Step into this expansive universe and explore its interconnected stories.'}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-auto pt-5 border-t border-white/10">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold overflow-hidden border border-zinc-600 ring-2 ring-transparent group-hover:ring-white/20 transition-all">
                        {u.user.avatarUrl ? (
                          <img src={u.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white">{u.user.username[0].toUpperCase()}</span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-zinc-300 tracking-wide">{u.user.displayName || u.user.username}</span>
                      <div className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">
                        <BookOpen className="w-4 h-4" />
                        {u._count?.stories || 0} Stories
                      </div>
                    </div>
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
