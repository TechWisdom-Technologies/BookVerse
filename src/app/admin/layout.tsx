"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Menu, Loader2 } from "lucide-react";
import Link from "next/link";
import { AccessDeniedModal } from "@/components/auth/AccessDeniedModal";

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
    return <AccessDeniedModal requiredTier="ADMIN" redirectTo="/" />;
  }

  return (
    <div className="flex h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A] overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onCloseAction={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-1 flex-col md:ml-64 min-w-0">
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

        <main className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </main>
      </div>
    </div>
  );
}

