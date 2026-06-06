'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { ArrowLeft, Users, Globe, Lock, Loader2, Sparkles } from 'lucide-react';

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
  'Self-Help',
  'Young Adult',
  'Children',
];

export default function CreateClubPage() {
  const router = useRouter();
  const { user, dbUser, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    genre: '',
    isPrivate: false,
    maxMembers: '50',
    coverUrl: '',
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 p-6">
        <div className="text-center space-y-4 max-w-sm">
          <span className="px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[9px] font-bold uppercase tracking-widest border border-red-100 dark:border-red-900/50">
            Authentication Required
          </span>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Please log in to create a book club</p>
          <Link
            href="/login"
            className="w-full inline-flex justify-center py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded border border-zinc-900 dark:border-white hover:opacity-90 transition-all shadow-md"
          >
            Authenticate Portal
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = dbUser && ['AUTHOR', 'PRO', 'CREATOR'].includes(dbUser.membershipTier?.toUpperCase() || '');

  if (!isAuthor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 p-6">
        <div className="text-center space-y-4 max-w-sm">
          <span className="px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[9px] font-bold uppercase tracking-widest border border-zinc-100 dark:border-zinc-800">
            Author Plan Required
          </span>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Upgrade to the Author plan to create and manage public book clubs.</p>
          <Link
            href="/premium/checkout?plan=author"
            className="w-full inline-flex justify-center py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded border border-zinc-900 dark:border-white hover:opacity-90 transition-all shadow-md"
          >
            Upgrade to Author
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleTogglePrivate = (val: boolean) => {
    setFormData(prev => ({
      ...prev,
      isPrivate: val
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Club name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/clubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const club = await res.json();
        toast.success('Book club initiated! 🎉');
        router.push(`/clubs/${club.id}`);
      } else if (res.status === 409) {
        toast.error('Book club name is already taken');
      } else {
        toast.error('Failed to create book club');
      }
    } catch (error) {
      console.error('Error creating club:', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Portal Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link
              href="/clubs"
              className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Book Clubs Archive
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Initiate Club.</h1>
              <p className="text-xs text-zinc-500 font-medium">Start a community around your favorite books, share reviews, and connect readers.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded shadow-sm">
            <Users className="w-3.5 h-3.5 text-zinc-300" />
            Archival Sector
          </div>
        </header>

        {/* Form Container */}
        <div className="border border-zinc-100 dark:border-zinc-900 rounded-xl p-8 bg-white dark:bg-zinc-950 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-zinc-900 dark:bg-white" />

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Name */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label htmlFor="name" className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                  Club Title <span className="text-rose-500">*</span>
                </label>
                <span className="text-[9px] font-mono text-zinc-400">
                  {formData.name.length}/100
                </span>
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., The Midnight Library Union"
                maxLength={100}
                required
                className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded outline-none focus:border-zinc-900 dark:focus:border-white transition-all text-xs font-medium"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label htmlFor="description" className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                  Description / Manifesto
                </label>
                <span className="text-[9px] font-mono text-zinc-400">
                  {formData.description.length}/500
                </span>
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Declare your book club's purpose, operational guidelines, and reading frequencies..."
                maxLength={500}
                rows={5}
                className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded outline-none focus:border-zinc-900 dark:focus:border-white transition-all text-xs leading-relaxed resize-none font-medium"
              />
            </div>

            {/* Cover Image URL */}
            <div className="space-y-2">
              <label htmlFor="coverUrl" className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                Cover Image URL (optional)
              </label>
              <input
                type="text"
                id="coverUrl"
                name="coverUrl"
                value={formData.coverUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded outline-none focus:border-zinc-900 dark:focus:border-white transition-all text-xs font-medium"
              />
              {formData.coverUrl ? (
                <div className="mt-2 w-40 h-24 rounded overflow-hidden border border-zinc-100 dark:border-zinc-800">
                  <img src={formData.coverUrl} alt="cover preview" className="w-full h-full object-cover" />
                </div>
              ) : null}
            </div>

            {/* Genre Selection */}
            <div className="space-y-2">
              <label htmlFor="genre" className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                Primary Genre Focus
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded outline-none focus:border-zinc-900 dark:focus:border-white transition-all text-[11px] font-bold uppercase tracking-widest text-zinc-500 cursor-pointer"
              >
                <option value="">Select Genre</option>
                {GENRES.map(genre => (
                  <option key={genre} value={genre}>
                    {genre.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Members Limit */}
            <div className="space-y-2">
              <label htmlFor="maxMembers" className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                Maximum Members Limit
              </label>
              <select
                id="maxMembers"
                name="maxMembers"
                value={formData.maxMembers}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded outline-none focus:border-zinc-900 dark:focus:border-white transition-all text-[11px] font-bold uppercase tracking-widest text-zinc-500 cursor-pointer"
              >
                <option value="10">10 MEMBERS</option>
                <option value="25">25 MEMBERS</option>
                <option value="50">50 MEMBERS</option>
                <option value="100">100 MEMBERS</option>
                <option value="250">250 MEMBERS</option>
                <option value="500">500 MEMBERS</option>
              </select>
            </div>

            {/* Privacy Toggles (Styled Premium Toggle Cards) */}
            <div className="space-y-3">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                Access Level & Privacy
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Public Selector */}
                <button
                  type="button"
                  onClick={() => handleTogglePrivate(false)}
                  className={`group flex items-start gap-4 p-5 border rounded text-left transition-all duration-300 ${
                    !formData.isPrivate 
                      ? 'border-zinc-950 dark:border-white bg-zinc-50/50 dark:bg-zinc-900/10 shadow-sm' 
                      : 'border-zinc-100 dark:border-zinc-900 hover:border-zinc-900 dark:hover:border-white bg-transparent'
                  }`}
                >
                  <div className={`p-2.5 rounded transition-colors ${
                    !formData.isPrivate 
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' 
                      : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white'
                  }`}>
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Public Sector</div>
                    <p className="text-[10px] text-zinc-400 font-medium italic">Open to all members. Anyone can view transcripts and join instantly.</p>
                  </div>
                </button>

                {/* Private Selector */}
                <button
                  type="button"
                  onClick={() => handleTogglePrivate(true)}
                  className={`group flex items-start gap-4 p-5 border rounded text-left transition-all duration-300 ${
                    formData.isPrivate 
                      ? 'border-zinc-950 dark:border-white bg-zinc-50/50 dark:bg-zinc-900/10 shadow-sm' 
                      : 'border-zinc-100 dark:border-zinc-900 hover:border-zinc-900 dark:hover:border-white bg-transparent'
                  }`}
                >
                  <div className={`p-2.5 rounded transition-colors ${
                    formData.isPrivate 
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' 
                      : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white'
                  }`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Private Sanctuary</div>
                    <p className="text-[10px] text-zinc-400 font-medium italic">Requires admin approval to enter. Safe space for restricted discussions.</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 rounded shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Initiate Book Club
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-4 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all flex items-center justify-center gap-2 border border-zinc-100 dark:border-zinc-900 hover:border-zinc-900 dark:hover:border-white"
              >
                Abort & Return
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
