"use client";

import { useState, useEffect, useCallback, use } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/shared/FileUpload";
import ChapterList, {
  type ChapterItem,
} from "@/components/stories/ChapterList";
import { AiCoverGenerator } from "@/components/stories/AiCoverGenerator";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Globe,
  GlobeLock,
  Settings2,
  Loader2,
  Eye,
  Trash2,
  FilePenLine,
  Layout
} from "lucide-react";

// Dynamic import for TipTap editor — SSR disabled as required
const StoryEditor = dynamic(
  () => import("@/components/stories/StoryEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-20 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-md">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-300" />
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
  universeId: string | null;
  seriesId: string | null;
  sequenceNumber: number | null;
  _count: { reactions: number; comments: number; };
}

export default function EditStoryPage({ params }: { params: Promise<{ id: string }>; }) {
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
  const [editUniverseId, setEditUniverseId] = useState<string | null>(null);
  const [editSeriesId, setEditSeriesId] = useState<string | null>(null);
  const [editSequenceNumber, setEditSequenceNumber] = useState<number | null>(null);
  const [availableUniverses, setAvailableUniverses] = useState<any[]>([]);
  const [availableSeries, setAvailableSeries] = useState<any[]>([]);
  const [savingMeta, setSavingMeta] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch(`/api/stories/${storyId}`);
        if (!res.ok) { router.push("/write"); return; }
        const data = await res.json();
        if (!data.isAuthor) {
          router.push("/write");
          return;
        }
        
        const storyData: any = data.story;
        setStory(storyData);
        setChapters(storyData.chapters);
        setEditTitle(storyData.title);
        setEditSummary(storyData.summary || "");
        setEditCoverUrl(storyData.coverUrl || "");
        setEditUniverseId(storyData.universeId);
        setEditSeriesId(storyData.seriesId);
        setEditSequenceNumber(storyData.sequenceNumber);
        if (storyData.chapters.length > 0) setActiveChapterId(storyData.chapters[0].id);
      } catch { router.push("/write"); } finally { setLoadingStory(false); }
    };

    const fetchAvailableUniverses = async () => {
      try {
        const res = await fetch("/api/universes?onlyMine=true");
        if (res.ok) {
          const data = await res.json();
          setAvailableUniverses(data);
        }
      } catch (err) { console.error("Failed to fetch universes:", err); }
    };

    const fetchAvailableSeries = async () => {
      try {
        const res = await fetch("/api/series?onlyMine=true");
        if (res.ok) {
          const data = await res.json();
          setAvailableSeries(data);
        }
      } catch (err) { console.error("Failed to fetch series:", err); }
    };

    fetchStory();
    fetchAvailableUniverses();
    fetchAvailableSeries();
  }, [storyId, router]);

  useEffect(() => {
    if (!activeChapterId) return;
    const fetchChapter = async () => {
      setLoadingChapter(true);
      try {
        const res = await fetch(`/api/stories/${storyId}/chapters/${activeChapterId}`);
        if (res.ok) {
          const data = await res.json();
          setChapterContent(data.chapter.content);
        }
      } finally { setLoadingChapter(false); }
    };
    fetchChapter();
  }, [activeChapterId, storyId]);

  const handleSaveChapter = useCallback(async (content: unknown) => {
    if (!activeChapterId) return;
    const res = await fetch(`/api/stories/${storyId}/chapters/${activeChapterId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error("Failed to save");
  }, [activeChapterId, storyId]);

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
          universeId: editUniverseId || null,
          seriesId: editSeriesId || null,
          sequenceNumber: editSequenceNumber || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setStory((prev) => (prev ? { ...prev, ...data.story } : prev));
      }
    } finally { setSavingMeta(false); }
  };

  const handleTogglePublish = async () => {
    if (!story) return;
    setPublishLoading(true);
    try {
      const res = await fetch(`/api/stories/${storyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !story.published }),
      });
      if (res.ok) { setStory((prev) => prev ? { ...prev, published: !prev.published } : prev); }
    } finally { setPublishLoading(false); }
  };

  const handleAutoSaveCover = async (url: string) => {
    setEditCoverUrl(url);
    try {
      const res = await fetch(`/api/stories/${storyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverUrl: url }),
      });
      if (res.ok) {
        setStory((prev) => (prev ? { ...prev, coverUrl: url } : prev));
        toast.success("Cover updated instantly!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save cover.");
    }
  };

  const handleDeleteStory = async () => {
    if (!confirm("Are you sure you want to delete this story? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/stories/${storyId}`, { method: "DELETE" });
      if (res.ok) router.push("/write");
    } catch { console.error("Failed to delete story"); }
  };

  if (loadingStory) return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
    </main>
  );

  if (!story) return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950">
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Manuscript Not Found</p>
      <Link href="/write" className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white hover:underline">Return to Hub</Link>
    </main>
  );

  const activeChapter = chapters.find((c) => c.id === activeChapterId);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        
        {/* Top Registry Bar */}
        <header className="mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/write" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Studio Hub
            </Link>
            <div className="flex items-center gap-4 border-l border-zinc-100 dark:border-zinc-900 pl-6">
              <h1 className="text-sm font-bold tracking-tight truncate max-w-sm">{story.title}</h1>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1.5 ${
                  story.published ? "text-emerald-500 bg-emerald-50/5 border border-emerald-500/10" : "text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                }`}>
                  {story.published ? <Globe className="w-2.5 h-2.5" /> : <GlobeLock className="w-2.5 h-2.5" />}
                  {story.published ? "Published" : "Draft Registry"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {story.published && (
              <Link href={`/stories/${storyId}`} target="_blank" className="px-4 py-1.5 border border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded transition-all flex items-center gap-2">
                <Eye className="w-3 h-3" /> Preview
              </Link>
            )}
            <button onClick={handleTogglePublish} disabled={publishLoading} className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center gap-2 ${
              story.published ? "bg-amber-50/10 text-amber-500 border border-amber-500/10 hover:bg-amber-500 hover:text-white" : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90"
            }`}>
              {publishLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : story.published ? "Withdraw Publication" : "Execute Publication"}
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded transition-all ${
              showSettings ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" : "text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
            }`}>
              <Settings2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Settings Registry Panel */}
        {showSettings && (
          <div className="mb-12 p-8 border border-zinc-100 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-900">
              <FilePenLine className="w-3.5 h-3.5 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Manuscript Metadata</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Volume Title</label>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-md text-xs font-medium outline-none focus:border-zinc-900 dark:focus:border-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Archival Summary</label>
                <textarea value={editSummary} onChange={(e) => setEditSummary(e.target.value)} rows={3} className="w-full px-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-md text-xs font-medium outline-none focus:border-zinc-900 dark:focus:border-white resize-none" />
                
                <div className="pt-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Associated Universe</label>
                    <select
                      value={editUniverseId || ""}
                      onChange={(e) => setEditUniverseId(e.target.value || null)}
                      className="w-full px-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-md text-xs font-medium outline-none focus:border-zinc-900 dark:focus:border-white appearance-none cursor-pointer"
                    >
                      <option value="">None (Standalone Story)</option>
                      {availableUniverses.map((uni) => (
                        <option key={uni.id} value={uni.id}>
                          {uni.name} ({uni.genre})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Associated Series</label>
                    <select
                      value={editSeriesId || ""}
                      onChange={(e) => setEditSeriesId(e.target.value || null)}
                      className="w-full px-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-md text-xs font-medium outline-none focus:border-zinc-900 dark:focus:border-white appearance-none cursor-pointer"
                    >
                      <option value="">None (Standalone Story)</option>
                      {availableSeries.map((ser) => (
                        <option key={ser.id} value={ser.id}>
                          {ser.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {(editUniverseId || editSeriesId) && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Sequence Number (Optional)</label>
                      <input
                        type="number"
                        min={1}
                        value={editSequenceNumber ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditSequenceNumber(val ? parseInt(val) : null);
                        }}
                        placeholder="e.g. 1 (Book One), 2 (Book Two)"
                        className="w-full px-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-md text-xs font-medium outline-none focus:border-zinc-900 dark:focus:border-white"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 ml-1">Visual Registry</label>
                <div className="p-4 border border-dashed border-zinc-100 dark:border-zinc-800 rounded bg-white/50 dark:bg-zinc-950/50">
                  <FileUpload accept="image/*" maxSize={5 * 1024 * 1024} onUpload={handleAutoSaveCover} label="Upload Record Cover" />
                  <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                    <AiCoverGenerator onCoverGenerated={handleAutoSaveCover} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-900">
              <button onClick={handleDeleteStory} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Purge Manuscript
              </button>
              <button onClick={handleSaveMeta} disabled={savingMeta} className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center gap-2">
                {savingMeta ? <Loader2 className="w-3 h-3 animate-spin" /> : "Commit Changes"}
              </button>
            </div>
          </div>
        )}

        {/* Main Creative Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
          {/* Chapter Navigation Sidebar */}
          <aside className="space-y-6">
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <Layout className="w-3.5 h-3.5 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Chapter Registry</h2>
            </div>
            <ChapterList
              chapters={chapters}
              storyId={storyId}
              activeChapterId={activeChapterId}
              onSelectChapter={setActiveChapterId}
              onChaptersChange={setChapters}
            />
          </aside>

          {/* Active Canvas */}
          <section>
            {activeChapter ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-50 dark:border-zinc-900">
                  <h2 className="text-xs font-bold tracking-tight text-zinc-400">
                    Modifying: <span className="text-zinc-900 dark:text-white ml-2">{activeChapter.title}</span>
                  </h2>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300">Manuscript Active</span>
                </div>

                {loadingChapter ? (
                  <div className="flex items-center justify-center py-40 bg-zinc-50/20 dark:bg-zinc-900/10 border border-dashed border-zinc-100 dark:border-zinc-900 rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
                  </div>
                ) : (
                  <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-md p-2">
                    <StoryEditor
                      key={activeChapterId}
                      chapterId={activeChapterId!}
                      storyId={storyId}
                      initialContent={chapterContent}
                      onSave={handleSaveChapter}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 border border-dashed border-zinc-100 dark:border-zinc-900 rounded-lg text-center bg-zinc-50/20 dark:bg-zinc-900/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Initialize a chapter to begin transmission.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
