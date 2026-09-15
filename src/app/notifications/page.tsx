"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Bell,
  Check,
  Loader2,
  MessageSquare,
  Heart,
  FileText,
  Users,
  ArrowLeft,
  Clock,
  ShieldCheck,
  X,
  Filter,
  AlertTriangle,
  Star,
  ChevronDown,
  Calendar,
  Tag,
  Flag,
  MoreVertical,
  CircleDot,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  priority: string;
  createdAt: string;
}

// ── Filter types ──
type TypeFilter = "all" | "reactions" | "comments" | "stories" | "community" | "membership";
type PriorityFilter = "all" | "normal" | "important" | "urgent";
type DateFilter = "all" | "today" | "week" | "month";

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "reactions", label: "Reactions" },
  { value: "comments", label: "Comments" },
  { value: "stories", label: "Stories" },
  { value: "community", label: "Community" },
  { value: "membership", label: "Membership" },
];

const PRIORITY_OPTIONS: { value: PriorityFilter; label: string }[] = [
  { value: "all", label: "All Priority" },
  { value: "normal", label: "Normal" },
  { value: "important", label: "Important" },
  { value: "urgent", label: "Urgent" },
];

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

// ── Dropdown component ──
function FilterDropdown({
  label,
  icon: Icon,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded border transition-all ${
          value !== "all"
            ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white"
            : "bg-white dark:bg-zinc-950 text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
        }`}
      >
        <Icon className="w-3 h-3" />
        {selected?.label || label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 min-w-[180px] bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded shadow-xl z-50">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                value === opt.value
                  ? "text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-900"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Priority action menu ──
function PriorityMenu({
  notification,
  onSetPriority,
}: {
  notification: Notification;
  onSetPriority: (id: string, priority: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const priorityOptions = [
    { value: "normal", label: "Normal", icon: CircleDot, color: "text-zinc-400" },
    { value: "important", label: "Important", icon: Star, color: "text-amber-500" },
    { value: "urgent", label: "Urgent", icon: AlertTriangle, color: "text-rose-500" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(!open);
        }}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-zinc-600 dark:hover:text-zinc-300"
        aria-label="Set priority"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 min-w-[180px] bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded shadow-xl z-50">
          <div className="px-4 py-2 border-b border-zinc-50 dark:border-zinc-900">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300">Set Priority</span>
          </div>
          {priorityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSetPriority(notification.id, opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                notification.priority === opt.value
                  ? "text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-900"
                  : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
              }`}
            >
              <opt.icon className={`w-3.5 h-3.5 ${opt.color}`} />
              {opt.label}
              {notification.priority === opt.value && (
                <Check className="w-3 h-3 ml-auto text-zinc-900 dark:text-white" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Resolve fallback link based on notification type ──
function resolveFallbackLink(notification: Notification): string {
  if (notification.link) return notification.link;

  switch (notification.type) {
    case "REACT":
    case "COMMENT":
    case "REPLY":
    case "STORY_POST":
      return "/stories";
    case "DISCUSSION":
      return "/clubs";
    case "NEWSLETTER_SUBSCRIBE":
      return "/author/newsletter";
    case "MEMBERSHIP_UPGRADE":
    case "MEMBERSHIP_DECLINED":
      return "/premium";
    default:
      return "/notifications";
  }
}

// ── Main Page ──
export default function NotificationsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  useEffect(() => {
    if (!authLoading && user) {
      fetchNotifications();
    } else if (!authLoading && !user) {
      router.push('/login?redirect=/notifications');
    }
  }, [user, authLoading, typeFilter, priorityFilter, dateFilter, router]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (priorityFilter !== "all") params.set("priority", priorityFilter);
      if (dateFilter !== "all") params.set("dateRange", dateFilter);

      const res = await fetch(`/api/notifications?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);

        // Mark unread as read
        const unreadIds = data.notifications
          .filter((n: Notification) => !n.isRead)
          .map((n: Notification) => n.id);
        if (unreadIds.length > 0) {
          markAsRead(unreadIds);
        }
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (ids: string[]) => {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      setNotifications((prev) => prev.map((n) => (ids.includes(n.id) ? { ...n, isRead: true } : n)));
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  const handleSetPriority = async (id: string, priority: string) => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, priority } : n)));

    try {
      const res = await fetch("/api/notifications/priority", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, priority }),
      });
      if (!res.ok) {
        // Revert on failure
        fetchNotifications();
      }
    } catch {
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "REACT":
        return <Heart className="h-4 w-4 text-rose-500" />;
      case "COMMENT":
      case "REPLY":
        return <MessageSquare className="h-4 w-4 text-indigo-500" />;
      case "STORY_POST":
        return <FileText className="h-4 w-4 text-zinc-400" />;
      case "DISCUSSION":
      case "NEWSLETTER_SUBSCRIBE":
        return <Users className="h-4 w-4 text-emerald-500" />;
      case "MEMBERSHIP_UPGRADE":
        return <ShieldCheck className="h-4 w-4 text-purple-500" />;
      case "MEMBERSHIP_DECLINED":
        return <X className="h-4 w-4 text-rose-500" />;
      default:
        return <Bell className="h-4 w-4 text-zinc-400" />;
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-[3px] border-l-rose-500";
      case "important":
        return "border-l-[3px] border-l-amber-500";
      default:
        return "border-l-[3px] border-l-transparent";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 text-rose-500 border border-rose-100 dark:border-rose-500/20">
            <AlertTriangle className="w-2.5 h-2.5" />
            Urgent
          </span>
        );
      case "important":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
            <Star className="w-2.5 h-2.5" />
            Important
          </span>
        );
      default:
        return null;
    }
  };

  const activeFilterCount = [typeFilter !== "all", priorityFilter !== "all", dateFilter !== "all"].filter(Boolean).length;

  const resetFilters = () => {
    setTypeFilter("all");
    setPriorityFilter("all");
    setDateFilter("all");
  };

  // ── Auth/Loading states ──
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-200 dark:text-zinc-800" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded flex items-center justify-center mb-8">
          <Bell className="w-6 h-6 text-zinc-200" />
        </div>
        <h1 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2">Sign In Required</h1>
        <p className="text-xs text-zinc-400 max-w-xs mb-10 font-bold uppercase tracking-widest leading-relaxed">
          Please log in to see your notifications.
        </p>
        <Link
          href="/login"
          className="px-10 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all"
        >
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Notifications.</h1>
              <p className="text-sm text-zinc-500 font-medium">
                Stay updated with your latest activities, story reactions, and community updates.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {notifications.some((n) => !n.isRead) && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded hover:border-zinc-300 dark:hover:border-zinc-600 transition-all"
              >
                <Check className="w-3 h-3" />
                Mark All Read
              </button>
            )}
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded">
              <Clock className="w-3.5 h-3.5 text-zinc-300" />
              Active
            </div>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-300 mr-2">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </div>

          <FilterDropdown
            label="Type"
            icon={Tag}
            options={TYPE_OPTIONS}
            value={typeFilter}
            onChange={(v) => setTypeFilter(v as TypeFilter)}
          />
          <FilterDropdown
            label="Priority"
            icon={Flag}
            options={PRIORITY_OPTIONS}
            value={priorityFilter}
            onChange={(v) => setPriorityFilter(v as PriorityFilter)}
          />
          <FilterDropdown
            label="Date"
            icon={Calendar}
            options={DATE_OPTIONS}
            value={dateFilter}
            onChange={(v) => setDateFilter(v as DateFilter)}
          />

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
              Clear ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-40 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-200 dark:text-zinc-800" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-40 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
            {activeFilterCount > 0 ? (
              <div className="space-y-4">
                <Filter className="w-6 h-6 text-zinc-200 mx-auto" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">
                  No notifications match your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white underline transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">
                No notifications yet.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 rounded overflow-hidden">
            {notifications.map((notification) => {
              const href = resolveFallbackLink(notification);
              const isClickable = href !== "/notifications";

              const content = (
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                    {getIconForType(notification.type)}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">
                            {notification.title}
                          </h4>
                          {getPriorityBadge(notification.priority)}
                          {!notification.isRead && <div className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-white" />}
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">{notification.message}</p>
                      </div>

                      {/* Priority menu */}
                      <PriorityMenu notification={notification} onSetPriority={handleSetPriority} />
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 mt-4">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );

              return isClickable ? (
                <Link
                  key={notification.id}
                  href={href}
                  className={`block p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all group ${getPriorityIndicator(
                    notification.priority
                  )}`}
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={notification.id}
                  className={`p-8 bg-white dark:bg-zinc-950 transition-all ${getPriorityIndicator(notification.priority)}`}
                >
                  {content}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
