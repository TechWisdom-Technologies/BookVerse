"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, Search, Trash2, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

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

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/users?page=${page}&search=${encodeURIComponent(search)}`
      );
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
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
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-8 sm:pt-12 px-4 sm:px-8">
      <header className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">
          Users
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
          Manage user accounts and roles
        </p>
      </header>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full rounded-full border-2 border-zinc-200/50 bg-white/80 py-4 pl-16 pr-6 text-lg font-medium shadow-xl shadow-zinc-200/20 backdrop-blur-md transition-all focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:shadow-none dark:focus:border-brand dark:focus:bg-zinc-900/80"
            onKeyDown={(e) => e.key === "Enter" && setPage(1)}
          />
        </div>
      </div>

      {/* Users Table Container */}
      <div className="rounded-[2rem] border border-zinc-200/50 bg-white/80 p-4 sm:p-8 shadow-xl shadow-zinc-200/20 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:shadow-none">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-brand" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center text-xl font-bold text-zinc-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 px-4 text-xs font-bold uppercase tracking-wider text-zinc-400">User</th>
                  <th className="border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 px-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Role</th>
                  <th className="border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 px-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Created</th>
                  <th className="border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 px-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Content</th>
                  <th className="border-b-2 border-zinc-100 dark:border-zinc-800 pb-4 px-4 text-right text-xs font-bold uppercase tracking-wider text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {users.map((user) => (
                  <tr key={user.id} className="group transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                    <td className="px-4 py-4 sm:py-6">
                      <div className="flex items-center gap-4">
                        {user.avatarUrl ? (
                          <div className="relative h-12 w-12 overflow-hidden rounded-full shadow-md">
                            <Image
                              src={user.avatarUrl}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand shadow-inner">
                            <User className="h-6 w-6" />
                          </div>
                        )}
                        <div>
                          <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                            {user.displayName || user.username}
                          </p>
                          <p className="text-sm font-medium text-zinc-500">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 sm:py-6">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updating === user.id}
                        className="rounded-xl border-2 border-zinc-200/50 bg-white px-4 py-2 text-sm font-bold transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-brand"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 sm:py-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-4 sm:py-6">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-bold text-brand w-max">
                          {user._count.books} Books
                        </span>
                        <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 w-max">
                          {user._count.stories} Stories
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 sm:py-6 text-right">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:hover:bg-red-500 dark:hover:text-white"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-bold transition-all ${
                page === p
                  ? "bg-brand text-white shadow-lg shadow-brand/30"
                  : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

