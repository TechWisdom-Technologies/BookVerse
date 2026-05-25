"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { Send, Mail, Loader2, ArrowLeft, Radio } from "lucide-react";
import Link from "next/link";
import { getFriendlyErrorMessage } from "@/lib/friendly-errors";
import toast from "react-hot-toast";

export default function NewsletterPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-200 dark:text-zinc-800" />
      </div>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) { toast.error("Please fill in all fields."); return; }
    setIsSending(true);
    const toastId = toast.loading("Sending newsletter...");
    try {
      const token = await user?.getIdToken();
      if (!token) throw new Error("Please log in again.");
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          htmlContent: `<div style="font-family: sans-serif; white-space: pre-wrap;">${content}</div>`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send.");
      toast.success(`Newsletter sent to ${data.sentCount} subscribers.`, { id: toastId });
      setSubject(""); setContent("");
    } catch (error: any) {
      toast.error(getFriendlyErrorMessage(error, "Failed to send newsletter. Please try again."), { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[600px]">
        
        {/* Simple Header */}
        <div className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900">
          <Link href="/write" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back Home
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-6">
            <Radio className="w-4 h-4" />
            Newsletter
          </div>
          <h1 className="text-xl font-bold tracking-tight mb-2 uppercase">Send Update.</h1>
          <p className="text-sm text-zinc-500 font-medium italic">Send a newsletter update directly to your subscribers.</p>
        </div>

        <form onSubmit={handleSend} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. New Story Update"
              className="w-full px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm transition-all disabled:opacity-50"
              required
              disabled={isSending}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your message here..."
              rows={12}
              className="w-full px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm transition-all resize-none disabled:opacity-50"
              required
              disabled={isSending}
            />
          </div>

          <div className="pt-10 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">
              <Mail className="w-3.5 h-3.5" />
              Email Newsletter
            </div>
            <button
              type="submit"
              disabled={isSending || !subject.trim() || !content.trim()}
              className="px-10 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all flex items-center justify-center gap-3 border border-zinc-900 dark:border-white shadow-md"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              {isSending ? "Sending..." : "Send Newsletter"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
