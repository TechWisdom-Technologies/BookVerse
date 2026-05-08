"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { Send, Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewsletterPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !content.trim()) {
      toast.error("Subject and content are required.");
      return;
    }

    setIsSending(true);
    const toastId = toast.loading("Sending newsletter...");

    try {
      const token = await user?.getIdToken();
      if (!token) throw new Error("Not authenticated");

      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          // Convert simple text to HTML for Resend
          htmlContent: `<div style="font-family: sans-serif; white-space: pre-wrap;">${content}</div>`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send newsletter");
      }

      toast.success(`Newsletter sent to ${data.sentCount} subscribers!`, { id: toastId });
      setSubject("");
      setContent("");
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:px-10">
      <Link
        href="/write"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Broadcast Newsletter
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Send updates directly to your subscribers' inboxes.
            </p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSend} className="space-y-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-zinc-900 dark:text-zinc-300">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., New Chapter Available!"
            className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            required
            disabled={isSending}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-zinc-900 dark:text-zinc-300">
            Message Content
          </label>
          <textarea
            id="content"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your newsletter here..."
            className="mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            required
            disabled={isSending}
          />
        </div>

        <div className="flex items-center justify-end border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <button
            type="submit"
            disabled={isSending || !subject.trim() || !content.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:hover:bg-indigo-600"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isSending ? "Sending Broadcast..." : "Send Newsletter"}
          </button>
        </div>
      </form>
    </main>
  );
}
