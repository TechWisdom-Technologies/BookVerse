"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Menu, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, dbUser, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!user || dbUser?.role !== "ADMIN") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Access Denied
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          You don&apos;t have permission to access the admin panel.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onCloseAction={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-1 flex-col md:ml-64">
        {/* Mobile header */}
        <header className="flex h-16 items-center border-b border-zinc-200/50 bg-white/80 backdrop-blur-md px-4 md:hidden dark:border-zinc-800/50 dark:bg-zinc-950/80 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="ml-4 text-lg font-black tracking-tight text-zinc-900 dark:text-white">
            BookVerse Admin
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

