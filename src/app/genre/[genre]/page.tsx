'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { BookOpen, Users, TrendingUp, Loader2, ArrowLeft, Layers, Sparkles, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';

const GENRES = [
  'Fantasy', 'Science Fiction', 'Romance', 'Mystery', 'Thriller', 'Horror', 'Historical Fiction', 'Literary Fiction', 'Non-Fiction', 'Biography',
];

interface GenreData {
  genre: string;
  bookCount: number;
  clubCount: number;
  topBooks: any[];
  topClubs: any[];
}

export default function GenreCommunityPage() {
  const params = useParams();
  const router = useRouter();
  const genreParam = (params.genre as string)?.replace(/-/g, ' ');
  const [genre, setGenre] = useState(genreParam || 'Fantasy');
  const [genreData, setGenreData] = useState<GenreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        setLoading(true);
        const booksRes = await fetch(`/api/books?genre=${encodeURIComponent(genre)}`);
        const clubsRes = await fetch(`/api/clubs?genre=${encodeURIComponent(genre)}`);
        const books = booksRes.ok ? await booksRes.json() : [];
        const clubs = clubsRes.ok ? await clubsRes.json() : [];

        setGenreData({
          genre,
          bookCount: books.length,
          clubCount: clubs.length,
          topBooks: books.slice(0, 8),
          topClubs: clubs.slice(0, 4),
        });
      } finally { setLoading(false); }
    };
    if (genre) fetchGenreData();
  }, [genre]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
    </div>
  );

  const getGenreIcon = (genre: string) => {
    const icons: Record<string, string> = {
      'Fantasy': '🐉', 'Science Fiction': '🚀', 'Romance': '💕', 'Mystery': '🔍',
      'Thriller': '😱', 'Horror': '👻', 'Historical Fiction': '📜',
      'Literary Fiction': '📚', 'Non-Fiction': '📖', 'Biography': '👤',
    };
    return icons[genre] || '📚';
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Minimal Header Classification */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/library" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Main Library
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center text-2xl opacity-40 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded">
                {getGenreIcon(genre)}
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">{genre} Registry.</h1>
                <p className="text-xs text-zinc-500 font-medium">Categorized archives for {genre} scholars and creative collectives.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded font-mono">
            <Activity className="w-3 h-3 text-zinc-300" />
            Classification: {genre.toUpperCase()}
          </div>
        </header>

        {/* Global Classification Index */}
        <nav className="mb-16 pb-8 border-b border-zinc-50 dark:border-zinc-900">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {GENRES.map(g => (
              <Link
                key={g}
                href={`/genre/${g.replace(/\s+/g, '-').toLowerCase()}`}
                className={`px-4 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                  g === genre
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                {g}
              </Link>
            ))}
          </div>
        </nav>

        {/* Content Registries */}
        <div className="space-y-24">
          {/* Featured Volumes Registry */}
          {genreData && genreData.topBooks.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8 pb-2 border-b border-zinc-50 dark:border-zinc-900">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Classified Volumes</h2>
                <Link href={`/library?genre=${encodeURIComponent(genre)}`} className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Access Full Registry →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
                {genreData.topBooks.map(book => (
                  <Link key={book.id} href={`/library/${book.id}`} className="p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all group">
                    <div className="aspect-[2/3] mb-6 bg-zinc-50 dark:bg-zinc-900 rounded overflow-hidden border border-zinc-100 dark:border-zinc-800">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt="" className="w-full h-full object-cover transition-all duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10"><BookOpen className="w-8 h-8" /></div>
                      )}
                    </div>
                    <h3 className="text-xs font-bold tracking-tight mb-2 uppercase group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors line-clamp-1">{book.title}</h3>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 font-mono">{book.uploadedBy?.displayName || book.uploadedBy?.username}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Featured Collectives Registry */}
          {genreData && genreData.topClubs.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8 pb-2 border-b border-zinc-50 dark:border-zinc-900">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Scholarly Collectives</h2>
                <Link href={`/clubs?genre=${encodeURIComponent(genre)}`} className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Access Full Directory →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
                {genreData.topClubs.map(club => (
                  <Link key={club.id} href={`/clubs/${club.id}`} className="p-10 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold tracking-tight mb-2 uppercase group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">{club.name}</h3>
                        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 flex items-center gap-2 font-mono">
                          <Users className="w-3 h-3" /> {club.members?.length || 0} Scholars
                        </div>
                      </div>
                    </div>
                    {club.description && <p className="text-[11px] text-zinc-500 font-medium line-clamp-2 leading-relaxed italic">&quot;{club.description}&quot;</p>}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Empty Registry State */}
        {genreData && genreData.bookCount === 0 && genreData.clubCount === 0 && (
          <div className="py-40 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-8">No active records detected for the {genre} classification.</p>
            <Link href="/upload" className="px-8 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all">
              Initialize Volume Registry
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
