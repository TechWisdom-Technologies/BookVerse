"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Eye, FilePenLine, Heart, MessageSquare, TrendingUp, Sparkles, Award } from "lucide-react";

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
  isTrendingPromo?: boolean;
  isPromotedPromo?: boolean;
  isFeaturedPromo?: boolean;
  series?: { name: string } | null;
  universe?: { name: string } | null;
  sequenceNumber?: number | null;
}

interface StoryCardProps {
  story: StoryCardData;
  view?: "grid" | "list";
}

export function StoryCard({ story, view = "grid" }: StoryCardProps) {
  const isList = view === "list";
  return (
    <Link href={`/stories/${story.id}`}>
      <div className={`group flex cursor-pointer h-full ${isList ? 'flex-row items-stretch gap-4 p-3 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all' : 'flex-col'}`}>
        <div className={`relative overflow-hidden rounded-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 transition-all duration-500 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] ${isList ? 'w-24 shrink-0 aspect-[2/3]' : 'aspect-[2/3] mb-4 group-hover:-translate-y-1.5'}`}>
          {story.isFeaturedPromo && (
            <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest rounded-sm flex items-center gap-1 shadow shadow-amber-500/30">
              <Award className="w-2.5 h-2.5" /> Featured
            </div>
          )}
          {story.isTrendingPromo && !story.isFeaturedPromo && (
            <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest rounded-sm flex items-center gap-1 shadow shadow-rose-500/30">
              <TrendingUp className="w-2.5 h-2.5" /> Trending
            </div>
          )}
          {story.isPromotedPromo && !story.isFeaturedPromo && !story.isTrendingPromo && (
            <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-indigo-500 text-white text-[8px] font-black uppercase tracking-widest rounded-sm flex items-center gap-1 shadow shadow-indigo-500/30">
              <Sparkles className="w-2.5 h-2.5" /> Promoted
            </div>
          )}
          {story.coverUrl ? (
            <Image
              src={story.coverUrl}
              alt={story.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-900/30">
              <div className="px-4 text-center">
                <FilePenLine className="mx-auto h-8 w-8 text-indigo-200 dark:text-indigo-800" />
                <p className="mt-3 line-clamp-2 text-xs font-bold text-indigo-400 dark:text-indigo-600/50 uppercase tracking-widest">
                  {story.title}
                </p>
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        <div className={`flex flex-col flex-grow ${isList ? 'py-1 justify-between min-w-0' : ''}`}>
          <div className="mb-2">
            <h3 className="line-clamp-2 text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-brand transition-colors">
              {story.title}
            </h3>
          </div>
          
          {isList && story.summary && (
            <p className="line-clamp-2 text-[11px] text-zinc-500 mb-2">{story.summary}</p>
          )}

          <div className="mb-3">
          {story.series ? (
            <span className="px-1.5 py-0.5 rounded-sm bg-emerald-50 dark:bg-emerald-950/30 text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              {story.series.name} {story.sequenceNumber ? `• Vol ${story.sequenceNumber}` : ''}
            </span>
          ) : story.universe ? (
            <span className="px-1.5 py-0.5 rounded-sm bg-purple-50 dark:bg-purple-950/30 text-[9px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
              {story.universe.name} {story.sequenceNumber ? `• Vol ${story.sequenceNumber}` : ''}
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Standalone
            </span>
          )}
          </div>

          <div className="flex items-center gap-2 mt-auto mb-3">
            {story.author.avatarUrl ? (
              <Image
                src={story.author.avatarUrl}
                alt={story.author.displayName || story.author.username}
                width={18}
                height={18}
                className="rounded-full ring-1 ring-zinc-200 dark:ring-zinc-800"
              />
            ) : (
              <div className="h-[18px] w-[18px] rounded-full bg-zinc-200 dark:bg-zinc-700 ring-1 ring-zinc-200 dark:ring-zinc-800" />
            )}
            <p className="line-clamp-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
              {story.author.displayName || story.author.username}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/50 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
            <span className="flex items-center gap-1" title="Chapters">
              <BookOpen className="h-3 w-3" />
              {story._count.chapters}
            </span>
            <span className="flex items-center gap-1" title="Views">
              <Eye className="h-3 w-3" />
              {story.viewCount}
            </span>
            <span className="flex items-center gap-1" title="Likes">
              <Heart className="h-3 w-3" />
              {story._count.reactions}
            </span>
            <span className="flex items-center gap-1" title="Comments">
              <MessageSquare className="h-3 w-3" />
              {story._count.comments}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
