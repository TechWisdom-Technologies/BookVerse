"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Bell, Check, Loader2, MessageSquare, Heart, FileText, Users, ArrowLeft, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchNotifications();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        markAllAsRead(data.notifications.filter((n: Notification) => !n.isRead).map((n: Notification) => n.id));
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async (ids: string[]) => {
    if (ids.length === 0) return;
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "REACT": return <Heart className="h-4 w-4 text-rose-500" />;
      case "COMMENT":
      case "REPLY": return <MessageSquare className="h-4 w-4 text-indigo-500" />;
      case "STORY_POST": return <FileText className="h-4 w-4 text-zinc-400" />;
      case "DISCUSSION": return <Users className="h-4 w-4 text-zinc-400" />;
      default: return <Bell className="h-4 w-4 text-zinc-400" />;
    }
  };

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-6 h-6 animate-spin text-zinc-200 dark:text-zinc-800" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded flex items-center justify-center mb-8">
        <Bell className="w-6 h-6 text-zinc-200" />
      </div>
      <h1 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-2">Sign In Required</h1>
      <p className="text-xs text-zinc-400 max-w-xs mb-10 font-bold uppercase tracking-widest leading-relaxed">Please log in to see your notifications.</p>
      <Link href="/login" className="px-10 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all">
        Login Now
      </Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Simple Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Notifications.</h1>
              <p className="text-sm text-zinc-500 font-medium">Stay updated with your latest activities, story reactions, and community updates.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded">
            <Clock className="w-3.5 h-3.5 text-zinc-300" />
            Active
          </div>
        </header>

        {notifications.length === 0 ? (
          <div className="py-40 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
            {notifications.map((notification) => {
              const content = (
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                    {getIconForType(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-1 uppercase">
                          {notification.title}
                        </h4>
                        <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-white mt-2" />
                      )}
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 mt-4">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );

              return notification.link ? (
                <Link
                  key={notification.id}
                  href={notification.link}
                  className="block p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all group"
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={notification.id}
                  className="p-8 bg-white dark:bg-zinc-950 transition-all"
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
