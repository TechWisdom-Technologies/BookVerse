"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/shared/FileUpload";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewStoryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim() || null,
          coverUrl: coverUrl || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create story");
        return;
      }

      const data = await res.json();
      router.push(`/write/${data.story.id}/edit`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
      <Link
        href="/write"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to stories
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Create a New Story
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Give your story a title and summary. You can start writing chapters after creation.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your story title"
            className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
        </div>

        {/* Summary */}
        <div>
          <label
            htmlFor="summary"
            className="block text-sm font-medium text-zinc-900 dark:text-zinc-50"
          >
            Summary
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="A short description of your story"
            rows={4}
            className="mt-1.5 w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-1.5">
            Cover Image
          </label>
          <FileUpload
            accept="image/*"
            maxSize={5 * 1024 * 1024}
            onUpload={(url) => setCoverUrl(url)}
            label="Upload cover image (optional)"
          />
          {coverUrl && (
            <p className="mt-1 text-xs text-green-600 dark:text-green-400">
              ✓ Cover image uploaded
            </p>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Creating..." : "Create Story"}
        </button>
      </form>
    </main>
  );
}
