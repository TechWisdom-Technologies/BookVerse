'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Download } from 'lucide-react';

interface SimilarBook {
  id: string;
  title: string;
  genre: string;
  coverUrl?: string;
  author: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  rating: string;
  reviewCount: number;
  downloadCount: number;
}

interface SimilarBooksProps {
  bookId: string;
}

export function SimilarBooks({ bookId }: SimilarBooksProps) {
  const [books, setBooks] = useState<SimilarBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/books/${bookId}/similar`);
        if (res.ok) {
          const data = await res.json();
          setBooks(data.similar);
        }
      } catch (error) {
        console.error('Error fetching similar books:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchSimilar();
    }
  }, [bookId]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading recommendations...</div>;
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Readers Also Enjoyed</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(book => (
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

              <p className="text-sm text-blue-600 font-medium mb-2">{book.genre}</p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">{book.rating}</span>
                  <span className="text-xs text-gray-500">({book.reviewCount})</span>
                </div>
              </div>

              <div className="text-xs text-gray-600 mb-2">
                by {book.author.displayName || book.author.username}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Download className="w-3 h-3" />
                <span>{book.downloadCount} downloads</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
