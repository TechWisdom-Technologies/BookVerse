"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  ChevronLeft,
} from "lucide-react";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/books", label: "Books", icon: BookOpen },
  { href: "/admin/stories", label: "Stories", icon: FileText },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
];

interface SidebarProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export function Sidebar({ isOpen, onCloseAction }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/50 backdrop-blur-sm md:hidden"
          onClick={onCloseAction}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 transform border-r border-zinc-200/50 bg-white/80 backdrop-blur-md transition-transform duration-300 ease-in-out dark:border-zinc-800/50 dark:bg-zinc-950/80 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-zinc-200/50 px-6 dark:border-zinc-800/50">
            <Link
              href="/admin"
              className="flex items-center gap-3 text-lg font-black tracking-tight text-zinc-900 dark:text-white"
            >
              <img
                src="/bookverse.png"
                alt="BookVerse"
                className="h-8 w-8 object-contain rounded"
              />
              <div className="flex flex-col">
                <span className="text-sm font-black text-zinc-900 dark:text-white leading-tight">Admin Panel</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">By TechWisdom</span>
              </div>
            </Link>
            <button
              onClick={onCloseAction}
              className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 md:hidden dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onCloseAction()}
                  className={`group flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${
                    active
                      ? "bg-brand/10 text-brand dark:bg-brand/10 dark:text-brand shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white"
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-zinc-200/50 p-4 dark:border-zinc-800/50">
            <Link
              href="/"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200/50 bg-zinc-50 px-4 py-3.5 text-sm font-bold text-zinc-600 transition-all hover:border-zinc-300 hover:bg-white hover:text-zinc-900 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Exit Admin
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
