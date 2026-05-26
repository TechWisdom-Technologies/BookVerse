"use client";

import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  Download,
  TrendingUp,
  ArrowLeft,
  Settings,
  Shield,
  Loader2
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalBooks: number;
  totalStories: number;
  totalComments: number;
  downloadsToday: number;
  newUsersThisWeek: number;
}

const statCards = [
  { key: "totalUsers", label: "Registered Users", icon: Users },
  { key: "totalBooks", label: "Scholarly Volumes", icon: BookOpen },
  { key: "totalStories", label: "Creative Records", icon: FileText },
  { key: "totalComments", label: "Peer Interactions", icon: MessageSquare },
  { key: "downloadsToday", label: "Transmission Rate", icon: Download },
  { key: "newUsersThisWeek", label: "New Acquisitions", icon: TrendingUp },
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
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
    </div>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Minimal Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Archives
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">System Oversight</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">Real-time platform metrics and administrative coordination protocols.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 border border-zinc-100 dark:border-zinc-800 rounded-md">
            <Shield className="w-3.5 h-3.5" />
            Admin Protocol
          </div>
        </header>

        {/* Stats Registry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 mb-20">
          {statCards.map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className="p-8 bg-white dark:bg-zinc-950 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  {label}
                </span>
                <Icon className="w-3.5 h-3.5 text-zinc-200 dark:text-zinc-800 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">
                  {stats?.[key]?.toLocaleString() || "0"}
                </p>
                <div className="w-8 h-0.5 bg-zinc-100 dark:bg-zinc-900 group-hover:bg-zinc-900 dark:group-hover:bg-white transition-all" />
              </div>
            </div>
          ))}
        </div>

        {/* Action Protocol Registry */}
        <section>
          <div className="flex items-center gap-2 mb-8 pb-4 border-b border-zinc-50 dark:border-zinc-900">
            <Settings className="w-4 h-4 text-zinc-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Direct Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { href: "/admin/users", label: "User Registry", desc: "Access authorization and role management." },
              { href: "/admin/transactions", label: "Subscription Payments", desc: "Audit and verify manual premium upgrade transactions." },
              { href: "/admin/promotions", label: "Promotion Payments", desc: "Audit and verify story promotion payment receipts." },
              { href: "/admin/books", label: "Volume Registry", desc: "Scholarly metadata and content moderation." },
              { href: "/admin/stories", label: "Creative Registry", desc: "Community world-record oversight." },
              { href: "/admin/comments", label: "Interaction Logs", desc: "Peer engagement and moderation protocol." },
              { href: "/admin/dmca", label: "DMCA Notices", desc: "Copyright claims and takedown tracking." },
              { href: "/admin/reports", label: "Safety Reports", desc: "Manage user-flagged violations like hate speech, harassment, and explicit content." },
              { href: "/admin/universes", label: "Universes", desc: "Manage story universes and metadata." },
              { href: "/admin/series", label: "Series", icon: "Library", desc: "Manage narrative series directories, sequences, and collections." },
              { href: "/admin/clubs", label: "Clubs", desc: "Community clubs and membership oversight." },
              { href: "/admin/support", label: "Support Tickets", desc: "View, update, and manage user support inquiries and reports." },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all group"
              >
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white mb-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                  {link.label}
                </h3>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">{link.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
