'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { BookmarkIcon, Highlighter, Trash2 } from 'lucide-react';

interface Annotation {
  id: string;
  pageNumber: number;
  type: 'BOOKMARK' | 'HIGHLIGHT' | 'NOTE';
  content?: string;
  highlightColor?: string;
  highlightedText?: string;
}

export function BookAnnotations({ bookId }: { bookId: string }) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnotations = async () => {
      try {
        const res = await fetch(`/api/books/${bookId}/annotations`);
        const data = await res.json();
        setAnnotations(data);
      } catch (error) {
        console.error('Failed to fetch annotations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnotations();
  }, [bookId]);

  const handleDelete = async (annotationId: string) => {
    try {
      const res = await fetch(`/api/books/${bookId}/annotations`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ annotationId }),
      });

      if (!res.ok) throw new Error('Failed to delete');
      setAnnotations((prev) => prev.filter((a) => a.id !== annotationId));
      toast.success('Annotation deleted');
    } catch (error) {
      toast.error('Failed to delete annotation');
    }
  };

  if (loading) return <div>Loading annotations...</div>;

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg mb-3">Your Annotations</h3>
      {annotations.length === 0 ? (
        <p className="text-gray-500">No annotations yet</p>
      ) : (
        annotations.map((ann) => (
          <div
            key={ann.id}
            className="p-3 bg-gray-50 rounded-lg border-l-4"
            style={{ borderLeftColor: ann.highlightColor || '#3b82f6' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                {ann.type === 'BOOKMARK' ? (
                  <BookmarkIcon className="w-4 h-4 text-blue-600 mt-1" />
                ) : (
                  <Highlighter className="w-4 h-4 text-yellow-600 mt-1" />
                )}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Page {ann.pageNumber}</p>
                  {ann.highlightedText && (
                    <p className="text-sm italic text-gray-700 mb-2">
                      &ldquo;{ann.highlightedText}&rdquo;
                    </p>
                  )}
                  {ann.content && <p className="text-sm">{ann.content}</p>}
                </div>
              </div>
              <button
                onClick={() => handleDelete(ann.id)}
                className="p-1 hover:bg-red-100 rounded"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
