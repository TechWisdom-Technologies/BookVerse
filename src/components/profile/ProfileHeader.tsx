import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { FollowButton } from "./FollowButton";
import { NewsletterSubscribeButton } from "./NewsletterSubscribeButton";
import { Calendar, BookOpen, Users } from "lucide-react";

interface ProfileHeaderProps {
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    bio: string | null;
    role: string;
    createdAt: Date | string;
    _count: {
      followers: number;
      following: number;
    };
    isFollowing: boolean;
    isSubscribed?: boolean;
    isOwnProfile: boolean;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const displayName = user.displayName || user.username;

  return (
    <div className="relative">
      {/* Abstract Cover Banner */}
      <div className="h-48 md:h-64 w-full rounded-[2rem] bg-gradient-to-r from-brand via-violet-500 to-rose-500 opacity-20 overflow-hidden relative shadow-inner">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30" />
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-10 -mt-20 sm:-mt-24 px-6 sm:px-12 relative z-10">
        {/* Avatar */}
        <div className="relative shrink-0">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={displayName}
              width={160}
              height={160}
              className="rounded-full object-cover border-8 border-[#FDFDFC] dark:border-[#0A0A0A] shadow-2xl bg-white dark:bg-zinc-900 h-32 w-32 sm:h-40 sm:w-40"
            />
          ) : (
            <div className="flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-full border-8 border-[#FDFDFC] dark:border-[#0A0A0A] bg-gradient-to-br from-indigo-400 to-purple-500 text-6xl font-bold text-white shadow-2xl">
              {displayName[0]?.toUpperCase()}
            </div>
          )}
          {user.role === "AUTHOR" && (
            <div className="absolute bottom-2 right-2 bg-brand text-white p-2.5 rounded-full shadow-lg border-4 border-[#FDFDFC] dark:border-[#0A0A0A]" title="Author">
              <BookOpen className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left mb-2 sm:mb-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-1">
                {displayName}
              </h1>
              <p className="text-xl font-medium text-zinc-500 dark:text-zinc-400 mb-4">@{user.username}</p>
              {user.bio && (
                <p className="text-zinc-700 dark:text-zinc-300 max-w-2xl text-lg leading-relaxed">{user.bio}</p>
              )}
            </div>

            {/* Actions */}
            <div className="shrink-0 flex items-center justify-center gap-3">
              {user.isOwnProfile ? (
                <Link
                  href="/profile/edit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 dark:bg-white px-8 py-3.5 text-base font-bold text-white dark:text-zinc-900 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                >
                  Edit Profile
                </Link>
              ) : (
                <>
                  <FollowButton targetUserId={user.id} isFollowing={user.isFollowing} />
                  {user.role === "AUTHOR" && (
                    <NewsletterSubscribeButton 
                      authorId={user.id} 
                      initialIsSubscribed={!!user.isSubscribed} 
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 flex flex-wrap justify-center sm:justify-start items-center gap-x-8 gap-y-4">
            <Link
              href={`/profile/${user.username}?tab=followers`}
              className="flex items-center gap-3 group"
            >
              <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
                <Users className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
              </div>
              <div className="text-left">
                <div className="font-black text-2xl text-zinc-900 dark:text-white leading-none mb-0.5">
                  {user._count.followers}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Followers
                </div>
              </div>
            </Link>

            <div className="w-px h-12 bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

            <Link
              href={`/profile/${user.username}?tab=following`}
              className="flex items-center gap-3 group"
            >
              <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
                <Users className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
              </div>
              <div className="text-left">
                <div className="font-black text-2xl text-zinc-900 dark:text-white leading-none mb-0.5">
                  {user._count.following}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Following
                </div>
              </div>
            </Link>

            <div className="w-px h-12 bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                <Calendar className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
              </div>
              <div className="text-left">
                <div className="font-black text-2xl text-zinc-900 dark:text-white leading-none mb-0.5">
                  Joined
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  {formatDate(user.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
