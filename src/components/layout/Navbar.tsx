"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  BookOpen,
  PenLine,
  Library,
  Search,
  LogOut,
  User,
  BookMarked,
  Upload,
  Shield,
  Home,
  Settings,
  Heart,
  Compass,
  Bookmark,
  Bell,
  Sparkles,
  Crown,
  Feather,
  MessageSquare,
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
  { href: "/clubs", label: "Clubs", icon: User },
];

// Right side nav items
const rightNavItems: NavItem[] = [
  { href: "/search", label: "Search", icon: Search },
  { href: "/activity-feed", label: "Community", icon: MessageSquare },
  { href: "/saved", label: "Saved", icon: Bookmark },
];

// Auth-specific items
const authLeftItems: NavItem[] = [
  { href: "/notifications", label: "Alerts", icon: Bell, badge: true },
];

const authRightItems: NavItem[] = [
  { href: "/shelf", label: "Shelf", icon: BookMarked },
  { href: "/write", label: "Create", icon: PenLine },
];

// Elegant Nav Button Component
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
      {/* Background glow on active */}
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${isActive
          ? "bg-brand/10 dark:bg-brand/20 scale-100"
          : "bg-transparent scale-90 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 group-hover:scale-100"
        }`} />

      {/* Icon */}
      <div className="relative">
        <Icon
          size={20}
          strokeWidth={isActive ? 2.5 : 2}
          className={`transition-all duration-300 relative z-10 ${isActive
              ? "text-brand scale-110 drop-shadow-sm"
              : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:scale-105"
            }`}
        />
        {/* Badge indicator */}
        {hasBadge && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full border border-white shadow-sm" />
        )}
      </div>

      {/* Elegant Tooltip */}
      <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 pointer-events-none ${isActive
          ? "opacity-0 translate-y-1"
          : "opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
        }`}>
        <div className="absolute inset-0 bg-zinc-800/90 backdrop-blur-sm rounded-full shadow-lg shadow-zinc-900/20" />
        <span className="relative text-white">{label}</span>
        {/* Tooltip arrow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800/90 rotate-45 rounded-sm" />
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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${highlight
          ? "bg-gradient-to-r from-brand/50 to-violet-50 text-brand/700 hover:from-brand/100 hover:to-orange-500"
          : "text-zinc-600 hover:bg-zinc-100"
        }`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${highlight
          ? "bg-gradient-to-br from-brand/400 to-violet-500 text-white"
          : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"
        }`}>
        <Icon size={16} />
      </div>
      <span className="text-sm font-medium">{label}</span>
      {highlight && <Sparkles size={14} className="ml-auto text-amber-500" />}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { user, dbUser, loading, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // Build dynamic nav arrays based on auth state
  const leftItems = user ? [...authLeftItems, ...leftNavItems] : leftNavItems;
  const rightItems = user ? [...rightNavItems, ...authRightItems] : rightNavItems;

  return (
    <>
      {/* Elegant Profile Dropdown */}
      {profileOpen && user && (
        <>
          <div
            className="fixed inset-0 z-40 bg-zinc-900/20 backdrop-blur-sm"
            onClick={() => setProfileOpen(false)}
          />
          <div className="fixed bottom-24 right-4 z-50 w-64 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-zinc-900/20 border border-white/50 ring-1 ring-zinc-900/5 p-3 animate-in slide-in-from-bottom-2 duration-200">
            {/* User Header */}
            <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-gradient-to-r from-brand/50 to-violet-50/50 rounded-2xl">
              <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-white shadow-lg">
                {dbUser?.avatarUrl ? (
                  <img
                    src={dbUser.avatarUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand/400 to-violet-500 flex items-center justify-center text-white font-semibold text-lg">
                    {dbUser?.username?.[0]?.toUpperCase() || <User size={24} />}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-900 truncate">{dbUser?.displayName || dbUser?.username}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-zinc-500 capitalize">{dbUser?.role?.toLowerCase()}</span>
                  {dbUser?.role === "ADMIN" && (
                    <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold rounded-full">
                      PRO
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-0.5">
              <DropdownItem
                href={`/profile/${dbUser?.username || ""}`}
                icon={User}
                label="My Profile"
                onClick={() => setProfileOpen(false)}
              />
              <DropdownItem
                href="/favorites"
                icon={Heart}
                label="Favorites"
                onClick={() => setProfileOpen(false)}
              />
              <DropdownItem
                href="/profile/edit"
                icon={Settings}
                label="Settings"
                onClick={() => setProfileOpen(false)}
              />

              {/* Role-specific items */}
              {dbUser?.role === "AUTHOR" && (
                <DropdownItem
                  href="/upload"
                  icon={Upload}
                  label="Upload Book"
                  highlight
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

            {/* Sign Out */}
            <div className="mt-2 pt-2 border-t border-zinc-100">
              <button
                onClick={() => {
                  signOut();
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                  <LogOut size={16} />
                </div>
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Elegant Bottom Navigation Dock */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1.5 px-2.5 py-2.5 bg-white/70 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 transition-all hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)]">

          {/* Left side items */}
          <div className="flex items-center gap-1 pr-3 border-r border-zinc-200/50 dark:border-zinc-700/50">
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

          {/* Center Home Button - Premium Design */}
          <Link
            href="/"
            className="group relative flex items-center justify-center mx-1"
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${isActive("/") ? "bg-brand/50 scale-125" : "bg-zinc-400/20 dark:bg-zinc-600/20 scale-100 group-hover:scale-110"
              }`} />

            {/* Button */}
            <div className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 border border-white/20 ${isActive("/")
                ? "bg-gradient-to-br from-brand via-orange-500 to-rose-500 text-white shadow-xl shadow-brand/40"
                : "bg-gradient-to-br from-zinc-100 via-white to-zinc-50 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-brand"
              }`}>
              <Home className={`transition-all duration-300 ${isActive("/") ? "scale-110 drop-shadow-md" : "group-hover:scale-110"}`} size={26} strokeWidth={isActive("/") ? 2.5 : 2} />
            </div>

            {/* Home Tooltip */}
            <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 pointer-events-none ${isActive("/")
                ? "opacity-0 translate-y-1"
                : "opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
              }`}>
              <div className="absolute inset-0 bg-brand/90 backdrop-blur-sm rounded-full shadow-lg shadow-brand/20" />
              <span className="relative text-white">Home</span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand/90 rotate-45 rounded-sm" />
            </div>
          </Link>

          {/* Right side items */}
          <div className="flex items-center gap-1 pl-3 border-l border-zinc-200/50 dark:border-zinc-700/50">
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
              <div className="w-11 h-11 rounded-full bg-zinc-200/60 dark:bg-zinc-700/60 animate-pulse ml-1" />
            ) : user ? (
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="relative group flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 hover:scale-105 ml-1"
              >
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${profileOpen ? "bg-brand/10" : "bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                  }`} />
                <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/50 dark:ring-white/10 shadow-sm">
                  {dbUser?.avatarUrl ? (
                    <img
                      src={dbUser.avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white font-semibold text-sm">
                      {dbUser?.username?.[0]?.toUpperCase() || <User size={16} />}
                    </div>
                  )}
                </div>
                {dbUser?.role === "ADMIN" && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                    <Crown size={8} className="text-white" />
                  </div>
                )}

                {/* Profile Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 pointer-events-none opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0">
                  <div className="absolute inset-0 bg-zinc-800/90 backdrop-blur-sm rounded-full shadow-lg shadow-zinc-900/20" />
                  <span className="relative text-white">Profile</span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800/90 rotate-45 rounded-sm" />
                </div>
              </button>
            ) : (
              <Link
                href="/login"
                className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-brand/10 hover:text-brand transition-all duration-300 ml-1"
              >
                <User size={20} />

                {/* Sign In Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 pointer-events-none opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0">
                  <div className="absolute inset-0 bg-zinc-800/90 backdrop-blur-sm rounded-full shadow-lg shadow-zinc-900/20" />
                  <span className="relative text-white">Sign In</span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-800/90 rotate-45 rounded-sm" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </nav>

    </>
  );
}
