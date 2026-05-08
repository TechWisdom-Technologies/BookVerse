"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Eye, FilePenLine, Heart, MessageSquare } from "lucide-react";

interface StoryAuthor {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

interface StoryCardData {
  id: string;
  title: string;
  coverUrl: string | null;
  summary: string | null;
  viewCount: number;
  createdAt: string;
  author: StoryAuthor;
  _count: {
    chapters: number;
    reactions: number;
    comments: number;
  };
}

interface StoryCardProps {
  story: StoryCardData;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Link href={`/stories/${story.id}`}>
      <div className="group cursor-pointer space-y-3 transition">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-200 shadow-md transition group-hover:shadow-lg dark:bg-zinc-800">
          {story.coverUrl ? (
            <Image
              src={story.coverUrl}
              alt={story.title}
              fill
              className="object-cover transition group-hover:scale-105"
              priority={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700">
              <div className="px-4 text-center">
                <FilePenLine className="mx-auto h-8 w-8 text-white/40" />
                <p className="mt-2 line-clamp-2 text-xs font-medium text-white/70">
                  {story.title}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {story.title}
          </h3>

          <div className="flex items-center gap-2">
            {story.author.avatarUrl ? (
              <Image
                src={story.author.avatarUrl}
                alt={story.author.displayName || story.author.username}
                width={16}
                height={16}
                className="rounded-full"
              />
            ) : (
              <div className="h-4 w-4 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            )}
            <p className="line-clamp-1 text-xs text-zinc-600 dark:text-zinc-400">
              {story.author.displayName || story.author.username}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {story._count.chapters}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {story.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {story._count.reactions}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {story._count.comments}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
