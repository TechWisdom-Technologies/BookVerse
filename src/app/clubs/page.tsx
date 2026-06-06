'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, ArrowLeft, Loader2, Users, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Club {
  id: string;
  name: string;
  description?: string;
  genre?: string;
  isPrivate: boolean;
  owner: {
    username: string;
    displayName?: string;
  };
  members: Array<{ userId: string }>;
}

export default function ClubsPage() {
  const router = useRouter();
  const { user, dbUser } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (user) {
      fetch('/api/clubs/unread')
        .then(res => res.json())
        .then(data => {
          if (data.unreadCountsByClub) {
            setUnreadCounts(data.unreadCountsByClub);
          }
        })
        .catch(err => console.error('Error fetching unread counts:', err));
    }
  }, [user]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/clubs');
        if (res.ok) {
          const data = await res.json();
          setClubs(data);
          setFilteredClubs(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  useEffect(() => {
    let filtered = clubs;
    if (search) {
      filtered = filtered.filter(club =>
        club.name.toLowerCase().includes(search.toLowerCase()) ||
        club.description?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (genreFilter) {
      filtered = filtered.filter(club => club.genre === genreFilter);
    }
    setFilteredClubs(filtered);
  }, [search, genreFilter, clubs]);

  const genres = Array.from(new Set(clubs.map(c => c.genre).filter(Boolean)));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
    </div>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Simple Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Browse Clubs.</h1>
              <p className="text-xs text-zinc-500 font-medium">Find a community of readers and discuss your favorite books.</p>
            </div>
          </div>
          
          {user && (
            <Link href="/clubs/create" className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Start a Club
            </Link>
          )}
        </header>

        {/* Simple Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-medium outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            />
          </div>
          <select
            value={genreFilter}
            onChange={e => setGenreFilter(e.target.value)}
            className="px-6 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none cursor-pointer hover:border-zinc-900 dark:hover:border-white transition-all"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre as string} value={genre as string}>{genre as string}</option>
            ))}
          </select>
          <div className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/50 rounded border border-zinc-100 dark:border-zinc-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {filteredClubs.length} Available
          </div>
        </div>

        {/* My Clubs Section */}
        {dbUser && filteredClubs.filter(c => c.members.some(m => m.userId === dbUser.id)).length > 0 && (
          <div className="mb-16">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-900">My Clubs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
              {filteredClubs.filter(c => c.members.some(m => m.userId === dbUser.id)).map(club => (
                <Link
                  key={club.id}
                  href={`/clubs/${club.id}`}
                  className="relative group flex flex-col p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 px-2 py-0.5 border border-zinc-100 dark:border-zinc-800 rounded">
                      {club.genre || 'General'}
                    </span>
                    {club.isPrivate && <Shield className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>

                  <h3 className="text-sm font-bold mb-2 uppercase tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                    {club.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mb-10 line-clamp-2 italic">
                    {club.description || 'A community gathering for readers.'}
                  </p>

                  {unreadCounts[club.id] > 0 && (
                    <div className="absolute top-8 right-8 flex items-center justify-center w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full shadow-md animate-in zoom-in">
                      {unreadCounts[club.id]}
                    </div>
                  )}

                  <div className="mt-auto pt-6 border-t border-zinc-50 dark:border-zinc-900 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-[9px] font-bold border border-zinc-100 dark:border-zinc-800">
                        {club.owner.username[0].toUpperCase()}
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{club.owner.displayName || club.owner.username}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                      <Users className="w-3.5 h-3.5" />
                      {club.members.length}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Discover Clubs Section */}
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-900">Discover Clubs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
          {filteredClubs.filter(c => !dbUser || !c.members.some(m => m.userId === dbUser.id)).map(club => (
            <Link
              key={club.id}
              href={`/clubs/${club.id}`}
              className="group flex flex-col p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 px-2 py-0.5 border border-zinc-100 dark:border-zinc-800 rounded">
                  {club.genre || 'General'}
                </span>
                {club.isPrivate && <Shield className="w-3.5 h-3.5 text-emerald-500" />}
              </div>

              <h3 className="text-sm font-bold mb-2 uppercase tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                {club.name}
              </h3>
              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mb-10 line-clamp-2 italic">
                {club.description || 'A community gathering for readers.'}
              </p>

              <div className="mt-auto pt-6 border-t border-zinc-50 dark:border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-[9px] font-bold border border-zinc-100 dark:border-zinc-800">
                    {club.owner.username[0].toUpperCase()}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{club.owner.displayName || club.owner.username}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                  <Users className="w-3.5 h-3.5" />
                  {club.members.length}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredClubs.length === 0 && (
          <div className="py-40 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No clubs match your search.</p>
          </div>
        )}
      </div>
    </main>
  );
}
