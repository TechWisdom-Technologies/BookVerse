import type { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-6 py-12 sm:px-10">
      <aside className="hidden w-56 shrink-0 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 md:block">
        <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Admin
        </div>
        <nav className="mt-3 flex flex-col">
          {[
            ["Dashboard", "/admin"],
            ["Users", "/admin/users"],
            ["Books", "/admin/books"],
            ["Stories", "/admin/stories"],
            ["Comments", "/admin/comments"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

