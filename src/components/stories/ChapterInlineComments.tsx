"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { getFriendlyErrorMessage } from "@/lib/friendly-errors";
import toast from "react-hot-toast";

interface InlineComment {
  id: string;
  paragraphId: string;
  content: string;
  spoilerAlert: boolean;
  createdAt: string;
  author: {
    username: string;
    displayName: string | null;
  };
}

export function ChapterInlineComments({ storyId, chapterId }: { storyId: string; chapterId: string }) {
  const paragraphId = `chapter-${chapterId}`;
  const [comments, setComments] = useState<InlineComment[]>([]);
  const [content, setContent] = useState("");
  const [spoilerAlert, setSpoilerAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const chapterComments = useMemo(
    () => comments.filter((comment) => comment.paragraphId === paragraphId),
    [comments, paragraphId]
  );

  useEffect(() => {
    const loadComments = async () => {
      const res = await fetch(`/api/stories/${storyId}/inline-comments`);
      if (res.ok) {
        setComments(await res.json());
      }
    };

    loadComments();
  }, [storyId]);

  const submit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/stories/${storyId}/inline-comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paragraphId, content, spoilerAlert }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to comment");
      setComments((prev) => [data, ...prev]);
      setContent("");
      setSpoilerAlert(false);
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error, "Failed to post comment. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-16 border-t border-zinc-100 dark:border-zinc-900 pt-10">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-4 w-4 text-zinc-400" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Inline Chapter Comments</h2>
      </div>
      <div className="space-y-3 mb-6">
        {chapterComments.length === 0 ? (
          <p className="text-xs text-zinc-400 italic">No inline notes on this chapter yet.</p>
        ) : (
          chapterComments.map((comment) => (
            <div key={comment.id} className="rounded border border-zinc-100 dark:border-zinc-900 p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {comment.author.displayName || comment.author.username}
                </p>
                {comment.spoilerAlert && <span className="text-[9px] font-bold uppercase tracking-widest text-rose-500">Spoiler</span>}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{comment.content}</p>
            </div>
          ))
        )}
      </div>
      <div className="rounded border border-zinc-100 dark:border-zinc-900 p-4 space-y-3">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={3}
          placeholder="Add an inline note for this chapter"
          className="w-full resize-none bg-white dark:bg-zinc-950 text-sm outline-none"
        />
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs text-zinc-500">
            <input type="checkbox" checked={spoilerAlert} onChange={(event) => setSpoilerAlert(event.target.checked)} />
            Spoiler
          </label>
          <button
            onClick={submit}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            Post
          </button>
        </div>
      </div>
    </section>
  );
}
