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
  const [pageNumber, setPageNumber] = useState(1);
  const [type, setType] = useState<Annotation['type']>('NOTE');
  const [content, setContent] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const [saving, setSaving] = useState(false);

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
    } catch {
      toast.error('Failed to delete annotation');
    }
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/books/${bookId}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageNumber,
          type,
          content,
          highlightedText,
          highlightColor: type === 'HIGHLIGHT' ? '#facc15' : null,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to add annotation');
      setAnnotations((prev) => [data, ...prev]);
      setContent('');
      setHighlightedText('');
      toast.success('Annotation added');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add annotation');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading annotations...</div>;

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg mb-3">Your Annotations</h3>
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={1}
            value={pageNumber}
            onChange={(event) => setPageNumber(Number(event.target.value))}
            className="rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
            aria-label="Page number"
          />
          <select
            value={type}
            onChange={(event) => setType(event.target.value as Annotation['type'])}
            className="rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
            aria-label="Annotation type"
          >
            <option value="NOTE">Note</option>
            <option value="BOOKMARK">Bookmark</option>
            <option value="HIGHLIGHT">Highlight</option>
          </select>
        </div>
        {type === 'HIGHLIGHT' && (
          <input
            value={highlightedText}
            onChange={(event) => setHighlightedText(event.target.value)}
            className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
            placeholder="Highlighted text"
          />
        )}
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="w-full resize-none rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
          rows={3}
          placeholder="Annotation note"
        />
        <button
          onClick={handleCreate}
          disabled={saving}
          className="w-full rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Add Annotation'}
        </button>
      </div>
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
