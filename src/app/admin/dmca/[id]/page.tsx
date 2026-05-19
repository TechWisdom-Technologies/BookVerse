"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Eye, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DMCADetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [notice, setNotice] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => { fetchNotice(); }, [id]);

  const fetchNotice = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/dmca/${id}`);
      if (res.ok) setNotice((await res.json()).notice);
    } finally { setLoading(false); }
  };

  const updateStatus = async (s: string) => {
    try {
      const res = await fetch(`/api/admin/dmca`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ noticeId: id, status: s }) });
      if (res.ok) fetchNotice();
    } catch (e) { console.error(e); }
  };

  const doDelete = async () => {
    if (!confirm("Permanently delete this DMCA notice?")) return;
    try {
      const res = await fetch(`/api/admin/dmca`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ noticeId: id }) });
      if (res.ok) router.push('/admin/dmca');
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;
  if (!notice) return <div className="p-12">Notice not found.</div>;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{notice.originalWorkTitle}</h1>
            <p className="text-sm text-zinc-500">Submitted by @{notice.submittedByUser?.username || 'unknown'} on {new Date(notice.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => updateStatus('ACKNOWLEDGED')} className="px-3 py-2 bg-zinc-50 rounded">Acknowledge</button>
            <button onClick={() => updateStatus('RESOLVED')} className="px-3 py-2 bg-emerald-50 rounded">Resolve</button>
            <button onClick={doDelete} className="px-3 py-2 bg-rose-50 rounded">Delete</button>
          </div>
        </div>

        <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 p-6">
          <h2 className="text-sm font-bold uppercase text-zinc-400">Claim Details</h2>
          <div className="mt-4 space-y-2">
            <p><strong>Original Title:</strong> {notice.originalWorkTitle}</p>
            <p><strong>Original Author:</strong> {notice.originalWorkAuthor || '—'}</p>
            <p><strong>Copyright Holder:</strong> {notice.copyrightHolder}</p>
            <p><strong>Description:</strong> {notice.description || '—'}</p>
            <p><strong>Status:</strong> {notice.status}</p>
            <p><strong>Related Story:</strong> <Link href={`/stories/${notice.storyId}`} className="text-indigo-600">View story</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
}
