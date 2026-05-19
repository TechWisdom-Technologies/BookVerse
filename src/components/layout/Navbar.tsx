"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  PenLine,
  Library,
  Search,
  LogOut,
  User,
  BookMarked,
  Upload,
  Shield,
  Home,
  HelpCircle,
  Settings,
  Bell,
  Crown,
  Feather,
  MessageSquare,
  Gift,
  Crown as Premium,
  Trophy,
  Globe,
  BarChart3,
  PlusCircle,
  Mail,
  Layers,
  Send,
} from "lucide-react";

// Navigation item type
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: boolean;
}

// Left side nav items
const leftNavItems: NavItem[] = [
  { href: "/library", label: "Library", icon: Library },
  { href: "/stories", label: "Stories", icon: Feather },
  { href: "/universes", label: "Universes", icon: Globe },
  { href: "/clubs", label: "Clubs", icon: User },
];

// Right side nav items
const rightNavItems: NavItem[] = [
  { href: "/search", label: "Search", icon: Search },
  { href: "/activity-feed", label: "Feed", icon: MessageSquare },
];

// Auth-specific items
const authRightItems: NavItem[] = [
  { href: "/shelf", label: "Library", icon: BookMarked },
  { href: "/write", label: "Write", icon: PenLine },
];

// Nav Button Component
interface NavButtonProps {
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  label: string;
  isActive: boolean;
  hasBadge?: boolean;
}

function NavButton({ href, icon: Icon, label, isActive, hasBadge }: NavButtonProps) {
  return (
    <Link
      href={href}
      className="group relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300"
    >
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${isActive
        ? "bg-zinc-900/10 dark:bg-white/10 scale-100"
        : "bg-transparent scale-90 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 group-hover:scale-100"
        }`} />

      <div className="relative">
        <Icon
          size={20}
          strokeWidth={isActive ? 2.5 : 2}
          className={`transition-all duration-300 relative z-10 ${isActive
            ? "text-zinc-900 dark:text-white scale-110"
            : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:scale-105"
            }`}
        />
        {hasBadge && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-zinc-900 dark:bg-white rounded-full border border-white dark:border-zinc-900 shadow-sm" />
        )}
      </div>

      {/* Tooltip */}
      <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200 pointer-events-none ${isActive
        ? "opacity-0 translate-y-1"
        : "opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
        }`}>
        <div className="absolute inset-0 bg-zinc-900 dark:bg-white rounded shadow-md" />
        <span className="relative text-white dark:text-zinc-900">{label}</span>
      </div>
    </Link>
  );
}

// Dropdown Item Component
interface DropdownItemProps {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  highlight?: boolean;
  onClick: () => void;
}

function DropdownItem({ href, icon: Icon, label, highlight, onClick }: DropdownItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 rounded transition-all duration-200 group ${highlight
        ? "bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white"
        : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
        }`}
    >
      <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${highlight
        ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
        : "bg-zinc-50 dark:bg-zinc-900 text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white"
        }`}>
        <Icon size={14} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { user, dbUser, loading, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user && !loading) {
      fetch("/api/notifications")
        .then(res => res.json())
        .then(data => {
          if (data.unreadCount !== undefined) {
            setUnreadCount(data.unreadCount);
          }
        })
        .catch(err => console.error("Failed to fetch unread notifications", err));
    }
  }, [user, loading, pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // Build dynamic nav arrays based on auth state
  const dynamicAuthLeftItems: NavItem[] = [
    { href: "/notifications", label: "Notifications", icon: Bell, badge: unreadCount > 0 },
  ];

  const leftItems: NavItem[] = user
    ? [
        { href: "/support", label: "Support", icon: HelpCircle },
        ...dynamicAuthLeftItems,
        ...leftNavItems,
      ]
    : [
        { href: "/support", label: "Support", icon: HelpCircle },
        ...leftNavItems,
      ];
  const rightItems = user ? [...rightNavItems, ...authRightItems] : rightNavItems;

  return (
    <>
      {/* Profile Sidebar */}
      {profileOpen && user && (
        <>
          <div
            className="fixed inset-0 z-40 bg-zinc-950/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setProfileOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 z-50 bg-white dark:bg-zinc-950 border-l border-zinc-100 dark:border-zinc-900 shadow-2xl animate-in slide-in-from-right duration-300 ease-out">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-900">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded overflow-hidden border border-zinc-100 dark:border-zinc-800">
                    {dbUser?.avatarUrl ? (
                      <img
                        src={dbUser.avatarUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 font-bold text-sm uppercase">
                        {dbUser?.username?.[0]?.toUpperCase() || <User size={24} />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-zinc-900 dark:text-white truncate uppercase tracking-tight">{dbUser?.displayName || dbUser?.username}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">@{dbUser?.username}</span>
                      {dbUser?.role === "ADMIN" && (
                        <span className="px-2 py-0.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[8px] font-bold uppercase tracking-widest rounded">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800">
                    <div className="font-bold text-sm text-zinc-900 dark:text-white">{dbUser?._count?.stories ?? 0}</div>
                    <div className="text-[9px] uppercase tracking-widest text-zinc-300 font-bold">Stories</div>
                  </div>
                  <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800">
                    <div className="font-bold text-sm text-zinc-900 dark:text-white">{dbUser?._count?.followers ?? 0}</div>
                    <div className="text-[9px] uppercase tracking-widest text-zinc-300 font-bold">Followers</div>
                  </div>
                  <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800">
                    <div className="font-bold text-sm text-zinc-900 dark:text-white">{dbUser?._count?.following ?? 0}</div>
                    <div className="text-[9px] uppercase tracking-widest text-zinc-300 font-bold">Following</div>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                {/* Account */}
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 px-4 italic">Account</h3>
                  <DropdownItem
                    href={`/profile/${dbUser?.username || ""}`}
                    icon={User}
                    label="My Profile"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/settings"
                    icon={Settings}
                    label="Settings"
                    onClick={() => setProfileOpen(false)}
                  />
                </div>

                {/* Activity */}
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 px-4 italic">Activity</h3>
                  <DropdownItem
                    href="/shelf"
                    icon={BookMarked}
                    label="My Library"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/reading-challenges"
                    icon={Trophy}
                    label="Challenges"
                    onClick={() => setProfileOpen(false)}
                  />
                </div>

                {/* Rewards */}
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 px-4 italic">More</h3>
                  <DropdownItem
                    href="/premium"
                    icon={Premium}
                    label="Premium"
                    highlight
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/gifts"
                    icon={Gift}
                    label="Gifts"
                    onClick={() => setProfileOpen(false)}
                  />
                </div>

                {/* Creator */}
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 px-4 italic">Author</h3>
                  <DropdownItem
                    href="/write"
                    icon={PenLine}
                    label="Author Studio"
                    highlight
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/write/new"
                    icon={PlusCircle}
                    label="New Story"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/write/universes"
                    icon={Layers}
                    label="Story Universes"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/author/analytics"
                    icon={BarChart3}
                    label="Analytics"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/author/newsletter"
                    icon={Mail}
                    label="Subscribers"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/write/newsletter"
                    icon={Send}
                    label="Send Newsletter"
                    onClick={() => setProfileOpen(false)}
                  />
                  {(dbUser?.role === "AUTHOR" || dbUser?.role === "ADMIN") && (
                    <DropdownItem
                      href="/upload"
                      icon={Upload}
                      label="Upload Book"
                      onClick={() => setProfileOpen(false)}
                    />
                  )}
                  {dbUser?.role === "ADMIN" && (
                    <DropdownItem
                      href="/admin"
                      icon={Shield}
                      label="Admin Panel"
                      highlight
                      onClick={() => setProfileOpen(false)}
                    />
                  )}
                </div>
              </div>

              {/* Sign Out */}
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-900">
                <button
                  onClick={() => {
                    signOut();
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-4 px-4 py-3 rounded text-rose-500 hover:bg-rose-500/5 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded bg-rose-500/5 flex items-center justify-center group-hover:bg-rose-500/10 transition-colors">
                    <LogOut size={14} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation Dock */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1.5 px-2.5 py-2.5 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-zinc-100 dark:border-zinc-800 transition-all">

          {/* Left side items */}
          <div className="flex items-center gap-1 pr-3 border-r border-zinc-100 dark:border-zinc-800">
            {leftItems.map((item) => (
              <NavButton
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={isActive(item.href)}
                hasBadge={item.badge}
              />
            ))}
          </div>

          {/* Center Home Button */}
          <Link
            href="/"
            className="group relative flex items-center justify-center mx-1"
          >
            <div className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 border ${isActive("/")
              ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-lg"
              : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}>
              <Home className={`transition-all duration-300 ${isActive("/") ? "scale-110" : "group-hover:scale-110"}`} size={24} strokeWidth={isActive("/") ? 2.5 : 2} />
            </div>

            {/* Home Tooltip */}
            <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200 pointer-events-none ${isActive("/")
              ? "opacity-0 translate-y-1"
              : "opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
              }`}>
              <div className="absolute inset-0 bg-zinc-900 dark:bg-white rounded shadow-md" />
              <span className="relative text-white dark:text-zinc-900">Home</span>
            </div>
          </Link>

          {/* Right side items */}
          <div className="flex items-center gap-1 pl-3 border-l border-zinc-100 dark:border-zinc-800">
            {rightItems.map((item) => (
              <NavButton
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={isActive(item.href)}
              />
            ))}

            {/* Profile / Sign In */}
            {loading ? (
              <div className="w-11 h-11 rounded-full bg-zinc-50 dark:bg-zinc-900 animate-pulse ml-1" />
            ) : user ? (
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="relative group flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 hover:scale-105 ml-1"
              >
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${profileOpen ? "bg-zinc-100 dark:bg-zinc-800" : "bg-zinc-50 dark:bg-zinc-900 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800"
                  }`} />
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all duration-500">
                  {dbUser?.avatarUrl ? (
                    <img
                      src={dbUser.avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 font-bold text-[10px] uppercase">
                      {dbUser?.username?.[0]?.toUpperCase() || <User size={16} />}
                    </div>
                  )}
                </div>
                {dbUser?.role === "ADMIN" && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-zinc-900 dark:bg-white rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center">
                    <Crown size={7} className="text-white dark:text-zinc-900" />
                  </div>
                )}

                {/* Profile Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200 pointer-events-none opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0">
                  <div className="absolute inset-0 bg-zinc-900 dark:bg-white rounded shadow-md" />
                  <span className="relative text-white dark:text-zinc-900">Profile</span>
                </div>
              </button>
            ) : (
              <Link
                href="/login"
                className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-all duration-300 ml-1 border border-zinc-100 dark:border-zinc-800"
              >
                <User size={20} />

                {/* Sign In Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200 pointer-events-none opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0">
                  <div className="absolute inset-0 bg-zinc-900 dark:bg-white rounded shadow-md" />
                  <span className="relative text-white dark:text-zinc-900">Sign In</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </nav>

    </>
  );
}
