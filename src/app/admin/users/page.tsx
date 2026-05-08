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
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Users
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Manage user accounts and roles
      </p>

      {/* Search */}
      <div className="mt-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            onKeyDown={(e) => e.key === "Enter" && setPage(1)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="mt-6 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-zinc-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Content</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <Image
                            src={user.avatarUrl}
                            alt=""
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                            <User className="h-4 w-4 text-zinc-500" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-50">
                            {user.displayName || user.username}
                          </p>
                          <p className="text-xs text-zinc-500">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updating === user.id}
                        className="rounded border border-zinc-200 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                      {user._count.books} books, {user._count.stories} stories
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
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
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-lg text-sm ${
                page === p
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
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

