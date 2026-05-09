import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuth } from '@/lib/auth';
import { ReadingStreakDisplay } from '@/components/reading/ReadingStreakDisplay';
import { ReadingLogForm } from '@/components/reading/ReadingLogForm';
import { BarChart3, ArrowLeft, Zap, Info } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Reading Stats | BookVerse',
  description: 'Track your reading streaks and statistics on BookVerse',
};

export default async function ReadingStatsPage() {
  const user = await getAuth();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Minimal Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Dashboard
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">Reading Analytics</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">Track your reading streaks, velocity, and scholarly objectives.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 border border-zinc-100 dark:border-zinc-800 rounded-md">
            <BarChart3 className="w-3.5 h-3.5" />
            Performance Protocol
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 mb-12">
          <div className="lg:col-span-2 bg-white dark:bg-zinc-950 p-8">
            <ReadingStreakDisplay userId={user.id} />
          </div>

          <div className="bg-white dark:bg-zinc-950 p-8">
            <ReadingLogForm userId={user.id} />
          </div>
        </div>

        {/* Minimal Habit Guide */}
        <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-4 h-4 text-zinc-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Optimization Strategies</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: '01', text: 'Establish a daily reading window to build momentum.' },
              { id: '02', text: 'Register logs daily to maintain streak integrity.' },
              { id: '03', text: 'Engage with community hubs for sustained motivation.' },
              { id: '04', text: 'Acquire milestones to unlock advanced badges.' },
              { id: '05', text: 'Coordinate with peers to compare performance metrics.' }
            ].map((tip) => (
              <div key={tip.id} className="flex gap-4">
                <span className="text-[10px] font-bold font-mono text-zinc-300">{tip.id}</span>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
