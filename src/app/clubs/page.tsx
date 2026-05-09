'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { ClubCard } from '@/components/clubs/ClubCard';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

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
      } catch (error) {
        console.error('Error fetching clubs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  useEffect(() => {
    let filtered = clubs;

    if (search) {
      filtered = filtered.filter(
        club =>
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

  return (
    <div className="min-h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A] pt-16 pb-32">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        
        {/* Huge Clean Header */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter mb-6">
                Clubs.
              </h1>
              <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                Join vibrant communities, discuss your favorite books, and connect with readers from around the globe.
              </p>
            </div>
            {user && (
              <Link
                href="/clubs/create"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-brand text-white rounded-full font-bold text-lg hover:bg-orange-600 hover:shadow-xl hover:shadow-brand/20 hover:-translate-y-1 transition-all duration-300 shrink-0"
              >
                <Plus className="w-5 h-5" />
                Create Club
              </Link>
            )}
          </div>
        </header>

        {/* Minimal Divider */}
        <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-12" />

        {/* Interactive Filters Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          
          <div className="flex flex-col sm:flex-row flex-1 items-start sm:items-center gap-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search clubs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-zinc-100 dark:bg-zinc-900 border-transparent rounded-full focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none font-medium text-zinc-900 dark:text-white placeholder:text-zinc-500"
              />
            </div>
            
            <div className="relative shrink-0 w-full sm:w-auto">
              <select
                value={genreFilter}
                onChange={e => setGenreFilter(e.target.value)}
                className="w-full sm:w-auto appearance-none pl-6 pr-10 py-3 bg-zinc-100 dark:bg-zinc-900 border-transparent rounded-full focus:ring-2 focus:ring-brand outline-none font-medium text-zinc-900 dark:text-white cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre as string} value={genre as string}>
                    {genre as string}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-600 dark:text-zinc-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {filteredClubs.length} Active Clubs
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-48 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              ))}
            </div>
          ) : filteredClubs.length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500 dark:text-zinc-400 text-xl font-medium mb-4">No clubs found</p>
              {user && (
                <Link
                  href="/clubs/create"
                  className="inline-flex items-center gap-2 text-brand font-bold hover:text-orange-500 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create the first one
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map(club => (
                <ClubCard
                  key={club.id}
                  id={club.id}
                  name={club.name}
                  description={club.description}
                  genre={club.genre}
                  isPrivate={club.isPrivate}
                  memberCount={club.members.length}
                  ownerName={club.owner.displayName || club.owner.username}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
