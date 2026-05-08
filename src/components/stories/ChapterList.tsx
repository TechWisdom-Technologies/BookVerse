"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  GripVertical,
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

        // If deleting the active chapter, select the first remaining one
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

    // Update order numbers
    const withNewOrder = reordered.map((c, i) => ({
      ...c,
      chapterOrder: i + 1,
    }));
    onChaptersChange(withNewOrder);

    // Persist the reorder
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
      // Revert on failure
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
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Chapters ({chapters.length})
        </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {/* Add Chapter Input */}
      {isAdding && (
        <div className="border-b border-zinc-200 p-3 dark:border-zinc-800">
          <input
            type="text"
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddChapter();
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewTitle("");
              }
            }}
            placeholder="Chapter title..."
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleAddChapter}
              disabled={!newTitle.trim() || loadingAction === "add"}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loadingAction === "add" && (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
              Add Chapter
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewTitle("");
              }}
              className="rounded-lg px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Chapter List */}
      <div className="flex-1 overflow-y-auto">
        {chapters.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No chapters yet. Add your first chapter to start writing.
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {chapters
              .sort((a, b) => a.chapterOrder - b.chapterOrder)
              .map((chapter, index) => (
                <li
                  key={chapter.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 transition-colors cursor-pointer ${
                    activeChapterId === chapter.id
                      ? "bg-indigo-50 dark:bg-indigo-950/50"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                  onClick={() => onSelectChapter(chapter.id)}
                >
                  {/* Grip icon */}
                  <GripVertical className="h-3.5 w-3.5 flex-shrink-0 text-zinc-300 dark:text-zinc-600" />

                  {/* Chapter info */}
                  <div className="flex-1 min-w-0">
                    {editingId === chapter.id ? (
                      <input
                        type="text"
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleRenameChapter(chapter.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        onBlur={() => handleRenameChapter(chapter.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full rounded border border-indigo-300 bg-white px-2 py-0.5 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-indigo-700 dark:bg-zinc-900 dark:text-zinc-50"
                      />
                    ) : (
                      <button
                        type="button"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditingId(chapter.id);
                          setEditTitle(chapter.title);
                        }}
                        className="block w-full text-left"
                      >
                        <span
                          className={`text-sm truncate block ${
                            activeChapterId === chapter.id
                              ? "font-medium text-indigo-700 dark:text-indigo-300"
                              : "text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {chapter.chapterOrder}. {chapter.title}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveChapter(chapter.id, "up");
                      }}
                      disabled={index === 0}
                      className="rounded p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 dark:hover:text-zinc-200"
                      title="Move up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveChapter(chapter.id, "down");
                      }}
                      disabled={index === chapters.length - 1}
                      className="rounded p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 dark:hover:text-zinc-200"
                      title="Move down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChapter(chapter.id);
                      }}
                      disabled={loadingAction === `delete-${chapter.id}`}
                      className="rounded p-1 text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Delete chapter"
                    >
                      {loadingAction === `delete-${chapter.id}` ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
