"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowLeft, Loader2, Compass, Layers, Clock, Users, User, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface BookRequest {
  id: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  universe?: {
    id: string;
    name: string;
  } | null;
  series?: {
    id: string;
    name: string;
  } | null;
}

export default function BookRequestsDashboardPage() {
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookRequests();
  }, []);

  const fetchBookRequests = async () => {
    try {
      const res = await fetch('/api/book-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalRequests = requests.length;
  const universeRequests = requests.filter(r => !!r.universe).length;
  const seriesRequests = requests.filter(r => !!r.series).length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-6 h-6 animate-spin text-zinc-200 dark:text-zinc-800" />
    </div>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Simple Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/write" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Studio Hub
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Book Requests.</h1>
              <p className="text-sm text-zinc-500 font-medium">Hear your audience! Listen to fan requests for more volumes in your universes and series.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-300" />
            Audience Demand
          </div>
        </header>

        {/* Interactive Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-8 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Total Requests</div>
            <div className="text-4xl font-extrabold tracking-tight">{totalRequests.toString().padStart(2, '0')}</div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-2">Active fan requests</p>
          </div>
          <div className="p-8 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> Universe Requests</div>
            <div className="text-4xl font-extrabold tracking-tight text-indigo-500">{universeRequests.toString().padStart(2, '0')}</div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-2">Requests for shared settings</p>
          </div>
          <div className="p-8 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-xl shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Series Requests</div>
            <div className="text-4xl font-extrabold tracking-tight text-emerald-500">{seriesRequests.toString().padStart(2, '0')}</div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-2">Requests for next volumes</p>
          </div>
        </div>

        {/* Requests Feed */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-8 pb-3 border-b border-zinc-50 dark:border-zinc-900">
            <MessageSquare className="w-4 h-4 text-zinc-200" />
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">Live Request Stream</h2>
          </div>

          {requests.length === 0 ? (
            <div className="py-32 border border-dashed border-zinc-100 dark:border-zinc-900 rounded-xl bg-zinc-50/10 flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-12 h-12 text-zinc-100 dark:text-zinc-800 mb-8" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic mb-2">No requests received yet.</p>
              <p className="text-xs text-zinc-400 font-medium max-w-sm">Share your universes or series with the community and watch the book requests pour in!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <div key={r.id} className="p-6 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-zinc-800 shrink-0">
                      {r.user.avatarUrl ? (
                        <img src={r.user.avatarUrl} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{r.user.displayName || r.user.username}</span>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">@{r.user.username}</span>
                      </div>
                      
                      {/* Requested Entity Badge */}
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">wants a new book in</span>
                        {r.universe && (
                          <Link href={`/universes/${r.universe.id}`} className="px-2 py-0.5 rounded bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-500 border border-indigo-500/10 text-[9px] font-bold uppercase tracking-wider hover:underline flex items-center gap-1">
                            <Compass className="w-2.5 h-2.5" />
                            {r.universe.name}
                          </Link>
                        )}
                        {r.series && (
                          <Link href={`/series/${r.series.id}`} className="px-2 py-0.5 rounded bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-500 border border-emerald-500/10 text-[9px] font-bold uppercase tracking-wider hover:underline flex items-center gap-1">
                            <Layers className="w-2.5 h-2.5" />
                            {r.series.name}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Date and actions */}
                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-zinc-300" />
                      {formatDate(r.createdAt)}
                    </span>
                    {r.universe && (
                      <Link href="/write/new" className="px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[9px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 hover:opacity-90 shadow-sm transition-all group">
                        Fulfill Request <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    )}
                    {r.series && (
                      <Link href="/write/new" className="px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[9px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 hover:opacity-90 shadow-sm transition-all group">
                        Fulfill Request <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
