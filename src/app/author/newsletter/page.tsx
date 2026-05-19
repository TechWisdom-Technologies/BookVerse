'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Mail, Users, Loader2, Search, ArrowLeft, Lightbulb } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface Subscriber {
  id: string;
  subscriber: {
    id: string;
    username: string;
    displayName?: string;
    email: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

export default function NewsletterManagementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgradeUrl, setUpgradeUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login?redirect=/author/newsletter'); return; }
    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/author/newsletter');
        if (res.ok) {
          const data = await res.json();
          setSubscribers(data.subscribers);
          setFilteredSubscribers(data.subscribers);
        } else if (res.status === 402) {
          const data = await res.json();
          setUpgradeUrl(data.upgradeUrl || '/premium/checkout?plan=creator');
        } else {
          toast.error('Failed to load subscribers');
        }
      } catch {
        toast.error('An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, [user, authLoading, router]);

  useEffect(() => {
    const filtered = subscribers.filter(
      sub =>
        sub.subscriber.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.subscriber.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.subscriber.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSubscribers(filtered);
  }, [searchQuery, subscribers]);

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
    </div>
  );

  if (upgradeUrl) return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-6">
      <div className="text-center space-y-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 italic">Creator plan required for subscriber management.</p>
        <Link href={upgradeUrl} className="inline-flex px-8 py-3 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest">
          Upgrade to Creator
        </Link>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Minimal Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/write" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Studio
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">Transmission Studio.</h1>
              <p className="text-xs text-zinc-500 font-medium">Broadcast protocols and reader community management.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 border border-zinc-100 dark:border-zinc-800 rounded-md">
            <Mail className="w-3.5 h-3.5" />
            Broadcast Registry
          </div>
        </header>

        {/* Metrics Snapshot */}
        <div className="mb-12 p-8 border border-zinc-100 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/10 rounded-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Subscribers</span>
            <div className="text-3xl font-bold tracking-tight">{subscribers.length.toLocaleString()}</div>
          </div>
          <Users className="w-8 h-8 text-zinc-200 dark:text-zinc-800" />
        </div>

        {/* Subscriber Registry */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-50 dark:border-zinc-900">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Archival Subscriber Log</h2>
            </div>
            
            {/* Surgical Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-300" />
              <input
                type="text"
                placeholder="Search registry..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-md text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all w-64"
              />
            </div>
          </div>

          {filteredSubscribers.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                {subscribers.length === 0 ? 'No active transmissions registered.' : 'No matches found in registry.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900">
                    <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Subscriber Identity</th>
                    <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Email Record</th>
                    <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">System Username</th>
                    <th className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Registry Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {filteredSubscribers.map(subscriber => (
                    <tr key={subscriber.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          {subscriber.subscriber.avatarUrl ? (
                            <img src={subscriber.subscriber.avatarUrl} alt="" className="w-6 h-6 rounded" />
                          ) : (
                            <div className="w-6 h-6 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-400 uppercase">
                              {subscriber.subscriber.username.charAt(0)}
                            </div>
                          )}
                          <span className="text-xs font-bold text-zinc-900 dark:text-white">
                            {subscriber.subscriber.displayName || subscriber.subscriber.username}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-[10px] font-mono text-zinc-500">{subscriber.subscriber.email}</td>
                      <td className="py-4 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">@{subscriber.subscriber.username}</td>
                      <td className="py-4 px-2 text-right text-[10px] font-mono text-zinc-300">
                        {new Date(subscriber.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Growth Advisory Dossier */}
        <section className="p-8 border border-zinc-100 dark:border-zinc-900 bg-zinc-50/10 dark:bg-zinc-900/5 rounded-lg">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-3.5 h-3.5 text-zinc-400" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Transmission Optimization Protocols</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Embed 'Transmission Subscription' modules on core profiles.",
              "Announce archival updates and new manuscript chapters.",
              "Offer exclusive registry content for subscribers.",
              "Engage with community feedback loops.",
              "Share writing trajectory milestones and system updates."
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 text-xs text-zinc-500 font-medium leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0 mt-1.5" />
                {tip}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
