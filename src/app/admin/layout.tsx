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
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onCloseAction={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-1 flex-col md:ml-64">
        {/* Mobile header */}
        <header className="flex h-14 items-center border-b border-zinc-200 bg-white px-4 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 font-semibold text-zinc-900 dark:text-zinc-50">
            Admin
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

