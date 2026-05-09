"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import {
  PenLine,
  Eye,
  Heart,
  MessageSquare,
  BookOpen,
  Trash2,
  Globe,
  FileText,
  Mail,
  Layers,
  GitBranch,
  ArrowLeft,
  Loader2,
  Plus
} from "lucide-react";

interface StoryItem {
  id: string;
  title: string;
  coverUrl: string | null;
  summary: string | null;
  viewCount: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    chapters: number;
    reactions: number;
    comments: number;
  };
}

export default function WriteDashboardPage() {
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyStories = async () => {
      try {
        const res = await fetch("/api/users/me/stories");
        if (res.ok) {
          const data = await res.json();
          setStories(data.stories);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMyStories();
  }, []);

  const handleDelete = async (storyId: string) => {
    if (!confirm("Are you sure you want to delete this story? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/stories/${storyId}`, { method: "DELETE" });
      if (res.ok) {
        setStories((prev) => prev.filter((s) => s.id !== storyId));
      }
    } catch {
      console.error("Failed to delete story");
    }
  };

  const handleTogglePublish = async (storyId: string, currentlyPublished: boolean) => {
    try {
      const res = await fetch(`/api/stories/${storyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentlyPublished }),
      });
      if (res.ok) {
        setStories((prev) =>
          prev.map((s) =>
            s.id === storyId ? { ...s, published: !currentlyPublished } : s
          )
        );
      }
    } catch {
      console.error("Failed to toggle publish");
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Simple Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">My Stories</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">Create and manage your stories, universes, and newsletters.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/write/universes" className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-zinc-500 rounded border border-zinc-100 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all flex items-center gap-2">
              <GitBranch className="w-3.5 h-3.5" />
              My Universes
            </Link>
            <Link href="/write/newsletter" className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-zinc-500 rounded border border-zinc-100 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              Newsletter
            </Link>
            <Link href="/write/new" className="px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center gap-2">
              <Plus className="w-3.5 h-3.5" />
              New Story
            </Link>
          </div>
        </header>

        {/* Stories List */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
            </div>
          ) : stories.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
              <p className="text-xs font-medium text-zinc-400 mb-6 italic">You haven&apos;t written any stories yet.</p>
              <Link href="/write/new" className="px-8 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded">
                Start your first story
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="group flex flex-col p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all"
                >
                  <div className="flex flex-col h-full justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                          story.published 
                            ? "bg-emerald-50/5 border-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-400"
                        }`}>
                          {story.published ? "Published" : "Draft"}
                        </span>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/write/story/${story.id}/edit`} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" title="Edit">
                            <PenLine className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleTogglePublish(story.id, story.published)} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors" title={story.published ? "Unpublish" : "Publish"}>
                            <Globe className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(story.id)} className="p-1.5 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <Link href={`/write/story/${story.id}/edit`} className="block group-hover:translate-x-1 transition-transform">
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2 tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                          {story.title}
                        </h3>
                        {story.summary && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                            {story.summary}
                          </p>
                        )}
                      </Link>
                    </div>

                    <div className="pt-6 border-t border-zinc-50 dark:border-zinc-900 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-zinc-300" /> {story._count.chapters}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-zinc-300" /> {story.viewCount}</span>
                        <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-zinc-300" /> {story._count.reactions}</span>
                      </div>
                      <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                        {formatDate(story.updatedAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
