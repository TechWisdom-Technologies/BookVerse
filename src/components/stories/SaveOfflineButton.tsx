"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, CheckCircle2, Loader2, Trash2, WifiOff } from "lucide-react";
import toast from "react-hot-toast";
import {
  saveStoryOffline,
  isStorySavedOffline,
  deleteOfflineStory,
  compressImageToBase64,
  getExpirationLabel,
  getOfflineStory,
} from "@/lib/offline-storage";

interface SaveOfflineButtonProps {
  storyId: string;
  title: string;
  author: string;
  authorUsername: string;
  description: string;
  coverUrl: string | null;
  chapters: {
    id: string;
    title: string;
    chapterOrder: number;
    htmlContent: string;
  }[];
}

type DownloadState = "idle" | "checking" | "downloading" | "compressing" | "saved";

export function SaveOfflineButton({
  storyId,
  title,
  author,
  authorUsername,
  description,
  coverUrl,
  chapters,
}: SaveOfflineButtonProps) {
  const [state, setState] = useState<DownloadState>("checking");
  const [expirationLabel, setExpirationLabel] = useState("");

  const checkStatus = useCallback(async () => {
    try {
      const saved = await isStorySavedOffline(storyId);
      if (saved) {
        const story = await getOfflineStory(storyId);
        if (story) {
          setExpirationLabel(getExpirationLabel(story.expiresAt));
        }
        setState("saved");
      } else {
        setState("idle");
      }
    } catch {
      setState("idle");
    }
  }, [storyId]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const handleSave = async () => {
    if (state === "downloading" || state === "compressing") return;

    try {
      setState("downloading");

      // Compress cover image to Base64
      setState("compressing");
      let coverBase64 = "";
      if (coverUrl) {
        coverBase64 = await compressImageToBase64(coverUrl);
      }

      await saveStoryOffline({
        id: storyId,
        title,
        author,
        authorUsername,
        description,
        coverImage: coverBase64,
        chapters,
      });

      setState("saved");
      const story = await getOfflineStory(storyId);
      if (story) {
        setExpirationLabel(getExpirationLabel(story.expiresAt));
      }
      toast.success("গল্পটি অফলাইনে সেভ হয়েছে!");
    } catch (error) {
      console.error("Failed to save offline:", error);
      toast.error("অফলাইনে সেভ করতে ব্যর্থ হয়েছে");
      setState("idle");
    }
  };

  const handleRemove = async () => {
    try {
      await deleteOfflineStory(storyId);
      setState("idle");
      setExpirationLabel("");
      toast.success("অফলাইন থেকে মুছে ফেলা হয়েছে");
    } catch (error) {
      console.error("Failed to remove offline story:", error);
      toast.error("মুছে ফেলতে ব্যর্থ হয়েছে");
    }
  };

  if (state === "checking") return null;

  if (state === "saved") {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">
            Offline Ready
          </span>
          {expirationLabel && (
            <>
              <span className="text-emerald-300 dark:text-emerald-700">•</span>
              <span className="text-[9px] font-mono font-bold">{expirationLabel}</span>
            </>
          )}
        </div>
        <button
          onClick={handleRemove}
          className="p-1.5 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
          title="Remove from offline"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSave}
      disabled={state === "downloading" || state === "compressing"}
      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all disabled:opacity-50"
    >
      {state === "downloading" || state === "compressing" ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
            {state === "downloading" ? "Fetching..." : "Compressing..."}
          </span>
        </>
      ) : (
        <>
          <WifiOff className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
            Save Offline
          </span>
        </>
      )}
    </button>
  );
}
