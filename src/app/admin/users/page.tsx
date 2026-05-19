"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, Search, Trash2, User, ArrowLeft, ShieldCheck, Activity } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface UserData {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
  _count: {
    books: number;
    stories: number;
    followers: number;
  };
}

const roles = ["VISITOR", "MEMBER", "AUTHOR", "ADMIN"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => { fetchUsers(); }, [page, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
      }
    } finally { setLoading(false); }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdating(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      }
    } finally { setUpdating(null); }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Execute identity purge? This user record will be permanently deleted.")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) { setUsers(users.filter((u) => u.id !== userId)); }
    } catch (error) { console.error("Failed to delete user:", error); }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Minimal Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/admin" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Oversight Hub
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1">Identity Audit Registry.</h1>
              <p className="text-xs text-zinc-500 font-medium">Global management and moderation of platform user identities and roles.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 font-mono">
            <ShieldCheck className="w-3 h-3 text-zinc-300" />
            Audit Mode Active
          </div>
        </header>

        {/* Surgical Search */}
        <div className="mb-12 relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search identities..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-md text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            onKeyDown={(e) => e.key === "Enter" && setPage(1)}
          />
        </div>

        {/* Identity Registry Table */}
        <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-40">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-300" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-40 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No identity records detected in registry.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900">
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Identity Record</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">System Role</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Registration</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Transmissions</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {users.map((user) => (
                    <tr key={user.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-10 w-10 overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shrink-0">
                            {user.avatarUrl ? (
                              <Image src={user.avatarUrl} alt="" fill className="object-cover transition-all duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-300 uppercase">
                                {user.username.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-900 dark:text-white uppercase">
                              <Link href={`/admin/users/${user.id}`} className="hover:underline">{user.displayName || user.username}</Link>
                            </p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={updating === user.id}
                          className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded outline-none focus:border-zinc-900 dark:focus:border-white transition-all disabled:opacity-50"
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-6 text-[10px] font-mono font-bold text-zinc-300">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                            {user._count.books} Volumes
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                            {user._count.stories} Manuscripts
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-zinc-300 hover:text-rose-500 hover:bg-rose-500/5 transition-all rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Protocol */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded text-[10px] font-bold uppercase transition-all ${
                  page === p
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                    : "bg-white dark:bg-zinc-950 text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
