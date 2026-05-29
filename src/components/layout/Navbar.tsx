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
  Menu,
  X,
  Sparkles,
  Star,
  Wallet,
  WifiOff,
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
  { href: "/series", label: "Series", icon: Layers },
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
  badge?: string;
  onClick: () => void;
}

function DropdownItem({ href, icon: Icon, label, highlight, badge, onClick }: DropdownItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-4.5 px-4 py-2.5 rounded-xl transition-all duration-300 group border border-transparent ${highlight
        ? "bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border-indigo-500/5 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20"
        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
        }`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${highlight
        ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/15"
        : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800"
        }`}>
        <Icon size={12} />
      </div>
      <span className="text-[9px] font-bold uppercase tracking-[0.15em] transition-transform duration-300 group-hover:translate-x-1">{label}</span>
      {badge && (
        <span className={`ml-auto px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest rounded shadow-sm transition-all duration-300 group-hover:scale-105 ${
          badge === "PRO"
            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            : badge === "ADMIN"
            ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950"
            : "bg-indigo-550 text-white"
        }`}>
          {badge}
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { user, dbUser, loading, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLibrarianOpen, setIsLibrarianOpen] = useState(false);

  useEffect(() => {
    const handleState = (e: Event) => {
      setIsLibrarianOpen((e as CustomEvent).detail);
    };
    window.addEventListener("ai-librarian-state", handleState);
    return () => window.removeEventListener("ai-librarian-state", handleState);
  }, []);

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

  const isPro = !!(
    dbUser?.membershipTier &&
    (!dbUser.membershipExpiry || new Date(dbUser.membershipExpiry).getTime() > Date.now())
  );

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
      {/* Mobile Navigation Dock (mobile-only) */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[400px]" aria-label="Mobile navigation">
        <div className="flex items-center justify-around px-3 py-2 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-zinc-100 dark:border-zinc-800/80 transition-all">
          
          {user ? (
            <>
              {/* Library */}
              <NavButton
                href="/library"
                icon={Library}
                label="Library"
                isActive={isActive("/library")}
              />

              {/* Notifications */}
              <NavButton
                href="/notifications"
                icon={Bell}
                label="Notifications"
                isActive={isActive("/notifications")}
                hasBadge={unreadCount > 0}
              />

              {/* Home centerpiece */}
              <Link
                href="/"
                className="group relative flex items-center justify-center mx-1"
              >
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 border ${isActive("/")
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-md"
                  : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                  }`}>
                  <Home className={`transition-all duration-300 ${isActive("/") ? "scale-110" : "group-hover:scale-110"}`} size={20} strokeWidth={isActive("/") ? 2.5 : 2} />
                </div>
              </Link>

              {/* Write */}
              <NavButton
                href="/write"
                icon={PenLine}
                label="Write"
                isActive={isActive("/write")}
              />

              {/* AI Librarian Toggle Button */}
              <button
                onClick={() => window.dispatchEvent(new Event("toggle-ai-librarian"))}
                className="relative group flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 hover:scale-105"
                aria-label="Toggle AI Librarian"
              >
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${isLibrarianOpen ? "bg-zinc-100 dark:bg-zinc-800" : "bg-zinc-50 dark:bg-zinc-900 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800"}`} />
                <Sparkles size={20} className={`relative z-10 transition-all duration-300 ${isLibrarianOpen ? "text-zinc-900 dark:text-white scale-110" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white"}`} />
              </button>

              {/* Profile Avatar Trigger */}
              {loading ? (
                <div className="w-11 h-11 rounded-full bg-zinc-50 dark:bg-zinc-900 animate-pulse animate-in fade-in" />
              ) : (
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="relative group flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 hover:scale-105"
                  aria-label="Open profile menu"
                >
                  <div className={`absolute inset-0 rounded-full transition-all duration-300 ${profileOpen ? "bg-zinc-100 dark:bg-zinc-800" : "bg-zinc-50 dark:bg-zinc-900 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800"
                    }`} />
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all duration-500">
                    {dbUser?.avatarUrl ? (
                      <img
                        src={dbUser.avatarUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 font-bold text-[9px] uppercase">
                        {dbUser?.username?.[0]?.toUpperCase() || <User size={14} />}
                      </div>
                    )}
                  </div>
                  {dbUser?.role === "ADMIN" ? (
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-zinc-900 dark:bg-white rounded-full border border-white dark:border-zinc-950 flex items-center justify-center">
                      <Crown size={6} className="text-white dark:text-zinc-900" />
                    </div>
                  ) : isPro ? (
                    <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 rounded-full border border-white dark:border-zinc-950 flex items-center justify-center shadow-sm">
                      <Star size={6} className="text-white fill-white" />
                    </div>
                  ) : null}
                </button>
              )}
            </>
          ) : (
            <>
              {/* Library */}
              <NavButton
                href="/library"
                icon={Library}
                label="Library"
                isActive={isActive("/library")}
              />

              {/* Search */}
              <NavButton
                href="/search"
                icon={Search}
                label="Search"
                isActive={isActive("/search")}
              />

              {/* Home centerpiece */}
              <Link
                href="/"
                className="group relative flex items-center justify-center mx-1"
              >
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 border ${isActive("/")
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-md"
                  : "bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                  }`}>
                  <Home className={`transition-all duration-300 ${isActive("/") ? "scale-110" : "group-hover:scale-110"}`} size={20} strokeWidth={isActive("/") ? 2.5 : 2} />
                </div>
              </Link>

              {/* Support */}
              <NavButton
                href="/support"
                icon={HelpCircle}
                label="Support"
                isActive={isActive("/support")}
              />

              {/* AI Librarian Toggle Button */}
              <button
                onClick={() => window.dispatchEvent(new Event("toggle-ai-librarian"))}
                className="relative group flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 hover:scale-105"
                aria-label="Toggle AI Librarian"
              >
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${isLibrarianOpen ? "bg-zinc-100 dark:bg-zinc-800" : "bg-zinc-50 dark:bg-zinc-900 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800"}`} />
                <Sparkles size={20} className={`relative z-10 transition-all duration-300 ${isLibrarianOpen ? "text-zinc-900 dark:text-white scale-110" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white"}`} />
              </button>

              {/* Mobile Sidebar Menu Trigger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="relative group flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 hover:scale-105"
                aria-label="Open navigation menu"
              >
                <div className="absolute inset-0 rounded-full bg-zinc-50 dark:bg-zinc-900 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-all duration-300" />
                <Menu size={20} className="relative z-10 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white" />
              </button>
            </>
          )}

        </div>
      </nav>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-60 bg-zinc-950/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-3 left-3 bottom-3 z-70 w-[min(88vw,20rem)] sm:w-80 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-3xl shadow-2xl p-4 animate-in slide-in-from-left duration-300 ease-out">
            <div className="flex items-center justify-between mb-4">
              <Link href="/" onClick={() => setMobileOpen(false)} className="font-bold uppercase tracking-widest">Home</Link>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2">
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-2 overflow-y-auto h-[calc(100%-64px)] pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-200 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-800/80 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700/80">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2">Main</h3>
                {leftItems.map((item) => (
                  <DropdownItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
              </div>

              <div className="mt-3">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2">Explore</h3>
                {rightItems.map((item) => (
                  <DropdownItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
              </div>

              <div className="mt-3">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2">Account</h3>
                {loading ? (
                  <div className="h-10 w-full bg-zinc-50 dark:bg-zinc-900 animate-pulse rounded" />
                ) : user ? (
                  <>
                    <DropdownItem href={`/profile/${dbUser?.username || ""}`} icon={User} label="My Profile" onClick={() => setMobileOpen(false)} />
                    <DropdownItem href="/settings" icon={Settings} label="Settings" onClick={() => setMobileOpen(false)} />
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white">
                    <div className="w-8 h-8 rounded flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-zinc-300">
                      <User size={14} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Sign In</span>
                  </Link>
                )}
              </div>
            </nav>
          </aside>
        </>
      )}
      {/* Profile Sidebar */}
      {profileOpen && user && (
        <>
          <div
            className="fixed inset-0 z-60 bg-zinc-950/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setProfileOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 z-70 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-l border-zinc-100 dark:border-zinc-900 shadow-2xl animate-in slide-in-from-right duration-300 ease-out">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center gap-4 relative z-10 pr-12">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md flex-shrink-0">
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
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-sm text-zinc-900 dark:text-white truncate uppercase tracking-tight leading-snug">
                      {dbUser?.displayName || dbUser?.username}
                    </p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate mt-0.5">
                      @{dbUser?.username}
                    </p>
                    {dbUser?.role === "ADMIN" && (
                      <div className="mt-1.5 flex">
                        <span className="px-2 py-0.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[8px] font-black uppercase tracking-widest rounded-lg">
                          Admin
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sign Out Button - placed absolutely on top right of the header card to avoid collision */}
                <button
                  onClick={() => {
                    signOut();
                    setProfileOpen(false);
                  }}
                  className="absolute top-6 right-6 z-20 p-2.5 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/20 dark:border-rose-500/30 text-rose-500 dark:text-rose-450 hover:bg-rose-500 dark:hover:bg-rose-500 hover:text-white dark:hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut size={16} />
                </button>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-6 relative z-10">
                  <div className="text-center p-3 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/40 shadow-sm hover:scale-105 transition-all duration-300">
                    <div className="font-black text-sm text-zinc-900 dark:text-white">{dbUser?._count?.stories ?? 0}</div>
                    <div className="text-[8px] uppercase tracking-widest text-zinc-450 font-bold">Stories</div>
                  </div>
                  <div className="text-center p-3 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/40 shadow-sm hover:scale-105 transition-all duration-300">
                    <div className="font-black text-sm text-zinc-900 dark:text-white">{dbUser?._count?.followers ?? 0}</div>
                    <div className="text-[8px] uppercase tracking-widest text-zinc-450 font-bold">Followers</div>
                  </div>
                  <div className="text-center p-3 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/40 shadow-sm hover:scale-105 transition-all duration-300">
                    <div className="font-black text-sm text-zinc-900 dark:text-white">{dbUser?._count?.following ?? 0}</div>
                    <div className="text-[8px] uppercase tracking-widest text-zinc-450 font-bold">Following</div>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-200 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-800/80 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700/80">
                {/* Mobile-only Explore Section */}
                <div className="md:hidden border-b border-zinc-100 dark:border-zinc-900 pb-6">
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 px-4 italic">Explore</h3>
                  <DropdownItem
                    href="/stories"
                    icon={Feather}
                    label="Stories"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/universes"
                    icon={Globe}
                    label="Universes"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/series"
                    icon={Layers}
                    label="Series"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/clubs"
                    icon={User}
                    label="Clubs"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/search"
                    icon={Search}
                    label="Search"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/activity-feed"
                    icon={MessageSquare}
                    label="Feed"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/support"
                    icon={HelpCircle}
                    label="Support"
                    onClick={() => setProfileOpen(false)}
                  />
                </div>

                {/* Account Core */}
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 px-4 italic">Registry</h3>
                  <DropdownItem
                    href={`/profile/${dbUser?.username || ""}`}
                    icon={User}
                    label="My Profile"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/write/dashboard"
                    icon={Sparkles}
                    label="Author Dashboard"
                    highlight
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/author/analytics"
                    icon={BarChart3}
                    label="Analytics"
                    badge="PRO"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/shelf"
                    icon={BookMarked}
                    label="My Library"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/offline-stories"
                    icon={WifiOff}
                    label="Offline Stories"
                    onClick={() => setProfileOpen(false)}
                  />
                </div>

                {/* Author Studio Menus */}
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 px-4 italic">Author</h3>
                  <DropdownItem
                    href="/wallet"
                    icon={Wallet}
                    label="Wallet"
                    badge="PRO"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/write"
                    icon={PenLine}
                    label="Author Studio"
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
                    icon={Globe}
                    label="Story Universes"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/write/series"
                    icon={Layers}
                    label="Story Series"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/author/newsletter"
                    icon={Mail}
                    label="Newsletter & Fans"
                    badge="PRO"
                    highlight
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
                </div>

                {/* Activity & Support */}
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2 px-4 italic">Activity & More</h3>
                  <DropdownItem
                    href="/reading-challenges"
                    icon={Trophy}
                    label="Challenges"
                    badge="PRO"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/settings"
                    icon={Settings}
                    label="Settings"
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/premium"
                    icon={Premium}
                    label="Premium"
                    badge="PRO"
                    highlight
                    onClick={() => setProfileOpen(false)}
                  />
                  <DropdownItem
                    href="/gifts"
                    icon={Gift}
                    label="Gifts"
                    badge="PRO"
                    onClick={() => setProfileOpen(false)}
                  />
                  {dbUser?.role === "ADMIN" && (
                    <DropdownItem
                      href="/admin"
                      icon={Shield}
                      label="Admin Panel"
                      badge="ADMIN"
                      highlight
                      onClick={() => setProfileOpen(false)}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation Dock (desktop/tablet) */}
      <nav className="hidden md:flex fixed bottom-8 left-1/2 -translate-x-1/2 z-40" aria-label="Bottom navigation">
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

            {/* AI Librarian Toggle Button */}
            <button
              onClick={() => window.dispatchEvent(new Event("toggle-ai-librarian"))}
              className="group relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300"
              aria-label="Toggle AI Librarian"
            >
              <div className={`absolute inset-0 rounded-full transition-all duration-300 ${isLibrarianOpen
                ? "bg-zinc-900/10 dark:bg-white/10 scale-100"
                : "bg-transparent scale-90 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 group-hover:scale-100"
                }`} />
              <Sparkles
                size={20}
                className={`transition-all duration-300 relative z-10 ${isLibrarianOpen
                  ? "text-zinc-900 dark:text-white scale-110"
                  : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:scale-105"
                  }`}
              />
              {/* Tooltip */}
              <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200 pointer-events-none ${isLibrarianOpen
                ? "opacity-0 translate-y-1"
                : "opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
                }`}>
                <div className="absolute inset-0 bg-zinc-900 dark:bg-white rounded shadow-md" />
                <span className="relative text-white dark:text-zinc-900">AI Librarian</span>
              </div>
            </button>

            {/* Settings shortcut button */}
            {user && (
              <NavButton
                href="/settings"
                icon={Settings}
                label="Settings"
                isActive={isActive("/settings")}
              />
            )}

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
                {dbUser?.role === "ADMIN" ? (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-zinc-900 dark:bg-white rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center">
                    <Crown size={7} className="text-white dark:text-zinc-900" />
                  </div>
                ) : isPro ? (
                  <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center shadow-sm">
                    <Star size={7} className="text-white fill-white" />
                  </div>
                ) : null}

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
