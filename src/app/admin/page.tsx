"use client";

import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  Download,
  TrendingUp,
} from "lucide-react";
import { Loader2 } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalBooks: number;
  totalStories: number;
  totalComments: number;
  downloadsToday: number;
  newUsersThisWeek: number;
}

const statCards = [
  { key: "totalUsers", label: "Total Users", icon: Users },
  { key: "totalBooks", label: "Total Books", icon: BookOpen },
  { key: "totalStories", label: "Total Stories", icon: FileText },
  { key: "totalComments", label: "Total Comments", icon: MessageSquare },
  { key: "downloadsToday", label: "Downloads Today", icon: Download },
  { key: "newUsersThisWeek", label: "New Users This Week", icon: TrendingUp },
] as const;

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Overview of your BookVerse platform
      </p>

      {/* Stats Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {label}
                </p>
                <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                  {stats?.[key]?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-950">
                <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Quick Actions
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/admin/users", label: "Manage Users", desc: "View and edit user roles" },
            { href: "/admin/books", label: "Manage Books", desc: "Review and delete books" },
            { href: "/admin/stories", label: "Manage Stories", desc: "Moderate stories" },
            { href: "/admin/comments", label: "Manage Comments", desc: "Review comments" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700"
            >
              <p className="font-medium text-zinc-900 dark:text-zinc-50">{link.label}</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{link.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

