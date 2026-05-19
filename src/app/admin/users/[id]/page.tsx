"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function UserDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      if (res.ok) setData(await res.json());
    } finally { setLoading(false); }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;
  if (!data?.user) return <div className="p-12">User not found.</div>;

  const { user, analytics } = data;

  const [isProcessing, setIsProcessing] = useState(false);

  const handleBan = async () => {
    if (!confirm('Ban this user? This will revoke access.')) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ban' }),
      });
      if (res.ok) {
        toast.success('User banned');
        fetchData();
      } else {
        toast.error('Failed to ban user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error');
    } finally { setIsProcessing(false); }
  };

  const handleSuspend = async () => {
    const until = prompt('Suspend until (YYYY-MM-DD), leave blank for indefinite');
    if (until === null) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'suspend', until: until || null }),
      });
      if (res.ok) {
        toast.success('User suspended');
        fetchData();
      } else {
        toast.error('Failed to suspend user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error');
    } finally { setIsProcessing(false); }
  };

  const handleExport = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export' }),
      });
      if (!res.ok) { toast.error('Failed to export user data'); return; }
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data.exported, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${id}-export.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Export downloaded');
    } catch (err) {
      console.error(err);
      toast.error('Error exporting data');
    } finally { setIsProcessing(false); }
  };

  const handleImpersonate = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'impersonate' }),
      });
      if (!res.ok) { toast.error('Failed to impersonate'); return; }
      const { token } = await res.json();
      if (!token) { toast.error('No token returned'); return; }
      await signInWithCustomToken(auth, token);
      toast.success('Signed in as user');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      toast.error('Error impersonating');
    } finally { setIsProcessing(false); }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6 flex items-center gap-6">
          <div className="relative h-16 w-16 rounded overflow-hidden bg-zinc-50 dark:bg-zinc-900">
            {user.avatarUrl ? <Image src={user.avatarUrl} alt="avatar" fill className="object-cover" /> : <div className="flex items-center justify-center">@</div>}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.displayName || user.username}</h1>
            <p className="text-sm text-zinc-500">@{user.username} • {user.email}</p>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={handleBan}
            disabled={isProcessing}
            className="px-3 py-2 bg-rose-600 text-white rounded text-sm font-bold disabled:opacity-50"
          >Ban</button>

          <button
            onClick={handleSuspend}
            disabled={isProcessing}
            className="px-3 py-2 bg-yellow-600 text-white rounded text-sm font-bold disabled:opacity-50"
          >Suspend</button>

          <button
            onClick={handleExport}
            disabled={isProcessing}
            className="px-3 py-2 bg-zinc-900 text-white rounded text-sm font-bold disabled:opacity-50"
          >Export Data</button>

          <button
            onClick={handleImpersonate}
            disabled={isProcessing}
            className="px-3 py-2 bg-indigo-600 text-white rounded text-sm font-bold disabled:opacity-50"
          >Impersonate</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="border border-zinc-100 dark:border-zinc-900 rounded p-4">
            <h2 className="text-sm font-bold uppercase text-zinc-400">Account</h2>
            <p className="mt-2"><strong>Role:</strong> {user.role}</p>
            <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleString()}</p>
            <p><strong>Membership Tier:</strong> {user.membershipTier || '—'}</p>
            <p><strong>Membership Expiry:</strong> {user.membershipExpiry ? new Date(user.membershipExpiry).toLocaleDateString() : '—'}</p>
          </div>

          <div className="border border-zinc-100 dark:border-zinc-900 rounded p-4">
            <h2 className="text-sm font-bold uppercase text-zinc-400">Analytics</h2>
            <p className="mt-2"><strong>Reaction Count:</strong> {user.reactionCount || 0}</p>
            <p><strong>Recent Reads (30d):</strong> {analytics?.recentReads || 0}</p>
            <p><strong>Books:</strong> {user._count?.books || 0}</p>
            <p><strong>Stories:</strong> {user._count?.stories || 0}</p>
            <p><strong>Followers:</strong> {user._count?.followers || 0}</p>
          </div>
        </div>

        <div className="border border-zinc-100 dark:border-zinc-900 rounded p-4 mb-6">
          <h2 className="text-sm font-bold uppercase text-zinc-400">Subscriptions & Relations</h2>
          <div className="mt-2">
            <p><strong>Author Subscriptions:</strong></p>
            <ul className="list-disc pl-6">
              {user.authorSubscriptions?.map((s: any) => (
                <li key={s.author.id}>{s.author.username} — {s.tier} • ${s.monthlyPrice}/mo</li>
              ))}
            </ul>
            <p className="mt-3"><strong>Newsletter Subscriptions:</strong></p>
            <ul className="list-disc pl-6">
              {user.newsletterSubs?.map((n: any) => (
                <li key={n.author.id}>{n.author.username} • subscribed {new Date(n.createdAt).toLocaleDateString()}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border border-zinc-100 dark:border-zinc-900 rounded p-4">
          <h2 className="text-sm font-bold uppercase text-zinc-400">Activity & Notices</h2>
          <div className="mt-2">
            <p><strong>DMCA Notices:</strong></p>
            <ul className="list-disc pl-6">
              {user.dmcaNotices?.map((d: any) => (
                <li key={d.id}><Link href={`/admin/dmca/${d.id}`}>{d.id}</Link> • {d.status}</li>
              ))}
            </ul>
            <p className="mt-3"><strong>Achievements:</strong></p>
            <ul className="list-disc pl-6">
              {user.achievements?.map((a: any) => (
                <li key={a.achievement.id}>{a.achievement.name} • {new Date(a.earnedAt).toLocaleDateString()}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
