'use client';

import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

interface ReadingProgressTrackerProps {
  storyId: string;
  chapterId: string;
}

export function ReadingProgressTracker({ storyId, chapterId }: ReadingProgressTrackerProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    // 1. Fetch and restore saved progress
    const restoreProgress = async () => {
      try {
        const res = await fetch(`/api/stories/${storyId}/progress`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.chapterId === chapterId && data.percentage > 5 && !hasRestoredRef.current) {
            hasRestoredRef.current = true;
            // Wait for narrative to fully render and calculate height
            setTimeout(() => {
              const article = document.querySelector('article');
              if (article) {
                const rect = article.getBoundingClientRect();
                const articleTop = rect.top + window.scrollY;
                const articleHeight = rect.height;
                const targetScroll = articleTop + (data.percentage / 100) * articleHeight - window.innerHeight / 2;
                
                window.scrollTo({
                  top: targetScroll,
                  behavior: 'smooth',
                });

                toast.success(`Resumed reading position at ${Math.round(data.percentage)}% 📖`, {
                  duration: 4000,
                  position: 'bottom-right',
                });
              }
            }, 800);
          }
        }
      } catch (err) {
        console.error('Failed to restore progress:', err);
      }
    };

    restoreProgress();
  }, [storyId, chapterId]);

  useEffect(() => {
    // 2. Track scroll and calculate percentage
    const handleScroll = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;

      if (articleHeight <= 0) return;

      const viewportTrigger = window.scrollY + window.innerHeight / 2;
      
      let percentage = 0;
      if (viewportTrigger > articleTop) {
        percentage = ((viewportTrigger - articleTop) / articleHeight) * 100;
      }

      const finalPercentage = Math.min(100, Math.max(0, percentage));
      setScrollProgress(finalPercentage);
      progressRef.current = finalPercentage;

      // 3. Debounce save to database
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await fetch(`/api/stories/${storyId}/progress`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chapterId,
              percentage: progressRef.current,
            }),
          });
        } catch (err) {
          console.error('Failed to save reading progress:', err);
        }
      }, 2000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [storyId, chapterId]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-zinc-100 dark:bg-zinc-900/50 z-[9999]">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
