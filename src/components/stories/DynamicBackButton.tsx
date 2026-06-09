"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export function DynamicBackButton() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Next.js client-side routing doesn't always update document.referrer reliably.
    // Instead, we just check if they have a browser history state we can return to.
    if (window.history.length > 1) {
      setCanGoBack(true);
    }
  }, []);

  return (
    <button
      onClick={() => {
        if (canGoBack) {
          router.back();
          // Force scroll to top after a short delay to override Next.js scroll restoration
          setTimeout(() => window.scrollTo(0, 0), 50);
        } else {
          router.push("/stories");
        }
      }}
      className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
    >
      <ArrowLeft className="w-3 h-3" />
      Story Archives
    </button>
  );
}
