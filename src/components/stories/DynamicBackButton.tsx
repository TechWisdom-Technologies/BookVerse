"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

interface DynamicBackButtonProps {
  fallbackHref?: string;
  label?: string;
  className?: string;
}

export function DynamicBackButton({
  fallbackHref = "/stories",
  label = "Story Archives",
  className = ""
}: DynamicBackButtonProps = {}) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if there is browser history state we can return to
    if (window.history.length > 1) {
      setCanGoBack(true);
    }
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        if (canGoBack) {
          router.back();
          // Force scroll to top after a short delay to override Next.js scroll restoration
          setTimeout(() => window.scrollTo(0, 0), 50);
        } else {
          router.push(fallbackHref);
        }
      }}
      className={`inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors group ${className}`}
    >
      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
      <span>{label}</span>
    </button>
  );
}
