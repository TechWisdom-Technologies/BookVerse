"use client";

import { useState, useEffect } from "react";
import { Loader2, Mail, Users, CheckCircle, XCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";
import Link from "next/link";

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminNewslettersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const res = await fetch("/api/admin/newsletters", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !content) {
      toast.error("Subject and content are required.");
      return;
    }

    if (!confirm("Are you sure you want to send this newsletter to ALL active subscribers?")) {
      return;
    }

    setSending(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const res = await fetch("/api/admin/newsletters/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ subject, content })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Sent! Success: ${data.success}, Failed: ${data.failed}`);
        setSubject("");
        setContent("");
      } else {
        toast.error(data.error || "Failed to send newsletter.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSending(false);
    }
  };

  const activeCount = subscribers.filter(s => s.isActive).length;

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
              <h1 className="text-xl font-bold tracking-tight mb-1">Transmission Protocol.</h1>
              <p className="text-xs text-zinc-500 font-medium">Global management of subscriber identity nodes and mass communication relays.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 font-mono">
            <ShieldCheck className="w-3 h-3 text-zinc-300" />
            Audit Mode Active
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Compose Section */}
          <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 p-6 flex flex-col h-[600px]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-50 dark:border-zinc-900">
              <Mail className="w-4 h-4 text-zinc-400" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Compose Relay</h2>
            </div>

            <form onSubmit={handleSend} className="space-y-4 flex-1 flex flex-col">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-widest">
                  Transmission Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="System Update..."
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
                  required
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-widest">
                  Payload Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Initiate transmission log..."
                  className="w-full flex-1 px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={sending || activeCount === 0}
                className="w-full py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Execute Transmission ({activeCount})
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Subscribers List */}
          <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 flex flex-col h-[600px] overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-50 dark:border-zinc-900">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-zinc-400" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Identity Nodes</h2>
              </div>
              <div className="text-[10px] font-mono font-bold text-zinc-400">
                {subscribers.length} VERIFIED
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-white dark:bg-zinc-950">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
                </div>
              ) : subscribers.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No identity nodes detected.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                        <td className="py-4 px-6">
                          <p className="text-xs font-bold text-zinc-900 dark:text-white">{sub.email}</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                            Registered {new Date(sub.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {sub.isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 text-[9px] font-bold uppercase tracking-widest rounded">
                              <CheckCircle className="w-3 h-3 text-zinc-400" />
                              Active Node
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 border border-zinc-100 dark:border-zinc-800 text-[9px] font-bold uppercase tracking-widest rounded line-through decoration-zinc-300">
                              <XCircle className="w-3 h-3 text-zinc-300" />
                              Terminated
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

