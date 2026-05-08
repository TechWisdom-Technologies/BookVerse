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
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onCloseAction}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 transform border-r border-zinc-200 bg-white transition-transform duration-200 dark:border-zinc-800 dark:bg-zinc-950 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              <LayoutDashboard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Admin
            </Link>
            <button
              onClick={onCloseAction}
              className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 md:hidden dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onCloseAction()}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to site
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
