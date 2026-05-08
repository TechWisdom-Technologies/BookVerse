import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            BookVerse
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/library" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              Library
            </Link>
            <Link href="/stories" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              Stories
            </Link>
            <Link href="/write" className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
              Write
            </Link>
          </nav>

          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            © {new Date().getFullYear()} BookVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
