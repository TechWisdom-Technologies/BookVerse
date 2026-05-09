"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Library, Plus, Loader2, Trash2, Sparkles, Rocket, Globe, ChevronRight, BookOpen, Eye, ArrowLeft, Layers, Globe2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/components/auth/AuthProvider';

interface Universe {
  id: string;
  name: string;
  description?: string;
  genre: string;
  coverUrl?: string;
  viewCount: number;
  published: boolean;
  stories: Array<{
    id: string;
    title: string;
    coverUrl?: string;
    viewCount?: number;
  }>;
  user: { id: string; username: string; displayName: string };
}

export default function UniverseStudioPage() {
  const { dbUser } = useAuth();
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Fantasy');
  const [coverUrl, setCoverUrl] = useState('');

  const GENRES = [
    'Fantasy', 'Science Fiction', 'Romance', 'Mystery', 'Thriller', 'Horror', 'Historical Fiction', 'Literary Fiction',
  ];

  useEffect(() => {
    if (dbUser?.id) { fetchMyUniverses(); }
  }, [dbUser?.id]);

  const fetchMyUniverses = async () => {
    try {
      const res = await fetch(`/api/universes?userId=${dbUser?.id}`);
      if (res.ok) {
        const data = await res.json();
        setUniverses(data);
      }
    } finally { setLoading(false); }
  };

  const handleCreateUniverse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Name required.'); return; }
    try {
      setIsCreating(true);
      const res = await fetch('/api/universes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          genre,
          coverUrl: coverUrl.trim() || null,
        }),
      });
      if (res.ok) {
        toast.success('Universe created.');
        setName(''); setDescription(''); setGenre('Fantasy'); setCoverUrl('');
        fetchMyUniverses();
      }
    } finally { setIsCreating(false); }
  };

  const handleDeleteUniverse = async (universeId: string) => {
    if (!confirm('Delete this universe? This will detach all linked stories.')) return;
    try {
      const res = await fetch(`/api/universes/${universeId}`, { method: 'DELETE' });
      if (res.ok) { toast.success('Universe deleted.'); fetchMyUniverses(); }
    } catch (error) { toast.error('Failed to delete universe.'); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-6 h-6 animate-spin text-zinc-200 dark:text-zinc-800" />
    </div>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Simple Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/write" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              My Stories
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Universes.</h1>
              <p className="text-sm text-zinc-500 font-medium">Manage your story universes, lore, and narrative worlds.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded">
            <Globe2 className="w-3.5 h-3.5 text-zinc-300" />
            Universes
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-16">
          {/* Creation Form */}
          <aside>
            <div className="p-10 border border-zinc-100 dark:border-zinc-900 bg-zinc-50/10 rounded sticky top-24 shadow-sm">
              <div className="flex items-center gap-2 mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-900">
                <Plus className="w-3.5 h-3.5 text-zinc-300" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Create Universe</h2>
              </div>
              
              <form onSubmit={handleCreateUniverse} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Universe Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. My Epic Fantasy World" className="w-full px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us about this world..." rows={5} className="w-full px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm resize-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Cover Image URL</label>
                  <input type="text" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://..." className="w-full px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm" />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Genre</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GENRES.map((g) => (
                      <button key={g} type="button" onClick={() => setGenre(g)} className={`px-2 py-2 text-[9px] font-bold uppercase tracking-widest rounded border transition-all ${
                        genre === g ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm' : 'bg-transparent text-zinc-400 border-zinc-50 dark:border-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-700'
                      }`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={isCreating} className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all flex items-center justify-center gap-2 border border-zinc-900 dark:border-white shadow-md">
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Universe"}
                </button>
              </form>
            </div>
          </aside>

          {/* Universe Registry */}
          <section>
            <div className="flex items-center justify-between mb-10 pb-4 border-b border-zinc-50 dark:border-zinc-900">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-200" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">My Universes</h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 font-mono">{universes.length.toString().padStart(2, '0')} detected</span>
            </div>

            {universes.length === 0 ? (
              <div className="py-40 border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10 flex flex-col items-center justify-center text-center">
                <Library className="w-10 h-10 text-zinc-100 dark:text-zinc-800 mb-8" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">No universes created yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {universes.map((u) => (
                  <div key={u.id} className="p-8 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all group relative overflow-hidden shadow-sm">
                    {u.coverUrl && (
                      <div className="absolute top-0 right-0 w-48 h-full opacity-5 pointer-events-none">
                        <img src={u.coverUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent" />
                      </div>
                    )}
                    
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-400 border border-zinc-100 dark:border-zinc-800">
                              {u.genre}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 flex items-center gap-2">
                              <Eye className="w-3.5 h-3.5" /> {u.viewCount} Views
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors mb-3 uppercase tracking-tight">
                            {u.name}
                          </h3>
                          {u.description && <p className="text-[11px] text-zinc-500 font-medium leading-relaxed line-clamp-2 max-w-2xl italic">“{u.description}”</p>}
                        </div>
                        
                        <button onClick={() => handleDeleteUniverse(u.id)} className="p-2 text-zinc-200 hover:text-rose-500 hover:bg-rose-500/5 transition-all rounded">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-8 border-t border-zinc-50 dark:border-zinc-900">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                          {u.stories?.length || 0} Stories Linked
                        </span>
                        <Link href={`/universes/${u.id}`} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-white hover:underline underline-offset-8 transition-colors">
                          View Universe <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
