"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  AlertCircle,
  Globe,
  ChevronLeft,
  ChevronDown,
  CreditCard,
  ShieldAlert,
  Library,
  Headphones,
  Wallet,
  Mail,
  Database,
  Activity,
  Terminal,
} from "lucide-react";

interface SidebarItem {
  href?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: { href: string; label: string }[];
}

const sidebarItems: SidebarItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Monitoring",
    icon: Activity,
    subItems: [
      { href: "/admin/monitoring", label: "System Monitor" },
      { href: "/admin/ai-metrics", label: "AI Monitor" },
      { href: "/admin/storage", label: "Storage Monitor" },
    ],
  },
  { href: "/admin/users", label: "Users", icon: Users },
  {
    label: "Payment",
    icon: CreditCard,
    subItems: [
      { href: "/admin/transactions", label: "Payments" },
      { href: "/admin/payouts", label: "Author Payouts" },
    ],
  },
  {
    label: "Writings",
    icon: BookOpen,
    subItems: [
      { href: "/admin/books", label: "Books" },
      { href: "/admin/stories", label: "Stories" },
      { href: "/admin/universes", label: "Universes" },
      { href: "/admin/series", label: "Series" },
    ],
  },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
  {
    label: "Reports",
    icon: ShieldAlert,
    subItems: [
      { href: "/admin/reports", label: "Safety Reports" },
      { href: "/admin/dmca", label: "DMCA" },
    ],
  },
  { href: "/admin/clubs", label: "Clubs", icon: Users },
  { href: "/admin/support", label: "Support Tickets", icon: Headphones },
  { href: "/admin/newsletters", label: "Newsletters", icon: Mail },
  { href: "/admin/operations", label: "Operations", icon: Terminal },
];

interface SidebarProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export function Sidebar({ isOpen, onCloseAction }: SidebarProps) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const isSubItemActive = (subItems?: { href: string }[]) => {
    return subItems?.some((sub) => isActive(sub.href)) || false;
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
        className={`fixed left-0 top-0 z-50 h-full w-64 transform border-r border-zinc-200/50 bg-white/80 backdrop-blur-md transition-transform duration-300 ease-in-out dark:border-zinc-800/50 dark:bg-zinc-950/80 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
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
          <nav className="flex-1 space-y-2 p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = !!item.subItems;
              const active = isActive(item.href) || isSubItemActive(item.subItems);
              const isOpenDropdown = openDropdowns[item.label] || isSubItemActive(item.subItems);

              if (hasSubItems) {
                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`group flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${active
                          ? "bg-brand/10 text-brand dark:bg-brand/10 dark:text-brand shadow-sm"
                          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <Icon className={`h-5 w-5 transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`} />
                        {item.label}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${isOpenDropdown ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {isOpenDropdown && (
                      <div className="ml-12 flex flex-col space-y-1">
                        {item.subItems!.map((subItem) => {
                          const subActive = isActive(subItem.href);
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => onCloseAction()}
                              className={`rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300 ${subActive
                                  ? "text-brand"
                                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white"
                                }`}
                            >
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href || item.label}
                  href={item.href!}
                  onClick={() => onCloseAction()}
                  className={`group flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${active
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
