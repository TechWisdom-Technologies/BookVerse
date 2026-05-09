"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Bell, Check, Loader2, MessageSquare, Heart, FileText, Users } from "lucide-react";
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
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "REACT": return <Heart className="h-5 w-5 text-rose-500" />;
      case "COMMENT":
      case "REPLY": return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "STORY_POST": return <FileText className="h-5 w-5 text-brand" />;
      case "DISCUSSION": return <Users className="h-5 w-5 text-violet-500" />;
      default: return <Bell className="h-5 w-5 text-zinc-400" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
          <Bell className="h-10 w-10 text-zinc-400" />
        </div>
        <h1 className="mb-2 text-3xl font-black text-zinc-900 dark:text-white">Sign In to View Alerts</h1>
        <p className="mb-8 text-zinc-500 dark:text-zinc-400 max-w-md">
          You need an account to receive notifications about reactions, comments, and new stories.
        </p>
        <Link
          href="/login"
          className="rounded-full bg-brand px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-brand/20 transition-all hover:-translate-y-1 hover:bg-orange-600 hover:shadow-xl"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 pb-32 sm:px-6">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">
            Alerts
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
            Stay updated with your community
          </p>
        </div>
      </header>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-zinc-200/50 bg-white/50 p-12 text-center backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/50">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <Check className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">All Caught Up!</h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
            You don't have any new notifications right now. Check back later for updates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const content = (
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                  {getIconForType(notification.type)}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-300 text-sm mb-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </span>
                </div>
                {!notification.isRead && (
                  <div className="h-3 w-3 shrink-0 rounded-full bg-brand mt-4 shadow-sm shadow-brand/40" />
                )}
              </div>
            );

            return notification.link ? (
              <Link
                key={notification.id}
                href={notification.link}
                className={`block rounded-[2rem] border p-5 sm:p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/20 dark:hover:shadow-none ${
                  notification.isRead 
                    ? "border-zinc-200/50 bg-white/80 dark:border-zinc-800/50 dark:bg-zinc-900/50" 
                    : "border-brand/20 bg-brand/5 dark:border-brand/10 dark:bg-brand/5"
                }`}
              >
                {content}
              </Link>
            ) : (
              <div
                key={notification.id}
                className={`rounded-[2rem] border p-5 sm:p-6 transition-all ${
                  notification.isRead 
                    ? "border-zinc-200/50 bg-white/80 dark:border-zinc-800/50 dark:bg-zinc-900/50" 
                    : "border-brand/20 bg-brand/5 dark:border-brand/10 dark:bg-brand/5"
                }`}
              >
                {content}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
