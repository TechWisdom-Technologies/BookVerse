"use client";

import { useEffect } from "react";

interface StoryViewTrackerProps {
  storyId: string;
}

export function StoryViewTracker({ storyId }: StoryViewTrackerProps) {
  useEffect(() => {
    const viewedKey = `story-viewed-${storyId}`;
    if (sessionStorage.getItem(viewedKey)) return;

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/stories/${storyId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ incrementView: true }),
        });

        if (response.ok) {
          sessionStorage.setItem(viewedKey, "1");
        }
      } catch {
        // View tracking must never interrupt reading.
      }
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [storyId]);

  return null;
}
