"use client";

import { useState, useEffect, useCallback, use } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/shared/FileUpload";
import { AuthorStoryTools } from "@/components/stories/AuthorStoryTools";
import { getFriendlyErrorMessage } from "@/lib/friendly-errors";
import { toast } from "react-hot-toast";
import ChapterList, {
  type ChapterItem,
} from "@/components/stories/ChapterList";
import { AiCoverGenerator } from "@/components/stories/AiCoverGenerator";
import {
  ArrowLeft,
  Globe,
  GlobeLock,
  Settings2,
  Loader2,
  Eye,
  Trash2,
  FilePenLine,
  Layout,
  Sparkles,
  Image as ImageIcon,
  Check,
  Terminal,
  Activity,
  Archive,
  BookOpen
} from "lucide-react";

const StoryEditor = dynamic(
  () => import("@/components/stories/StoryEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-24 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-200 dark:text-zinc-800" />
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
  sequenceNumber: number | null;
  subGenres: string[];
  mood: string | null;
  contentWarnings: string[];
  ageRating: number | null;
  tags: string[];
  description: string | null;
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

  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editCoverUrl, setEditCoverUrl] = useState("");
  const [editUniverseId, setEditUniverseId] = useState<string | null>(null);
  const [editSequenceNumber, setEditSequenceNumber] = useState<number | null>(null);
  const [editSubGenres, setEditSubGenres] = useState<string[]>([]);
  const [editMood, setEditMood] = useState("");
  const [editContentWarnings, setEditContentWarnings] = useState<string[]>([]);
  const [editAgeRating, setEditAgeRating] = useState<number>(0);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editDescription, setEditDescription] = useState("");
  const [availableUniverses, setAvailableUniverses] = useState<any[]>([]);
  const [savingMeta, setSavingMeta] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch(`/api/stories/${storyId}`);
        if (!res.ok) { router.push("/write"); return; }
        const data = await res.json();
        const storyData: StoryData = data.story;
        setStory(storyData);
        setChapters(storyData.chapters);
        setEditTitle(storyData.title);
        setEditSummary(storyData.summary || "");
        setEditCoverUrl(storyData.coverUrl || "");
        setEditUniverseId(storyData.universeId);
        setEditSequenceNumber(storyData.sequenceNumber ?? null);
        setEditSubGenres(storyData.subGenres || []);
        setEditMood(storyData.mood || "");
        setEditContentWarnings(storyData.contentWarnings || []);
        setEditAgeRating(storyData.ageRating || 0);
        setEditTags(storyData.tags || []);
        setEditDescription(storyData.description || "");
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

    fetchStory();
    fetchAvailableUniverses();
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
    if (!editTitle.trim()) {
      toast.error("Title is required");
      return;
    }
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
          sequenceNumber: editSequenceNumber || null,
          subGenres: editSubGenres,
          mood: editMood || null,
          contentWarnings: editContentWarnings,
          ageRating: Number(editAgeRating) || 0,
          tags: editTags,
          description: editDescription || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setStory((prev) => (prev ? { ...prev, ...data.story } : prev));
        setShowSettings(false);
        toast.success("Settings saved!");
      } else {
        const errorData = await res.json();
        const details = errorData?.details ? errorData.details.map((d: any) => d.message).join(", ") : "";
        const baseError = errorData?.error || "Failed to save";
        throw new Error(details ? `${baseError}: ${details}` : baseError);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(getFriendlyErrorMessage(err, "Failed to save settings. Please try again."));
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

  const handleDeleteStory = async () => {
    if (!confirm("Are you sure you want to delete this story? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/stories/${storyId}`, { method: "DELETE" });
      if (res.ok) router.push("/write");
    } catch { console.error("Failed to delete story"); }
  };

  if (loadingStory) return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-6 h-6 animate-spin text-zinc-200 dark:text-zinc-800" />
    </main>
  );

  if (!story) return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-6 italic">Story not found.</p>
      <Link href="/write" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-white hover:underline underline-offset-8">Go Back</Link>
    </main>
  );

  const activeChapter = chapters.find((c) => c.id === activeChapterId);

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        
        {/* Top Bar */}
        <header className="mb-8 pb-4 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link href="/write" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              My Stories
            </Link>
            <div className="flex items-center gap-6 border-l border-zinc-50 dark:border-zinc-900 pl-8">
              <h1 className="text-sm font-bold tracking-tight truncate max-w-sm uppercase">{story.title}</h1>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded flex items-center gap-2 ${
                  story.published ? "text-zinc-900 bg-white border border-zinc-900 dark:text-zinc-950 dark:bg-white" : "text-zinc-300 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                }`}>
                  {story.published ? "Public" : "Draft"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {story.published && (
              <Link href={`/stories/${storyId}`} target="_blank" className="px-5 py-2 border border-zinc-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded transition-all flex items-center gap-2 shadow-sm">
                <Eye className="w-4 h-4 text-zinc-300" /> View
              </Link>
            )}
            <button onClick={handleTogglePublish} disabled={publishLoading} className={`px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all flex items-center gap-2 shadow-sm ${
              story.published ? "bg-rose-500 text-white border border-rose-500 hover:opacity-90" : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-zinc-900 dark:border-white"
            }`}>
              {publishLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : story.published ? "Unpublish" : "Publish"}
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className={`px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all flex items-center gap-2 border ${
                showSettings ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white" : "bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Settings2 className="w-4 h-4" />
              Settings
            </button>
          </div>
        </header>

        {/* Story Settings Panel */}
        {showSettings && (
          <div className="mb-12 p-12 border border-zinc-100 dark:border-zinc-900 bg-zinc-50/10 rounded flex flex-col gap-12 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              <div className="space-y-8">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                  <FilePenLine className="w-4 h-4 text-zinc-300" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Story Details</h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 ml-1">Title</label>
                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 ml-1">Summary</label>
                    <textarea value={editSummary} onChange={(e) => setEditSummary(e.target.value)} rows={5} className="w-full px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm resize-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 ml-1">Associated Universe</label>
                    <select
                      value={editUniverseId || ""}
                      onChange={(e) => setEditUniverseId(e.target.value || null)}
                      className="w-full px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="">None (Standalone Story)</option>
                      {availableUniverses.map((uni) => (
                        <option key={uni.id} value={uni.id}>
                          {uni.name} ({uni.genre})
                        </option>
                      ))}
                    </select>
                  </div>
                  {editUniverseId && (
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 ml-1">Sequence Number (Optional)</label>
                      <input
                        type="number"
                        min={1}
                        value={editSequenceNumber ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditSequenceNumber(val ? parseInt(val) : null);
                        }}
                        placeholder="e.g. 1 (Book One), 2 (Book Two)"
                        className="w-full px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                  <ImageIcon className="w-4 h-4 text-zinc-300" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Story Cover</h2>
                </div>
                <div className="space-y-6">
                  <div className="relative aspect-[2/3] w-full bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded overflow-hidden group shadow-sm">
                    {editCoverUrl ? (
                      <img src={editCoverUrl} alt="" className="h-full w-full object-cover transition-all duration-700" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-zinc-50/50 dark:bg-zinc-900/50">
                        <ImageIcon className="w-10 h-10 text-zinc-200" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">No Cover Added</span>
                      </div>
                    )}
                    <div className="absolute bottom-6 left-6 right-6">
                      <FileUpload accept="image/*" maxSize={5 * 1024 * 1024} onUpload={(url) => setEditCoverUrl(url)} label="Upload Cover" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                  <Sparkles className="w-4 h-4 text-zinc-300" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">AI Cover</h2>
                </div>
                <AiCoverGenerator onCoverGenerated={(url) => setEditCoverUrl(url)} />
              </div>
            </div>

            {/* Story Classification & Audience */}
            <div className="pt-10 border-t border-zinc-100 dark:border-zinc-900 grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                  <Activity className="w-4 h-4 text-zinc-300" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-305">Audience & Mood</h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 ml-1">Mood (e.g. Dark, Romantic, Adventurous)</label>
                    <input type="text" value={editMood} onChange={(e) => setEditMood(e.target.value)} placeholder="e.g. Melancholic, Mysterious" className="w-full px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 ml-1">Age Rating</label>
                    <select
                      value={editAgeRating}
                      onChange={(e) => setEditAgeRating(Number(e.target.value))}
                      className="w-full px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="0">All Ages (G / PG)</option>
                      <option value="13">Teenagers (13+)</option>
                      <option value="17">Mature Audiences (17+)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 ml-1">Detailed Description (Optional)</label>
                    <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={4} placeholder="A full, detailed description that will appear on the story profile..." className="w-full px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm resize-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                  <Archive className="w-4 h-4 text-zinc-300" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-305">Tags, subGenres & Warnings</h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 ml-1">Sub-Genres (Comma separated)</label>
                    <input type="text" value={editSubGenres.join(", ")} onChange={(e) => setEditSubGenres(e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="e.g. Space Opera, Cyberpunk, Hard Sci-Fi" className="w-full px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 ml-1">Content Warnings (Comma separated)</label>
                    <input type="text" value={editContentWarnings.join(", ")} onChange={(e) => setEditContentWarnings(e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="e.g. Mild Violence, Strong Language" className="w-full px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 ml-1">Search Tags (Comma separated)</label>
                    <input type="text" value={editTags.join(", ")} onChange={(e) => setEditTags(e.target.value.split(",").map(s => s.trim()).filter(Boolean))} placeholder="e.g. futuristic, neon, space" className="w-full px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white shadow-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
              <button onClick={handleDeleteStory} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 hover:text-rose-600 transition-colors">
                <Trash2 className="w-4 h-4" /> Delete Story
              </button>
              <button onClick={handleSaveMeta} disabled={savingMeta} className="px-12 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all flex items-center gap-3 border border-zinc-900 dark:border-white shadow-md">
                {savingMeta ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        <AuthorStoryTools storyId={storyId} />

        {/* Main Editor Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-16">
          {/* Chapter Sidebar */}
          <aside className="space-y-8">
            <div className="flex items-center gap-2 mb-8 pb-3 border-b border-zinc-100 dark:border-zinc-900">
              <Layout className="w-4 h-4 text-zinc-300" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Chapters</h2>
            </div>
            <ChapterList
              chapters={chapters}
              storyId={storyId}
              activeChapterId={activeChapterId}
              onSelectChapter={setActiveChapterId}
              onChaptersChange={setChapters}
            />
          </aside>

          {/* Editor Area */}
          <section className="space-y-8">
            {activeChapter ? (
              <div className="space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-50 dark:border-zinc-900">
                  <div className="flex items-center gap-4">
                    <BookOpen className="w-4 h-4 text-zinc-200" />
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">
                      Editor: <span className="text-zinc-900 dark:text-white ml-2">{activeChapter.title}</span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-[9px] font-bold text-zinc-300 italic">
                    Drafting
                  </div>
                </div>

                {loadingChapter ? (
                  <div className="flex items-center justify-center py-64 bg-zinc-50/5 dark:bg-zinc-900/5 border border-dashed border-zinc-100 dark:border-zinc-900 rounded">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-200 dark:text-zinc-800" />
                  </div>
                ) : (
                  <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded p-1 shadow-sm">
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
              <div className="flex flex-col items-center justify-center py-64 border border-dashed border-zinc-100 dark:border-zinc-900 rounded text-center bg-zinc-50/10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">Pick a chapter to start writing.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
