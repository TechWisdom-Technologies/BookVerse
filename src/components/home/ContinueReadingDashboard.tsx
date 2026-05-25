'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, Trash2, Zap, BookOpen, Bookmark, Play, AlertCircle, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface StoryProgressItem {
  id: string;
  storyId: string;
  chapterId: string;
  percentage: number;
  story: {
    id: string;
    title: string;
    coverUrl: string | null;
    author: {
      displayName: string | null;
      username: string;
    };
  };
  nextChapter?: {
    id: string;
    title: string;
  } | null;
}

interface BookBookmarkItem {
  id: string;
  bookId: string;
  pageNumber: number;
  book: {
    id: string;
    title: string;
    coverUrl: string | null;
    authorName: string;
  };
}

interface ContinueReadingDashboardProps {
  initialStories: StoryProgressItem[];
  initialBooks: BookBookmarkItem[];
}

export function ContinueReadingDashboard({ initialStories, initialBooks }: ContinueReadingDashboardProps) {
  const [stories, setStories] = useState<StoryProgressItem[]>(initialStories);
  const [books, setBooks] = useState<BookBookmarkItem[]>(initialBooks);

  // Animation states for smooth fade-outs
  const [deletingStories, setDeletingStories] = useState<string[]>([]);
  const [deletingBooks, setDeletingBooks] = useState<string[]>([]);

  // Confirmation state per card to prevent accidental deletes
  const [storyConfirmDeleteId, setStoryConfirmDeleteId] = useState<string | null>(null);
  const [bookConfirmDeleteId, setBookConfirmDeleteId] = useState<string | null>(null);

  const handleDeleteStoryProgress = async (storyId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If click triggers confirmation phase
    if (storyConfirmDeleteId !== storyId) {
      setStoryConfirmDeleteId(storyId);
      // Cancel book confirm to focus on this one
      setBookConfirmDeleteId(null);
      return;
    }

    try {
      // Add to deleting animation array
      setDeletingStories((prev) => [...prev, storyId]);
      
      // Wait for exit transition (300ms)
      await new Promise((resolve) => setTimeout(resolve, 300));

      const res = await fetch(`/api/stories/${storyId}/progress`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setStories((prev) => prev.filter((item) => item.storyId !== storyId));
        toast.success('Story progress cleared 🗑️');
      } else {
        // Rollback animation if failed
        setDeletingStories((prev) => prev.filter((id) => id !== storyId));
        toast.error('Failed to clear progress');
      }
    } catch (err) {
      console.error('Error deleting story progress:', err);
      setDeletingStories((prev) => prev.filter((id) => id !== storyId));
      toast.error('Failed to clear progress');
    } finally {
      setStoryConfirmDeleteId(null);
    }
  };

  const handleDeleteBookBookmark = async (bookId: string, annotationId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If click triggers confirmation phase
    if (bookConfirmDeleteId !== annotationId) {
      setBookConfirmDeleteId(annotationId);
      // Cancel story confirm to focus on this one
      setStoryConfirmDeleteId(null);
      return;
    }

    try {
      // Add to deleting animation array
      setDeletingBooks((prev) => [...prev, annotationId]);

      // Wait for exit transition (300ms)
      await new Promise((resolve) => setTimeout(resolve, 300));

      const res = await fetch(`/api/books/${bookId}/annotations`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ annotationId }),
      });

      if (res.ok) {
        setBooks((prev) => prev.filter((item) => item.id !== annotationId));
        toast.success('Bookmark removed 🗑️');
      } else {
        // Rollback animation if failed
        setDeletingBooks((prev) => prev.filter((id) => id !== annotationId));
        toast.error('Failed to remove bookmark');
      }
    } catch (err) {
      console.error('Error deleting book bookmark:', err);
      setDeletingBooks((prev) => prev.filter((id) => id !== annotationId));
      toast.error('Failed to remove bookmark');
    } finally {
      setBookConfirmDeleteId(null);
    }
  };

  const cancelDelete = (type: 'story' | 'book', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'story') {
      setStoryConfirmDeleteId(null);
    } else {
      setBookConfirmDeleteId(null);
    }
  };

  if (stories.length === 0 && books.length === 0) return null;

  return (
    <section className="py-20 px-6 border-b border-zinc-100 dark:border-zinc-900 bg-gradient-to-b from-zinc-50/70 to-white dark:from-zinc-950/40 dark:to-zinc-950 relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-400/5 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-400/5 dark:bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-400/5 dark:bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Modern Header Section */}
        <div className="flex items-center justify-between pb-5 border-b border-zinc-150/80 dark:border-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 dark:border-blue-400/20">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200">Continue Reading</h2>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Pick up right where you left off</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider">Active Stories</span>
          </div>
        </div>

        {/* Dash Grid */}
        <div className="flex flex-col gap-12">
          
          {/* Stories In Progress */}
          {stories.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pl-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-widest">In-Progress Stories</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30 font-bold font-mono">
                  {stories.length} remaining
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {stories.map((prog) => {
                  const isDeleting = deletingStories.includes(prog.storyId);
                  const isConfirming = storyConfirmDeleteId === prog.storyId;
                  const hasNextChapter = !!(prog.percentage >= 98 && prog.nextChapter);
                  
                  return (
                    <div
                      key={prog.id}
                      style={{
                        maxHeight: isDeleting ? '0px' : '220px',
                        marginBottom: isDeleting ? '-20px' : '0px',
                        transform: isDeleting ? 'scale(0.9) translateY(10px)' : 'scale(1) translateY(0px)',
                      }}
                      className={`group relative rounded-2xl border ${
                        isConfirming 
                          ? 'border-red-500/50 dark:border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
                          : 'border-zinc-150/60 dark:border-zinc-900/80 hover:border-indigo-400/50 dark:hover:border-indigo-500/40 hover:shadow-indigo-500/[0.04] dark:hover:shadow-indigo-500/[0.06]'
                      } bg-white/50 dark:bg-zinc-950/20 backdrop-blur-xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden`}
                    >
                      {/* Ambient background light for cards */}
                      <div className="absolute top-0 right-0 -mt-10 -mr-10 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 blur-xl group-hover:scale-125 transition duration-500" />
                      
                      <div className="flex gap-5 items-stretch relative z-10">
                        {/* Cover Image container */}
                        <div className="relative aspect-[2/3] w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-md transition duration-500 group-hover:shadow-xl group-hover:border-indigo-400/40 dark:group-hover:border-indigo-500/30">
                          {prog.story.coverUrl ? (
                            <img 
                              src={prog.story.coverUrl} 
                              alt={prog.story.title} 
                              className="object-cover h-full w-full group-hover:scale-105 transition duration-500 ease-out" 
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-xs uppercase tracking-widest">
                              {prog.story.title[0]}
                            </div>
                          )}
                          
                          {/* Pulsing play icon overlay on card hover */}
                          <div className="absolute inset-0 bg-indigo-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="p-2.5 rounded-full bg-white text-indigo-600 shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                              <Play className="w-4 h-4 fill-indigo-600" />
                            </div>
                          </div>
                        </div>

                        {/* Story details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 pr-2">
                          <div className="space-y-1">
                            <Link
                              href={hasNextChapter && prog.nextChapter ? `/stories/${prog.story.id}/chapters/${prog.nextChapter.id}` : `/stories/${prog.story.id}/chapters/${prog.chapterId}`}
                              className="block"
                            >
                              <h4 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                                {prog.story.title}
                              </h4>
                            </Link>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate">
                              by {prog.story.author.displayName || prog.story.author.username}
                            </p>
                          </div>

                          {/* Progress display details */}
                          <div className="space-y-2.5 pt-2">
                            {hasNextChapter ? (
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20 animate-pulse" />
                                  Next: {prog.nextChapter?.title}
                                </span>
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 bg-zinc-100 dark:bg-zinc-800/80 h-2 rounded-full overflow-hidden border border-zinc-200/20 dark:border-zinc-800/30">
                                    <div className="h-full bg-emerald-500 dark:bg-emerald-450 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" style={{ width: "100%" }} />
                                  </div>
                                  <span className="text-[10px] font-mono font-extrabold text-emerald-500 bg-emerald-500/10 dark:bg-emerald-400/10 px-1.5 py-0.5 rounded">100%</span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                                  <span>Reading progress</span>
                                  <span className="text-zinc-500 dark:text-zinc-300">{Math.round(prog.percentage)}% completed</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 bg-zinc-100 dark:bg-zinc-800/80 h-2 rounded-full overflow-hidden border border-zinc-200/20 dark:border-zinc-800/30 group-hover:border-indigo-400/20">
                                    <div
                                      className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(99,102,241,0.2)] group-hover:scale-y-105"
                                      style={{ width: `${prog.percentage}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Interactive Confirmation and Deletion HUD */}
                      <div className="absolute right-4 top-4 flex items-center gap-1.5 z-20">
                        {isConfirming ? (
                          <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-900/60 rounded-xl p-1.5 shadow-md animate-fade-in">
                            <span className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest px-2 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-red-500" /> Remove?
                            </span>
                            <button
                              onClick={(e) => handleDeleteStoryProgress(prog.storyId, e)}
                              className="p-1 rounded-lg bg-red-500 hover:bg-red-600 text-white transition duration-200"
                              title="Confirm Remove"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => cancelDelete('story', e)}
                              className="p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition duration-200"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => handleDeleteStoryProgress(prog.storyId, e)}
                            className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-zinc-200/30 hover:border-red-200 dark:hover:border-red-900/40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md transition-all duration-200 shadow-sm md:opacity-0 md:group-hover:opacity-100"
                            title="Remove from Continue Reading"
                            aria-label="Remove Progress"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Books In Progress */}
          {books.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pl-1">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-widest">Bookmarked Books</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 font-bold font-mono">
                  {books.length} remaining
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {books.map((bookmark) => {
                  const isDeleting = deletingBooks.includes(bookmark.id);
                  const isConfirming = bookConfirmDeleteId === bookmark.id;
                  
                  return (
                    <div
                      key={bookmark.id}
                      style={{
                        maxHeight: isDeleting ? '0px' : '220px',
                        marginBottom: isDeleting ? '-20px' : '0px',
                        transform: isDeleting ? 'scale(0.9) translateY(10px)' : 'scale(1) translateY(0px)',
                      }}
                      className={`group relative rounded-2xl border ${
                        isConfirming 
                          ? 'border-red-500/50 dark:border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
                          : 'border-zinc-150/60 dark:border-zinc-900/80 hover:border-emerald-400/50 dark:hover:border-emerald-500/40 hover:shadow-emerald-500/[0.04] dark:hover:shadow-emerald-500/[0.06]'
                      } bg-white/50 dark:bg-zinc-950/20 backdrop-blur-xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden`}
                    >
                      {/* Ambient background light for cards */}
                      <div className="absolute top-0 right-0 -mt-10 -mr-10 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 blur-xl group-hover:scale-125 transition duration-500" />

                      <div className="flex gap-5 items-stretch relative z-10">
                        {/* Cover Image container */}
                        <div className="relative aspect-[2/3] w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-md transition duration-500 group-hover:shadow-xl group-hover:border-emerald-400/40 dark:group-hover:border-emerald-500/30">
                          {bookmark.book.coverUrl ? (
                            <img 
                              src={bookmark.book.coverUrl} 
                              alt={bookmark.book.title} 
                              className="object-cover h-full w-full group-hover:scale-105 transition duration-500 ease-out" 
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 flex items-center justify-center font-bold text-white text-xs uppercase tracking-widest">
                              {bookmark.book.title[0]}
                            </div>
                          )}

                          {/* Pulsing play icon overlay on card hover */}
                          <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <div className="p-2.5 rounded-full bg-white text-emerald-600 shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                              <Play className="w-4 h-4 fill-emerald-600" />
                            </div>
                          </div>
                        </div>

                        {/* Book details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 pr-2">
                          <div className="space-y-1">
                            <Link href={`/library/${bookmark.book.id}/read`} className="block">
                              <h4 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                                {bookmark.book.title}
                              </h4>
                            </Link>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate">
                              by {bookmark.book.authorName}
                            </p>
                          </div>

                          {/* Pages indicator and tags */}
                          <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold tracking-wider uppercase border border-emerald-100/50 dark:border-emerald-900/20 font-mono shadow-sm">
                                Page {bookmark.pageNumber}
                              </span>
                              <span className="text-[10px] font-bold text-zinc-300 dark:text-zinc-800">•</span>
                              <span className="text-[9px] font-bold tracking-widest text-zinc-450 dark:text-zinc-500 uppercase flex items-center gap-1">
                                <Bookmark className="w-3 h-3 text-emerald-500/80" /> Bookmarked
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-550 font-medium leading-relaxed italic">
                              Click card to resume reading standard epub/pdf view.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Confirmation and Deletion HUD */}
                      <div className="absolute right-4 top-4 flex items-center gap-1.5 z-20">
                        {isConfirming ? (
                          <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-900/60 rounded-xl p-1.5 shadow-md animate-fade-in">
                            <span className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest px-2 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-red-500" /> Remove?
                            </span>
                            <button
                              onClick={(e) => handleDeleteBookBookmark(bookmark.book.id, bookmark.id, e)}
                              className="p-1 rounded-lg bg-red-500 hover:bg-red-600 text-white transition duration-200"
                              title="Confirm Remove"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => cancelDelete('book', e)}
                              className="p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition duration-200"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => handleDeleteBookBookmark(bookmark.book.id, bookmark.id, e)}
                            className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-zinc-200/30 hover:border-red-200 dark:hover:border-red-900/40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md transition-all duration-200 shadow-sm md:opacity-0 md:group-hover:opacity-100"
                            title="Remove Bookmark"
                            aria-label="Remove Bookmark"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
