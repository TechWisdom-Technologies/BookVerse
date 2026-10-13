"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  BookOpen, 
  ArrowRight, 
  Clock, 
  FilePenLine 
} from "lucide-react";

export interface NewArrivalStory {
  id: string;
  title: string;
  coverUrl: string | null;
  summary: string | null;
  description?: string | null;
  genre?: string | null;
  tags?: string[];
  viewCount: number;
  createdAt: string;
  series?: { name: string } | null;
  universe?: { name: string } | null;
  sequenceNumber?: number | null;
  author: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  _count: {
    chapters: number;
    reactions: number;
    comments: number;
  };
  isTrendingPromo?: boolean;
  isPromotedPromo?: boolean;
  isFeaturedPromo?: boolean;
}

interface NewArrivalsSectionProps {
  stories: NewArrivalStory[];
}

function getRelativeTime(dateStr: string) {
  try {
    const now = new Date();
    const created = new Date(dateStr);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return diffMins <= 1 ? "Just now" : `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    if (diffDays < 7) {
      return diffDays === 1 ? "Yesterday" : `${diffDays}d ago`;
    }
    return created.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

export function NewArrivalsSection({ stories }: NewArrivalsSectionProps) {
  if (!stories || stories.length === 0) return null;

  // Exactly 8 items
  const displayStories = stories.slice(0, 8);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 space-y-8 sm:space-y-12">
        
        {/* Simple & Clean Header: Mobile First */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 pb-6 border-b border-zinc-200/60 dark:border-zinc-900">
          <div className="space-y-2.5 sm:space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-900 dark:bg-zinc-100"></span>
              </span>
              Fresh Off The Press
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white uppercase flex flex-wrap items-center gap-2.5 sm:gap-3">
              New Arrivals
              <span className="text-[10px] sm:text-xs font-semibold normal-case px-2 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800">
                8 Fresh Drops
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              Discover stories hot off the keyboard. Tap into newly published worlds and read early chapters.
            </p>
          </div>

          {/* Actions: Clean & Touch Friendly */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <Link 
              href="/write" 
              className="group flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              <FilePenLine className="w-3.5 h-3.5" />
              <span>Write a Story</span>
            </Link>

            <Link 
              href="/stories?sort=recent" 
              className="group flex items-center gap-2 px-3.5 sm:px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-sm text-[10px] font-bold uppercase tracking-widest border border-zinc-200/80 dark:border-zinc-800 transition-all shadow-sm active:scale-95 whitespace-nowrap"
            >
              <span>Browse All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 8 Premium Horizontal Editorial Cards: Mobile-First 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {displayStories.map((story, idx) => (
            <Link
              key={story.id}
              href={`/stories/${story.id}`}
              className="group block h-full"
            >
              <div className="relative h-full flex flex-row gap-3.5 sm:gap-5 p-3.5 sm:p-5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                
                {/* Top Black Accent Line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-zinc-900 dark:bg-zinc-100 rounded-t-sm" />

                {/* Book Cover on Left (3D Realistic Spine Crease) */}
                <div className="relative aspect-[2/3] w-24 xs:w-28 sm:w-32 lg:w-36 flex-shrink-0 rounded-sm overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-md border border-zinc-200/60 dark:border-zinc-700/80 group-hover:shadow-xl transition-all duration-500 self-start">
                  
                  {/* 3D Spine Crease Highlight */}
                  <div 
                    aria-hidden="true" 
                    className="absolute inset-y-0 left-0 w-2.5 sm:w-3 bg-gradient-to-r from-black/40 via-black/15 to-transparent z-10 pointer-events-none" 
                  />

                  {story.coverUrl ? (
                    <Image
                      src={story.coverUrl}
                      alt={story.title}
                      fill
                      sizes="(max-width: 640px) 112px, 144px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-2.5 bg-zinc-100 dark:bg-zinc-800 text-center">
                      <FilePenLine className="w-6 h-6 text-zinc-400 mb-1" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 line-clamp-2">
                        {story.title}
                      </span>
                    </div>
                  )}

                  {/* Drop Number Floating Tag */}
                  <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-20">
                    <span className="px-1.5 py-0.5 rounded-sm bg-black/75 backdrop-blur-sm text-white text-[8px] sm:text-[9px] font-mono font-bold shadow-sm">
                      #{String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Rich Editorial Content on Right */}
                <div className="flex-1 flex flex-col justify-between min-w-0 space-y-2 sm:space-y-3">
                  
                  {/* Meta Row: Time & Genre */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-mono flex-wrap">
                      <span className="flex items-center gap-1 text-zinc-400">
                        <Clock className="w-3 h-3" /> {getRelativeTime(story.createdAt)}
                      </span>
                      {story.genre && (
                        <>
                          <span className="text-zinc-300 dark:text-zinc-700">•</span>
                          <span className="px-1.5 py-0.2 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold uppercase tracking-wider text-[8px] sm:text-[9px]">
                            {story.genre}
                          </span>
                        </>
                      )}
                      {story.series && (
                        <>
                          <span className="text-zinc-300 dark:text-zinc-700">•</span>
                          <span className="text-zinc-400 truncate max-w-[90px] sm:max-w-[120px]">
                            {story.series.name}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Story Title */}
                    <h3 className="text-xs sm:text-base font-black tracking-tight text-zinc-900 dark:text-white line-clamp-2 leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors uppercase">
                      {story.title}
                    </h3>

                    {/* Synopsis / Summary */}
                    <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed italic">
                      &ldquo;{story.summary || story.description || "Newly arrived story hot off the press. Dive in to read the opening chapters."}&rdquo;
                    </p>
                  </div>

                  {/* Author & Footer Row */}
                  <div className="pt-2 sm:pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 text-xs">
                    
                    {/* Author */}
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      {story.author.avatarUrl ? (
                        <div className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={story.author.avatarUrl}
                            alt=""
                            fill
                            sizes="20px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-[8px] sm:text-[9px] font-bold text-zinc-600 dark:text-zinc-300 flex-shrink-0">
                          {story.author.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-[80px] xs:max-w-[120px]">
                        {story.author.displayName || story.author.username}
                      </span>
                    </div>

                    {/* Read metrics & CTA */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-mono text-zinc-400">
                        <BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {story._count.chapters} {story._count.chapters === 1 ? "ch" : "chs"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white group-hover:translate-x-0.5 transition-transform">
                        Read <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </span>
                    </div>

                  </div>

                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
