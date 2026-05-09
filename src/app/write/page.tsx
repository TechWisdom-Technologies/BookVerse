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
      } catch {
        console.error("Failed to fetch stories");
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
    <main className="min-h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A] pt-16 pb-32">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        
        {/* Huge Clean Header */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter mb-6">
                Studio.
              </h1>
              <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                Your creative workspace. Draft, publish, and manage your literary universe.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
              <Link
                href="/write/newsletter"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <Mail className="h-5 w-5" />
                Newsletter
              </Link>
              <Link
                href="/write/new"
                className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand text-white rounded-full font-bold text-lg hover:bg-orange-600 hover:shadow-xl hover:shadow-brand/20 hover:-translate-y-1 transition-all duration-300"
              >
                <PenLine className="h-5 w-5" />
                New Story
              </Link>
            </div>
          </div>
        </header>

        {/* Minimal Divider */}
        <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-12" />

        {/* Stories List */}
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900/50 min-h-[200px]"
                />
              ))}
            </div>
          ) : stories.length === 0 ? (
            <div className="py-32 text-center bg-zinc-50 dark:bg-zinc-900/30 rounded-[3rem] border border-zinc-200 dark:border-zinc-800">
              <div className="w-24 h-24 bg-brand/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-brand/5 rotate-12">
                <PenLine className="h-10 w-10 text-brand -rotate-12" />
              </div>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                The blank page awaits
              </h3>
              <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed mb-8">
                Create your first story, build your audience, and share your imagination with the world.
              </p>
              <Link
                href="/write/new"
                className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl"
              >
                <PenLine className="h-5 w-5" />
                Start Writing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="group rounded-[2rem] border border-zinc-200 bg-white p-8 transition-all duration-300 hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 relative overflow-hidden"
                >
                  <div className="flex flex-col h-full justify-between gap-8">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                            story.published
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                          }`}
                        >
                          {story.published ? (
                            <>
                              <Globe className="h-3.5 w-3.5" /> Published
                            </>
                          ) : (
                            <>
                              <FileText className="h-3.5 w-3.5" /> Draft
                            </>
                          )}
                        </span>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/write/${story.id}/edit`}
                            className="rounded-full p-2.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
                            title="Edit"
                          >
                            <PenLine className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleTogglePublish(story.id, story.published)}
                            className="rounded-full p-2.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
                            title={story.published ? "Unpublish" : "Publish"}
                          >
                            <Globe className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(story.id)}
                            className="rounded-full p-2.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      <Link
                        href={`/write/${story.id}/edit`}
                        className="block group-hover:translate-x-1 transition-transform"
                      >
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 line-clamp-1 group-hover:text-brand transition-colors">
                          {story.title}
                        </h3>
                        {story.summary && (
                          <p className="text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                            {story.summary}
                          </p>
                        )}
                      </Link>
                    </div>

                    <div className="flex items-center flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-zinc-100 dark:border-zinc-800/50">
                      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-medium">
                        <BookOpen className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                        {story._count.chapters}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-medium">
                        <Eye className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                        {story.viewCount}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-medium">
                        <Heart className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                        {story._count.reactions}
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-medium">
                        <MessageSquare className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                        {story._count.comments}
                      </div>
                      <div className="flex-1 text-right text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
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
