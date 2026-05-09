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
      <div className="flex items-center justify-center py-40">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 pt-8 sm:pt-12 px-4 sm:px-8">
      <header className="mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">
          Control Center.
        </h1>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium">
          Platform overview, metrics, and administration.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="group relative overflow-hidden rounded-[2rem] border border-zinc-200/50 bg-white/80 p-8 shadow-xl shadow-zinc-200/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-zinc-200/40 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:shadow-none dark:hover:border-zinc-700"
          >
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {label}
                </p>
                <p className="mt-4 text-5xl font-black text-zinc-900 dark:text-white tracking-tight group-hover:text-brand transition-colors">
                  {stats?.[key]?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Icon className="h-8 w-8" />
              </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand/5 rounded-full blur-2xl group-hover:bg-brand/10 transition-colors duration-500" />
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-16 sm:mt-24">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Quick Actions
          </h2>
        </div>
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/admin/users", label: "Manage Users", desc: "View and edit user roles" },
            { href: "/admin/books", label: "Manage Books", desc: "Review and delete books" },
            { href: "/admin/stories", label: "Manage Stories", desc: "Moderate stories" },
            { href: "/admin/comments", label: "Manage Comments", desc: "Review comments" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group block rounded-[1.5rem] border border-zinc-200/50 bg-white/50 p-6 transition-all duration-300 hover:border-brand hover:bg-brand/5 hover:shadow-xl dark:border-zinc-800/50 dark:bg-zinc-900/30 dark:hover:border-brand dark:hover:bg-brand/10"
            >
              <p className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-brand transition-colors">{link.label}</p>
              <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">{link.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

