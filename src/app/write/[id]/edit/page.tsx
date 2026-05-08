"use client";

import { useState, useEffect, useCallback, use } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/shared/FileUpload";
import ChapterList, {
  type ChapterItem,
} from "@/components/stories/ChapterList";
import {
  ArrowLeft,
  Globe,
  GlobeLock,
  Settings2,
  Loader2,
  Eye,
  Trash2,
} from "lucide-react";

// Dynamic import for TipTap editor — SSR disabled as required
const StoryEditor = dynamic(
  () => import("@/components/stories/StoryEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center rounded-xl border border-zinc-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-900">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    ),
  }
);

interface StoryData {
  id: string;
  title: string;
  summary: string | null;
  coverUrl: string | null;
  published: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  chapters: ChapterItem[];
  _count: {
    reactions: number;
    comments: number;
  };
}

export default function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: storyId } = use(params);
  const router = useRouter();

  const [story, setStory] = useState<StoryData | null>(null);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [chapterContent, setChapterContent] = useState<unknown>(null);
  const [loadingStory, setLoadingStory] = useState(true);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Metadata editing state
  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editCoverUrl, setEditCoverUrl] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  // Fetch story data
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch(`/api/stories/${storyId}`);
        if (!res.ok) {
          router.push("/write");
          return;
        }
        const data = await res.json();
        const storyData: StoryData = data.story;
        setStory(storyData);
        setChapters(storyData.chapters);
        setEditTitle(storyData.title);
        setEditSummary(storyData.summary || "");
        setEditCoverUrl(storyData.coverUrl || "");

        // Select first chapter by default
        if (storyData.chapters.length > 0) {
          setActiveChapterId(storyData.chapters[0].id);
        }
      } catch {
        console.error("Failed to fetch story");
        router.push("/write");
      } finally {
        setLoadingStory(false);
      }
    };
    fetchStory();
  }, [storyId, router]);

  // Fetch chapter content when active chapter changes
  useEffect(() => {
    if (!activeChapterId) return;

    const fetchChapter = async () => {
      setLoadingChapter(true);
      try {
        const res = await fetch(
          `/api/stories/${storyId}/chapters/${activeChapterId}`
        );
        if (res.ok) {
          const data = await res.json();
          setChapterContent(data.chapter.content);
        }
      } catch {
        console.error("Failed to fetch chapter content");
      } finally {
        setLoadingChapter(false);
      }
    };
    fetchChapter();
  }, [activeChapterId, storyId]);

  // Save chapter content
  const handleSaveChapter = useCallback(
    async (content: unknown) => {
      if (!activeChapterId) return;
      const res = await fetch(
        `/api/stories/${storyId}/chapters/${activeChapterId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );
      if (!res.ok) throw new Error("Failed to save");
    },
    [activeChapterId, storyId]
  );

  // Save story metadata
  const handleSaveMeta = async () => {
    setSavingMeta(true);
    try {
      const res = await fetch(`/api/stories/${storyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          summary: editSummary.trim() || null,
          coverUrl: editCoverUrl || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setStory((prev) => (prev ? { ...prev, ...data.story } : prev));
      }
    } catch {
      console.error("Failed to save metadata");
    } finally {
      setSavingMeta(false);
    }
  };

  // Toggle publish
  const handleTogglePublish = async () => {
    if (!story) return;
    setPublishLoading(true);
    try {
      const res = await fetch(`/api/stories/${storyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !story.published }),
      });
      if (res.ok) {
        setStory((prev) =>
          prev ? { ...prev, published: !prev.published } : prev
        );
      }
    } catch {
      console.error("Failed to toggle publish");
    } finally {
      setPublishLoading(false);
    }
  };

  // Delete story
  const handleDeleteStory = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this story? This action cannot be undone."
      )
    )
      return;

    try {
      const res = await fetch(`/api/stories/${storyId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/write");
      }
    } catch {
      console.error("Failed to delete story");
    }
  };

  if (loadingStory) {
    return (
      <main className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </main>
    );
  }

  if (!story) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-zinc-600 dark:text-zinc-400">Story not found.</p>
        <Link
          href="/write"
          className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
        >
          Back to My Stories
        </Link>
      </main>
    );
  }

  const activeChapter = chapters.find((c) => c.id === activeChapterId);

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
      {/* Top Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/write"
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 truncate max-w-sm">
              {story.title}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  story.published
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {story.published ? (
                  <>
                    <Globe className="h-3 w-3" /> Published
                  </>
                ) : (
                  <>
                    <GlobeLock className="h-3 w-3" /> Draft
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {story.published && (
            <Link
              href={`/stories/${storyId}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              target="_blank"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </Link>
          )}
          <button
            onClick={handleTogglePublish}
            disabled={publishLoading}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              story.published
                ? "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400 dark:hover:bg-amber-900"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {publishLoading && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            {story.published ? "Unpublish" : "Publish"}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`rounded-lg p-2 transition-colors ${
              showSettings
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            }`}
            title="Story settings"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Story Settings
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Cover Image
              </label>
              <FileUpload
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                onUpload={(url) => setEditCoverUrl(url)}
                label="Upload cover"
              />
              {editCoverUrl && (
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                  ✓ Cover set
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Summary
              </label>
              <textarea
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={handleDeleteStory}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Story
            </button>
            <button
              onClick={handleSaveMeta}
              disabled={savingMeta}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {savingMeta && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Main Editor Layout */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Chapter Sidebar */}
        <div className="order-2 lg:order-1">
          <ChapterList
            chapters={chapters}
            storyId={storyId}
            activeChapterId={activeChapterId}
            onSelectChapter={setActiveChapterId}
            onChaptersChange={setChapters}
          />
        </div>

        {/* Editor */}
        <div className="order-1 lg:order-2">
          {activeChapter ? (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Editing:{" "}
                  <span className="text-zinc-900 dark:text-zinc-50">
                    {activeChapter.title}
                  </span>
                </h2>
                <span className="text-xs text-zinc-400">
                  Double-click chapter name to rename
                </span>
              </div>

              {loadingChapter ? (
                <div className="flex items-center justify-center rounded-xl border border-zinc-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-900">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                </div>
              ) : (
                <StoryEditor
                  key={activeChapterId}
                  chapterId={activeChapterId!}
                  storyId={storyId}
                  initialContent={chapterContent}
                  onSave={handleSaveChapter}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-20 text-center dark:border-zinc-700">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Select a chapter from the sidebar to start editing, or add a new
                chapter.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
