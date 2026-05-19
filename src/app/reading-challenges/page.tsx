"use client";

import { useEffect, useState } from 'react';
import { 
  Trophy, 
  Loader2, 
  ArrowLeft, 
  CheckCircle2, 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';

interface Challenge {
  id: string;
  title: string;
  description: string;
  genre: string;
  targetBooks: number;
  startDate: string;
  endDate: string;
  participants: Array<{ userId: string }>;
}

export default function ReadingChallengesPage() {
  const { dbUser } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgradeUrl, setUpgradeUrl] = useState<string | null>(null);
  const [filter, setFilter] = useState('ACTIVE');
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => { fetchChallenges(); }, [filter]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reading-challenges?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setChallenges(data);
        setUpgradeUrl(null);
      } else if (res.status === 402) {
        const data = await res.json();
        setUpgradeUrl(data.upgradeUrl || '/premium/checkout?plan=pro');
      }
    } finally { setLoading(false); }
  };

  const handleParticipate = async (challengeId: string) => {
    if (!dbUser) return toast.error('Please login first.');
    try {
      setJoiningId(challengeId);
      const res = await fetch(`/api/reading-challenges/${challengeId}/participate`, { method: 'POST' });
      if (res.ok) {
        toast.success('Challenge started!');
        fetchChallenges();
      } else if (res.status === 402) {
        const data = await res.json();
        setUpgradeUrl(data.upgradeUrl || '/premium/checkout?plan=pro');
        toast.error('Pro plan required for reading challenges.');
      }
    } finally { setJoiningId(null); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
    </div>
  );

  if (upgradeUrl) return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-6">
      <div className="text-center space-y-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 italic">Pro plan required for reading challenges.</p>
        <Link href={upgradeUrl} className="inline-flex px-8 py-3 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest">
          Upgrade to Pro
        </Link>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Simple Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Reading Challenges.</h1>
              <p className="text-xs text-zinc-500 font-medium">Join fun reading goals to build a better reading habit.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded">
            Challenges: {challenges.length}
          </div>
        </header>

        {/* Simple Filter */}
        <div className="mb-12 flex items-center justify-center">
          <div className="flex gap-1 p-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded">
            {['ACTIVE', 'UPCOMING', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                  filter === status 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Challenge Grid */}
        {challenges.length === 0 ? (
          <div className="py-40 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No challenges found in this section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
            {challenges.map((challenge) => {
              const isParticipating = dbUser && challenge.participants.some(p => p.userId === dbUser.id);
              const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div key={challenge.id} className="group p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 border border-zinc-100 dark:border-zinc-800 rounded">
                      {challenge.genre}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                      {daysLeft > 0 ? `${daysLeft} Days left` : 'Finished'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold mb-2 uppercase tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                    {challenge.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mb-10 line-clamp-2">
                    {challenge.description}
                  </p>

                  <div className="grid grid-cols-2 gap-px bg-zinc-50 dark:bg-zinc-900 border border-zinc-50 dark:border-zinc-900 mb-10">
                    <div className="p-4 bg-white dark:bg-zinc-950 flex flex-col">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-300 mb-1">Goal</span>
                      <span className="text-[11px] font-bold uppercase">{challenge.targetBooks} Books</span>
                    </div>
                    <div className="p-4 bg-white dark:bg-zinc-950 flex flex-col text-right">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-300 mb-1">Players</span>
                      <span className="text-[11px] font-bold uppercase">{challenge.participants.length} joined</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    {isParticipating ? (
                      <div className="w-full py-2.5 border border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-[9px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 rounded">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Joined
                      </div>
                    ) : (
                      <button
                        onClick={() => handleParticipate(challenge.id)}
                        disabled={joiningId === challenge.id}
                        className="w-full py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-bold uppercase tracking-[0.3em] rounded transition-all flex items-center justify-center gap-2"
                      >
                        {joiningId === challenge.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Join Challenge'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Simple Footer Info */}
        <div className="mt-32 pt-12 border-t border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-3 text-zinc-300 opacity-40">
            <Trophy className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Read, Write, Connect — V2.4.0</span>
          </div>
        </div>
      </div>
    </main>
  );
}
