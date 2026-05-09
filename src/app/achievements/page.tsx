import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuth } from '@/lib/auth';
import { AchievementsDisplay } from '@/components/achievements/AchievementsDisplay';
import { Award, ArrowLeft, Info, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Achievements | BookVerse',
  description: 'View your earned achievements and badges on BookVerse',
};

export default async function AchievementsPage() {
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
              <h1 className="text-2xl font-bold tracking-tight mb-2">Milestone Registry</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">Archived badges and achievements earned through scholarly engagement.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 border border-zinc-100 dark:border-zinc-800 rounded-md">
            <Award className="w-3.5 h-3.5" />
            Badge Protocol
          </div>
        </header>

        <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-lg mb-12">
          <AchievementsDisplay userId={user.id} maxDisplay={12} />
        </div>

        {/* Minimal Achievement Guide */}
        <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-zinc-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Acquisition Protocol</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: '📖', label: 'Avid Reader', task: 'Register 5 scholarly volumes.' },
              { id: '✍️', label: 'Archivist', task: 'Publish 3 original world-records.' },
              { id: '🔥', label: 'Velocity', task: 'Maintain a 7-day reading streak.' },
              { id: '👥', label: 'Sodality', task: 'Join a recognized literary club.' },
              { id: '💬', label: 'Engagement', task: 'Register 10 peer reactions.' }
            ].map((guide) => (
              <div key={guide.label} className="flex gap-4">
                <span className="text-sm shrink-0">{guide.id}</span>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-1">{guide.label}</h4>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">{guide.task}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
