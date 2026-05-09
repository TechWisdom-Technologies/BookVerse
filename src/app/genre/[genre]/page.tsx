'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookOpen, Users, TrendingUp, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
  const genreParam = (params.genre as string)?.replace(/-/g, ' ');
  const [genre, setGenre] = useState(genreParam || 'Fantasy');
  const [genreData, setGenreData] = useState<GenreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        setLoading(true);

        // Fetch books in this genre
        // In a real app, you'd have a dedicated endpoint
        // For now, we'll fetch all books and filter client-side
        const booksRes = await fetch(`/api/books?genre=${encodeURIComponent(genre)}`);
        const clubsRes = await fetch(`/api/clubs?genre=${encodeURIComponent(genre)}`);

        const books = booksRes.ok ? await booksRes.json() : [];
        const clubs = clubsRes.ok ? await clubsRes.json() : [];

        setGenreData({
          genre,
          bookCount: books.length,
          clubCount: clubs.length,
          topBooks: books.slice(0, 6),
          topClubs: clubs.slice(0, 6),
        });
      } catch (error) {
        console.error('Error fetching genre data:', error);
        toast.error('Failed to load genre community');
      } finally {
        setLoading(false);
      }
    };

    if (genre) {
      fetchGenreData();
    }
  }, [genre]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const getGenreIcon = (genre: string) => {
    const icons: Record<string, string> = {
      'Fantasy': '🐉',
      'Science Fiction': '🚀',
      'Romance': '💕',
      'Mystery': '🔍',
      'Thriller': '😱',
      'Horror': '👻',
      'Historical Fiction': '📜',
      'Literary Fiction': '📚',
      'Non-Fiction': '📖',
      'Biography': '👤',
    };
    return icons[genre] || '📚';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{getGenreIcon(genre)}</span>
            <div>
              <h1 className="text-4xl font-bold">{genre} Community</h1>
              <p className="text-blue-100">Explore books, connect with readers, and join discussions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Books</p>
                <p className="text-3xl font-bold text-gray-900">{genreData?.bookCount || 0}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clubs</p>
                <p className="text-3xl font-bold text-gray-900">{genreData?.clubCount || 0}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Community Members</p>
                <p className="text-3xl font-bold text-gray-900">
                  {((genreData?.clubCount || 0) * 50).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Genre Selection */}
        <div className="mb-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore Other Genres</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {GENRES.map(g => (
              <Link
                key={g}
                href={`/genre/${g.replace(/\s+/g, '-').toLowerCase()}`}
                className={`p-3 text-center rounded-lg font-medium transition ${
                  g === genre
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {g}
              </Link>
            ))}
          </div>
        </div>

        {/* Top Books */}
        {genreData && genreData.topBooks.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Books</h2>
              <Link href={`/library?genre=${encodeURIComponent(genre)}`} className="text-blue-600 hover:text-blue-700 font-semibold">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {genreData.topBooks.map(book => (
                <Link
                  key={book.id}
                  href={`/library/${book.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  <div
                    className="h-40 bg-gradient-to-br from-blue-400 to-purple-500"
                    style={{
                      backgroundImage: book.coverUrl ? `url(${book.coverUrl})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      by {book.uploadedBy?.displayName || book.uploadedBy?.username}
                    </p>
                    <div className="text-xs text-gray-500">
                      {book.downloadCount} downloads
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Top Clubs */}
        {genreData && genreData.topClubs.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Popular Clubs</h2>
              <Link href={`/clubs?genre=${encodeURIComponent(genre)}`} className="text-blue-600 hover:text-blue-700 font-semibold">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {genreData.topClubs.map(club => (
                <Link
                  key={club.id}
                  href={`/clubs/${club.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{club.name}</h3>
                      <p className="text-sm text-blue-600">
                        {club.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                  {club.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{club.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {genreData && genreData.bookCount === 0 && genreData.clubCount === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <span className="text-5xl mb-4 block">{getGenreIcon(genre)}</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to {genre}!
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to share books and create clubs in this genre
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/upload" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg">
                Upload a Book
              </Link>
              <Link href="/clubs/create" className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-6 rounded-lg">
                Create a Club
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
