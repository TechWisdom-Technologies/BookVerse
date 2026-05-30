"use client";

import { useState, useEffect, useRef } from "react";
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
  Loader2,
  Terminal,
  Database,
  Trash2,
  UploadCloud,
  Clock,
  BarChart3,
  Crown
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
  const [runningScript, setRunningScript] = useState<string | null>(null);
  const [scriptOutput, setScriptOutput] = useState<{stdout?: string, stderr?: string, error?: string} | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const runScript = async (scriptName: string) => {
    let args: any = {};
    
    if (scriptName === "bulk-upload") {
      const dir = prompt("Enter the absolute directory path containing the PDFs:");
      if (dir === null) return; // User clicked Cancel
      
      const email = prompt("Enter the email of the author account (leave blank for default admin):");
      if (email === null) return; // User clicked Cancel
      
      args = { dir, email };
    } else {
      if (!confirm(`Are you sure you want to run the ${scriptName} script? This may take a while.`)) return;
    }
    
    setRunningScript(scriptName);
    setScriptOutput({ stdout: `Executing ${scriptName}...\nWaiting for terminal output...` });
    
    abortControllerRef.current = new AbortController();
    
    try {
      const res = await fetch("/api/admin/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: scriptName, ...args }),
        signal: abortControllerRef.current.signal,
      });
      const data = await res.json();
      setScriptOutput(data);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setScriptOutput({ error: "Script execution was cancelled by user." });
      } else {
        setScriptOutput({ error: error.message });
      }
    } finally {
      setRunningScript(null);
      abortControllerRef.current = null;
    }
  };

  const cancelScript = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

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

        {/* System Operations Registry */}
        <section className="mt-12">
          <div className="flex items-center gap-2 mb-8 pb-4 border-b border-zinc-50 dark:border-zinc-900">
            <Terminal className="w-4 h-4 text-zinc-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">System Operations</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => runScript("rebuild-search")}
              disabled={runningScript !== null}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-left disabled:opacity-50 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors" />
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors">Rebuild Search Index</h3>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Extracts text from all chapters and updates the PostgreSQL full-text search index.</p>
              {runningScript === "rebuild-search" && <Loader2 className="w-4 h-4 animate-spin mt-4 text-zinc-400" />}
            </button>

            <button
              onClick={() => runScript("cleanup-orphans")}
              disabled={runningScript !== null}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-left disabled:opacity-50 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="w-4 h-4 text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors" />
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors">Cleanup Orphans</h3>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Scans Cloudflare R2 for orphaned files and removes them to save storage space.</p>
              {runningScript === "cleanup-orphans" && <Loader2 className="w-4 h-4 animate-spin mt-4 text-zinc-400" />}
            </button>

            <button
              onClick={() => runScript("bulk-upload")}
              disabled={runningScript !== null}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-left disabled:opacity-50 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <UploadCloud className="w-4 h-4 text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors" />
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors">Bulk Upload Books</h3>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Uploads multiple PDF books from a local directory into the platform automatically.</p>
              {runningScript === "bulk-upload" && <Loader2 className="w-4 h-4 animate-spin mt-4 text-zinc-400" />}
            </button>

            <button
              onClick={() => runScript("expire-promotions")}
              disabled={runningScript !== null}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-left disabled:opacity-50 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors" />
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors">Expire Promotions</h3>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Ends active promotions past their expiry date and resets their search ranking boost.</p>
              {runningScript === "expire-promotions" && <Loader2 className="w-4 h-4 animate-spin mt-4 text-zinc-400" />}
            </button>

            <button
              onClick={() => runScript("recalculate-stats")}
              disabled={runningScript !== null}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-left disabled:opacity-50 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors" />
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors">Recalculate Stats</h3>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Recomputes chapter counts, comment counts, and average ratings for all stories and books.</p>
              {runningScript === "recalculate-stats" && <Loader2 className="w-4 h-4 animate-spin mt-4 text-zinc-400" />}
            </button>

            <button
              onClick={() => runScript("upgrade-founding-users")}
              disabled={runningScript !== null}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-left disabled:opacity-50 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors" />
                <h3 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-zinc-600 transition-colors">Upgrade Founding Users</h3>
              </div>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">Grants the first 100 registered users AUTHOR role and CREATOR membership tier.</p>
              {runningScript === "upgrade-founding-users" && <Loader2 className="w-4 h-4 animate-spin mt-4 text-zinc-400" />}
            </button>
          </div>

          {scriptOutput && (
            <div className="mt-6 p-4 bg-zinc-900 rounded-md overflow-hidden border border-zinc-800">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Terminal Output</h3>
                <div className="flex items-center gap-3">
                  {runningScript && (
                    <button 
                      onClick={cancelScript} 
                      className="text-xs font-bold text-red-400 hover:text-red-300"
                    >
                      Cancel Execution
                    </button>
                  )}
                  <button onClick={() => setScriptOutput(null)} className="text-xs text-zinc-500 hover:text-white">Close</button>
                </div>
              </div>
              
              {scriptOutput.error && (
                <div className="mb-4 text-red-400 text-xs font-mono whitespace-pre-wrap">
                  [ERROR] {scriptOutput.error}
                </div>
              )}
              
              {scriptOutput.stdout && (
                <div className="text-zinc-300 text-xs font-mono whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {scriptOutput.stdout}
                </div>
              )}
              
              {scriptOutput.stderr && (
                <div className="mt-4 text-red-300 text-xs font-mono whitespace-pre-wrap max-h-96 overflow-y-auto border-t border-zinc-800 pt-4">
                  [STDERR]
                  {'\n'}
                  {scriptOutput.stderr}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
