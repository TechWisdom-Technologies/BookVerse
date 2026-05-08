import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { FollowButton } from "./FollowButton";
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
    isOwnProfile: boolean;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const displayName = user.displayName || user.username;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={displayName}
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-4xl font-bold text-white">
              {displayName[0]?.toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {displayName}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">@{user.username}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {user.isOwnProfile ? (
                <Link
                  href="/profile/edit"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Edit Profile
                </Link>
              ) : (
                <FollowButton targetUserId={user.id} isFollowing={user.isFollowing} />
              )}
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{user.bio}</p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <Link
              href={`/profile/${user.username}?tab=followers`}
              className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              <Users className="h-4 w-4" />
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                {user._count.followers}
              </span>{" "}
              followers
            </Link>
            <Link
              href={`/profile/${user.username}?tab=following`}
              className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                {user._count.following}
              </span>{" "}
              following
            </Link>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined {formatDate(user.createdAt)}
            </span>
            {user.role === "AUTHOR" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                <BookOpen className="h-3 w-3" />
                Author
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
