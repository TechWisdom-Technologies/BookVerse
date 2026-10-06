'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getFriendlyErrorMessage } from '@/lib/friendly-errors';
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
      toast.error(getFriendlyErrorMessage(error, 'Failed to add annotation. Please try again.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white flex items-center gap-2">
          <BookmarkIcon className="w-3.5 h-3.5" />
          Reading Notes
        </h3>
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 px-2 py-1 bg-zinc-50 dark:bg-zinc-900 rounded">
          {annotations.length} Saved
        </span>
      </div>

      <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Page No.</label>
            <input
              type="number"
              min={1}
              value={pageNumber}
              onChange={(event) => setPageNumber(Number(event.target.value))}
              className="w-full rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2.5 text-xs outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
              aria-label="Page number"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Type</label>
            <div className="relative">
              <select
                value={type}
                onChange={(event) => setType(event.target.value as Annotation['type'])}
                className="w-full appearance-none rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2.5 text-xs outline-none focus:border-zinc-900 dark:focus:border-white transition-colors cursor-pointer"
                aria-label="Annotation type"
              >
                <option value="NOTE">Note</option>
                <option value="BOOKMARK">Bookmark</option>
                <option value="HIGHLIGHT">Highlight</option>
              </select>
            </div>
          </div>
        </div>
        
        {type === 'HIGHLIGHT' && (
          <div className="space-y-1.5 animate-in slide-in-from-top-2 opacity-0 fade-in duration-300" style={{ animationFillMode: 'forwards' }}>
            <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Highlighted Text</label>
            <input
              value={highlightedText}
              onChange={(event) => setHighlightedText(event.target.value)}
              className="w-full rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-2.5 text-xs outline-none focus:border-zinc-900 dark:focus:border-white transition-colors"
              placeholder="Enter the text you want to highlight..."
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Your Note</label>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="w-full resize-none rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-3 py-3 text-xs outline-none focus:border-zinc-900 dark:focus:border-white transition-colors min-h-[100px]"
            placeholder="Write your thoughts here..."
          />
        </div>

        <button
          onClick={handleCreate}
          disabled={saving}
          className="w-full rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? 'Saving...' : 'Add Annotation'}
        </button>
      </div>

      {/* Annotations List */}
      <div className="space-y-4">
        {annotations.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/10">
            <Highlighter className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">No annotations yet</p>
          </div>
        ) : (
          annotations.map((ann) => (
            <div
              key={ann.id}
              className="group relative p-5 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all shadow-sm hover:shadow-md"
            >
              <div 
                className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full"
                style={{ backgroundColor: ann.highlightColor || (ann.type === 'BOOKMARK' ? '#3b82f6' : '#a1a1aa') }}
              />
              
              <div className="flex items-start justify-between pl-3 gap-6">
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-2 py-1 rounded">
                      Page {ann.pageNumber}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">
                      • {ann.type}
                    </span>
                  </div>
                  
                  {ann.highlightedText && (
                    <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
                      "{ann.highlightedText}"
                    </div>
                  )}
                  
                  {ann.content && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {ann.content}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => handleDelete(ann.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded transition-all"
                  title="Delete annotation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
