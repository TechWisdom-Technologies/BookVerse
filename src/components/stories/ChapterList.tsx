"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  GripVertical,
  BookOpen,
  Layout,
  FileText
} from "lucide-react";

export interface ChapterItem {
  id: string;
  title: string;
  chapterOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface ChapterListProps {
  chapters: ChapterItem[];
  storyId: string;
  activeChapterId: string | null;
  onSelectChapter: (chapterId: string) => void;
  onChaptersChange: (chapters: ChapterItem[]) => void;
}

export default function ChapterList({
  chapters,
  storyId,
  activeChapterId,
  onSelectChapter,
  onChaptersChange,
}: ChapterListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleAddChapter = async () => {
    if (!newTitle.trim()) return;
    setLoadingAction("add");

    try {
      const res = await fetch(`/api/stories/${storyId}/chapters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        onChaptersChange([...chapters, data.chapter]);
        setNewTitle("");
        setIsAdding(false);
        onSelectChapter(data.chapter.id);
      }
    } catch (error) {
      console.error("Failed to add chapter:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm("Are you sure you want to delete this chapter?")) return;
    setLoadingAction(`delete-${chapterId}`);

    try {
      const res = await fetch(
        `/api/stories/${storyId}/chapters/${chapterId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        const updated = chapters
          .filter((c) => c.id !== chapterId)
          .map((c, i) => ({ ...c, chapterOrder: i + 1 }));
        onChaptersChange(updated);

        if (activeChapterId === chapterId && updated.length > 0) {
          onSelectChapter(updated[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to delete chapter:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleMoveChapter = async (
    chapterId: string,
    direction: "up" | "down"
  ) => {
    const index = chapters.findIndex((c) => c.id === chapterId);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === chapters.length - 1) return;

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...chapters];
    [reordered[index], reordered[swapIndex]] = [
      reordered[swapIndex],
      reordered[index],
    ];

    const withNewOrder = reordered.map((c, i) => ({
      ...c,
      chapterOrder: i + 1,
    }));
    onChaptersChange(withNewOrder);

    setLoadingAction(`move-${chapterId}`);
    try {
      await Promise.all([
        fetch(
          `/api/stories/${storyId}/chapters/${withNewOrder[index].id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chapterOrder: withNewOrder[index].chapterOrder,
            }),
          }
        ),
        fetch(
          `/api/stories/${storyId}/chapters/${withNewOrder[swapIndex].id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chapterOrder: withNewOrder[swapIndex].chapterOrder,
            }),
          }
        ),
      ]);
    } catch (error) {
      console.error("Failed to reorder chapters:", error);
      onChaptersChange(chapters);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRenameChapter = async (chapterId: string) => {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }

    setLoadingAction(`rename-${chapterId}`);
    try {
      const res = await fetch(
        `/api/stories/${storyId}/chapters/${chapterId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: editTitle.trim() }),
        }
      );

      if (res.ok) {
        onChaptersChange(
          chapters.map((c) =>
            c.id === chapterId ? { ...c, title: editTitle.trim() } : c
          )
        );
      }
    } catch (error) {
      console.error("Failed to rename chapter:", error);
    } finally {
      setEditingId(null);
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex flex-col border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden">
      {/* Simple Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-50/50 dark:bg-zinc-900/10 border-b border-zinc-50 dark:border-zinc-900">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <FileText className="w-3.5 h-3.5" />
          Chapter List ({chapters.length})
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-2 py-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-bold uppercase tracking-widest rounded transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3 h-3" />
          Add
        </button>
      </div>

      {/* Add Chapter Input */}
      {isAdding && (
        <div className="p-4 bg-zinc-50/10 border-b border-zinc-50 dark:border-zinc-900 space-y-3">
          <input
            type="text"
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddChapter();
              if (e.key === "Escape") { setIsAdding(false); setNewTitle(""); }
            }}
            placeholder="e.g. Chapter 1: The Beginning"
            className="w-full px-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-medium outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddChapter}
              disabled={!newTitle.trim() || loadingAction === "add"}
              className="px-4 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[9px] font-bold uppercase tracking-widest rounded transition-all flex items-center gap-2"
            >
              {loadingAction === "add" && <Loader2 className="w-3 h-3 animate-spin" />}
              Save Chapter
            </button>
            <button
              onClick={() => { setIsAdding(false); setNewTitle(""); }}
              className="px-4 py-1.5 text-zinc-400 text-[9px] font-bold uppercase tracking-widest hover:text-zinc-900 dark:hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Chapter List */}
      <div className="max-h-[600px] overflow-y-auto">
        {chapters.length === 0 ? (
          <div className="px-6 py-12 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-300">
            No chapters found.
          </div>
        ) : (
          <div className="divide-y divide-zinc-50 dark:divide-zinc-900">
            {chapters
              .sort((a, b) => a.chapterOrder - b.chapterOrder)
              .map((chapter, index) => (
                <div
                  key={chapter.id}
                  onClick={() => onSelectChapter(chapter.id)}
                  className={`group flex items-center gap-4 px-4 py-3 cursor-pointer transition-all ${
                    activeChapterId === chapter.id
                      ? "bg-zinc-50 dark:bg-zinc-900"
                      : "hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                  }`}
                >
                  <GripVertical className="w-3.5 h-3.5 text-zinc-200 dark:text-zinc-800 shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    {editingId === chapter.id ? (
                      <input
                        type="text"
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRenameChapter(chapter.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        onBlur={() => handleRenameChapter(chapter.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-900 dark:border-white px-2 py-0.5 text-xs font-bold outline-none rounded"
                      />
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <span className={`text-[11px] font-bold uppercase tracking-tight truncate ${
                          activeChapterId === chapter.id ? "text-zinc-900 dark:text-white" : "text-zinc-500"
                        }`}>
                          {chapter.chapterOrder}. {chapter.title}
                        </span>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMoveChapter(chapter.id, "up"); }}
                            disabled={index === 0}
                            className="p-1 text-zinc-300 hover:text-zinc-900 dark:hover:text-white disabled:opacity-20"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMoveChapter(chapter.id, "down"); }}
                            disabled={index === chapters.length - 1}
                            className="p-1 text-zinc-300 hover:text-zinc-900 dark:hover:text-white disabled:opacity-20"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteChapter(chapter.id); }}
                            className="p-1 text-zinc-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
