"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClubDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [club, setClub] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => { fetchClub(); }, [id]);

  const fetchClub = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clubs/${id}`);
      if (res.ok) setClub((await res.json()).club);
    } finally { setLoading(false); }
  };

  const doDelete = async () => {
    if (!confirm("Delete this club and its data?")) return;
    try {
      const res = await fetch(`/api/admin/clubs`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clubId: id }) });
      if (res.ok) router.push('/admin/clubs');
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-zinc-400" /></div>;
  if (!club) return <div className="p-12">Club not found.</div>;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{club.name}</h1>
            <p className="text-sm text-zinc-500">Owner: @{club.owner?.username || 'unknown'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={doDelete} className="px-3 py-2 bg-rose-50 rounded">Delete</button>
          </div>
        </div>

        <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 p-6">
          <h2 className="text-sm font-bold uppercase text-zinc-400">Club Details</h2>
          <div className="mt-4 space-y-2">
            <p><strong>Description:</strong> {club.description || '—'}</p>
            <p><strong>Private:</strong> {club.isPrivate ? 'Yes' : 'No'}</p>
            <p><strong>Members ({club.members?.length || 0}):</strong></p>
            <ul className="list-disc pl-6">
              {club.members?.map((m: any) => (
                <li key={m.id}>{m.userId} — {m.role}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
