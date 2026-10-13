"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Layers, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  FilePenLine, 
  Flame, 
  CheckCircle2, 
  ExternalLink,
  Library,
  ListOrdered
} from "lucide-react";

export interface SeriesStoryItem {
  id: string;
  title: string;
  coverUrl: string | null;
  viewCount: number;
  sequenceNumber?: number | null;
  _count?: {
    chapters: number;
  };
}

export interface SeriesItem {
  id: string;
  name: string;
  description: string | null;
  coverUrl: string | null;
  genre: string | null;
  sequenceType: string; // SEQUENTIAL | ANTHOLOGY
  status: string; // ONGOING | COMPLETED | HIATUS
  createdAt?: string | Date;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  stories: SeriesStoryItem[];
  _count: {
    stories: number;
  };
}

interface FeaturedSeriesSectionProps {
  seriesList: SeriesItem[];
}

const getSeriesGraphic = (name: string) => {
  const gradients = [
    "from-zinc-900 via-neutral-800 to-zinc-950",
    "from-neutral-900 via-zinc-800 to-black",
    "from-stone-900 via-zinc-800 to-zinc-950",
    "from-zinc-900 via-slate-800 to-neutral-950"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

export function FeaturedSeriesSection({ seriesList }: FeaturedSeriesSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  if (!seriesList || seriesList.length === 0) return null;

  const activeSeries = seriesList[selectedIndex] || seriesList[0];
  const totalReads = activeSeries.stories?.reduce((acc, s) => acc + (s.viewCount || 0), 0) || 0;
  const firstStory = activeSeries.stories?.[0];

  // Auto-advance spotlight every 9s if not paused
  useEffect(() => {
    if (!autoplay || seriesList.length <= 1) return;
    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % seriesList.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [autoplay, seriesList.length]);

  const handleSelect = (idx: number) => {
    setAutoplay(false);
    setSelectedIndex(idx);
  };

  const handlePrev = () => {
    setAutoplay(false);
    setSelectedIndex((prev) => (prev === 0 ? seriesList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setAutoplay(false);
    setSelectedIndex((prev) => (prev + 1) % seriesList.length);
  };

  return (
    <section 
      className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 relative overflow-hidden"
      onMouseEnter={() => setAutoplay(false)}
    >
      <div className="max-w-7xl mx-auto relative z-10 space-y-10 sm:space-y-16">
        
        {/* Header: Mobile First & Architectural */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-8 pb-6 sm:pb-8 border-b border-zinc-200/60 dark:border-zinc-900">
          <div className="space-y-2.5 sm:space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 shadow-sm">
              <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-700 dark:text-zinc-300" />
              Serialized Sagas • Multi-Part Epics
            </div>
            
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white uppercase flex flex-wrap items-center gap-2.5 sm:gap-4 break-words">
              Featured Series
              <span className="text-[10px] sm:text-xs font-semibold normal-case px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800">
                {seriesList.length} Complete & Ongoing Sagas
              </span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              Binge continuous storylines, sequential volumes, and expansive multi-book sagas. Follow recurring protagonists from Volume 1 through the climactic conclusion.
            </p>
          </div>

          {/* Navigation Controls, Create Series & Browse All */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Step Controls: Hidden on mobile */}
            <div className="hidden md:flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-sm border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
              <button
                type="button"
                onClick={handlePrev}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-sm bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95"
                aria-label="Previous series"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2.5 sm:px-3 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
                {String(selectedIndex + 1).padStart(2, "0")} / {String(seriesList.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-sm bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95"
                aria-label="Next series"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Create Series Button */}
            <Link 
              href="/write/series" 
              className="group flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              <FilePenLine className="w-3.5 h-3.5" />
              <span>Create a Series</span>
            </Link>

            {/* Browse All Link */}
            <Link 
              href="/series" 
              className="group flex items-center gap-2 px-3.5 sm:px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-sm text-[10px] font-bold uppercase tracking-widest border border-zinc-200/80 dark:border-zinc-800 transition-all shadow-sm active:scale-95 whitespace-nowrap"
            >
              <span>All Series</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Cinematic Series Stage: Hidden on mobile (< md), visible on desktop */}
        <div className="hidden md:block relative overflow-hidden rounded-sm bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/70 dark:border-zinc-800/80 shadow-md p-4 sm:p-8 lg:p-14">
          {/* Top Solid Black Line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-zinc-900 dark:bg-zinc-100" />

          <motion.div
            key={activeSeries.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-start"
          >
            
            {/* Left Column: Series Boxset Artwork & Stacking Spine (5 Columns) */}
            <div className="lg:col-span-5 space-y-4">
              <Link href={`/series/${activeSeries.id}`} className="block relative group/portal">
                <div className="relative aspect-[16/11] sm:aspect-[4/3] lg:aspect-[5/4] w-full rounded-sm overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-700 shadow-2xl transition-all duration-500 group-hover/portal:shadow-2xl">
                  
                  {activeSeries.coverUrl ? (
                    <Image
                      src={activeSeries.coverUrl}
                      alt={activeSeries.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 500px"
                      className="object-cover transition-transform duration-700 group-hover/portal:scale-105 opacity-90 group-hover/portal:opacity-100"
                      priority
                    />
                  ) : firstStory?.coverUrl ? (
                    <Image
                      src={firstStory.coverUrl}
                      alt={activeSeries.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 500px"
                      className="object-cover transition-transform duration-700 group-hover/portal:scale-105 opacity-90 group-hover/portal:opacity-100"
                      priority
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getSeriesGraphic(activeSeries.name)} flex flex-col items-center justify-center p-6 sm:p-8 text-center relative overflow-hidden`}>
                      {/* Geometric Shelf / Layer Lines */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
                      <div className="absolute -inset-10 border border-white/5 rounded-full pointer-events-none" />
                      
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-sm bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 sm:mb-4 relative z-10 shadow-lg group-hover/portal:scale-110 transition-transform">
                        <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow" />
                      </div>
                      
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/70 relative z-10">
                        {activeSeries.sequenceType || "SEQUENTIAL SAGA"}
                      </span>
                      <h4 className="text-base sm:text-xl font-black uppercase tracking-tight text-white mt-1 relative z-10 line-clamp-2 px-3 sm:px-4">
                        {activeSeries.name}
                      </h4>
                    </div>
                  )}

                  {/* Left Spine Crease */}
                  <div 
                    aria-hidden="true" 
                    className="absolute inset-y-0 left-0 w-3 sm:w-4 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-10 pointer-events-none" 
                  />

                  {/* Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 pointer-events-none" />

                  {/* Floating Top Badge: Status & Sequence Type */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-sm bg-black/60 backdrop-blur-md border border-white/15 text-white shadow-lg text-[9px] sm:text-[10px] font-mono uppercase tracking-wider font-bold">
                      {activeSeries.status === "COMPLETED" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-zinc-300" />
                          <span>Complete Saga</span>
                        </>
                      ) : (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          <span>Ongoing Saga</span>
                        </>
                      )}
                    </span>

                    <span className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-sm bg-white/10 backdrop-blur-md border border-white/15 text-white text-[9px] sm:text-[10px] font-mono uppercase tracking-wider">
                      {activeSeries.sequenceType || "Sequential"}
                    </span>
                  </div>

                  {/* Bottom Stats & Hover Action */}
                  <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 z-20 flex flex-col xs:flex-row items-start xs:items-end justify-between gap-2.5 xs:gap-4">
                    <div className="space-y-0.5 sm:space-y-1">
                      <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-zinc-300 flex items-center gap-2 sm:gap-3">
                        <span className="flex items-center gap-1 font-bold">
                          <BookOpen className="w-3 h-3 text-zinc-400" />
                          {activeSeries._count.stories} {activeSeries._count.stories === 1 ? "Vol" : "Vols"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-bold">
                          <Flame className="w-3 h-3 text-amber-400" />
                          {totalReads} Reads
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-sm border border-white/30 group-hover/portal:bg-white group-hover/portal:text-zinc-900 transition-colors">
                      View Saga <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/portal:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Column: Saga Lore, Author & Ordered Volumes (7 Columns) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 lg:space-y-8">
              
              {/* Meta Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm">
                  Saga #{String(selectedIndex + 1).padStart(2, "0")}
                </span>

                {activeSeries.genre && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                    {activeSeries.genre}
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                  <ListOrdered className="w-3 h-3 text-zinc-400" /> {activeSeries._count.stories} Volumes
                </span>
              </div>

              {/* Massive Series Title */}
              <Link href={`/series/${activeSeries.id}`} className="block group/title">
                <h3 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.15] group-hover/title:text-zinc-600 dark:group-hover/title:text-zinc-300 transition-colors uppercase break-words">
                  {activeSeries.name}
                </h3>
              </Link>

              {/* Author Row */}
              <div className="flex items-center gap-2.5 sm:gap-3 py-0.5 sm:py-1">
                {activeSeries.user.avatarUrl ? (
                  <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden ring-2 ring-zinc-200 dark:ring-zinc-700">
                    <Image
                      src={activeSeries.user.avatarUrl}
                      alt={activeSeries.user.displayName || activeSeries.user.username}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-xs uppercase text-zinc-600 dark:text-zinc-300">
                    {activeSeries.user.username.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                    {activeSeries.user.displayName || activeSeries.user.username}
                  </div>
                  <div className="text-[10px] sm:text-xs text-zinc-400">
                    @{activeSeries.user.username} • Series Author
                  </div>
                </div>
              </div>

              {/* Series Premise / Synopsis */}
              <div className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-3.5 sm:pl-4 py-0.5 sm:py-1">
                <p className="text-xs sm:text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed italic line-clamp-3">
                  &ldquo;{activeSeries.description || "An epic serialized novel tracking characters across continuous, ordered volumes. Follow along in sequence."}&rdquo;
                </p>
              </div>

              {/* Sequential Volumes in Reading Order */}
              <div className="space-y-2.5 sm:space-y-3 pt-1">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <ListOrdered className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Volumes in Sequence ({activeSeries.stories.length} / {activeSeries._count.stories})
                  </span>
                  {activeSeries.stories.length > 0 && (
                    <Link 
                      href={`/series/${activeSeries.id}`}
                      className="text-[10px] sm:text-[11px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1"
                    >
                      View All <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </Link>
                  )}
                </div>

                {activeSeries.stories && activeSeries.stories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
                    {activeSeries.stories.slice(0, 3).map((story, vIdx) => (
                      <Link
                        key={story.id}
                        href={`/stories/${story.id}`}
                        className="group/story flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-sm bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-sm"
                      >
                        <div className="relative aspect-[2/3] w-9 sm:w-11 rounded-sm overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-zinc-200/40 dark:border-zinc-700/40">
                          {story.coverUrl ? (
                            <Image
                              src={story.coverUrl}
                              alt={story.title}
                              fill
                              sizes="48px"
                              className="object-cover transition-transform group-hover/story:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              <BookOpen className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="inline-block px-1.5 py-0.2 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[8px] sm:text-[9px] font-mono font-bold uppercase mb-0.5">
                            Vol. #{story.sequenceNumber ?? vIdx + 1}
                          </span>
                          <h5 className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-white truncate group-hover/story:text-zinc-600 dark:group-hover/story:text-zinc-300">
                            {story.title}
                          </h5>
                          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-zinc-400 mt-0.5">
                            {story._count?.chapters ? (
                              <span>{story._count.chapters} ch. • </span>
                            ) : null}
                            <span>{story.viewCount || 0} reads</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 sm:p-4 rounded-sm bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-[11px] sm:text-xs text-zinc-500 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3">
                    <span>This series has no published volumes yet. The author is preparing Volume 1.</span>
                    <Link href="/write/series" className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white underline whitespace-nowrap">
                      Add Volume
                    </Link>
                  </div>
                )}
              </div>

              {/* CTAs: Responsive Full-Width on Mobile */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                {firstStory ? (
                  <Link
                    href={`/stories/${firstStory.id}`}
                    className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 text-center"
                  >
                    <BookOpen className="w-4 h-4" /> Start Reading Volume 1
                  </Link>
                ) : (
                  <Link
                    href={`/series/${activeSeries.id}`}
                    className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 text-center"
                  >
                    <Layers className="w-4 h-4" /> View Series Details
                  </Link>
                )}

                <Link
                  href={`/series/${activeSeries.id}`}
                  className="px-5 py-3 sm:py-3.5 rounded-sm border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-center"
                >
                  <ListOrdered className="w-3.5 h-3.5" /> Full Index
                </Link>

                <Link
                  href="/write/series"
                  className="px-5 py-3 sm:py-3.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-center"
                >
                  <FilePenLine className="w-3.5 h-3.5" /> New Series
                </Link>
              </div>

            </div>

          </motion.div>
        </div>

        {/* Clean Series Switcher Deck: Responsive Symmetrical Deck */}
        <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Library className="w-3.5 h-3.5" /> All Featured Series ({seriesList.length})
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-zinc-400">
              <span className="hidden md:inline">Select any saga to spotlight above</span>
              <span className="md:hidden inline">Tap any saga to explore</span>
            </span>
          </div>

          {/* Symmetrical Grid of Series Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {seriesList.map((s, idx) => {
              const isSelected = idx === selectedIndex;
              const sReads = s.stories?.reduce((acc, st) => acc + (st.viewCount || 0), 0) || 0;
              const sFirstStory = s.stories?.[0];
              return (
                <Link
                  key={s.id}
                  href={`/series/${s.id}`}
                  onClick={(e) => {
                    if (typeof window !== "undefined" && window.innerWidth >= 768) {
                      e.preventDefault();
                      handleSelect(idx);
                    }
                  }}
                  className={`text-left p-3.5 sm:p-4 rounded-sm border transition-all duration-200 flex flex-col justify-between group relative h-full ${
                    isSelected
                      ? "md:bg-zinc-900 md:text-white md:dark:bg-white md:dark:text-zinc-900 md:border-zinc-900 md:dark:border-white md:shadow-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-200/80 dark:border-zinc-800"
                      : "bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-sm"
                  }`}
                >
                  {/* Top Row: Saga Index & Status */}
                  <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3 text-[10px] font-mono">
                    <span className={`font-bold ${isSelected ? "md:text-white md:dark:text-zinc-900 text-zinc-400" : "text-zinc-400"}`}>
                      #{String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] uppercase font-bold tracking-wider ${
                      isSelected 
                        ? "md:bg-zinc-800 md:text-zinc-200 md:dark:bg-zinc-200 md:dark:text-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400" 
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                    }`}>
                      {s.status === "COMPLETED" ? "Complete" : "Ongoing"}
                    </span>
                  </div>

                  {/* Series Thumbnail / Graphic */}
                  <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden bg-zinc-950 mb-2.5 sm:mb-3 border border-zinc-200/30 dark:border-zinc-700/40">
                    {s.coverUrl ? (
                      <Image
                        src={s.coverUrl}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 240px"
                        className="object-cover"
                      />
                    ) : sFirstStory?.coverUrl ? (
                      <Image
                        src={sFirstStory.coverUrl}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 240px"
                        className="object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${getSeriesGraphic(s.name)} flex items-center justify-center`}>
                        <Layers className="w-6 h-6 text-white/80" />
                      </div>
                    )}
                  </div>

                  {/* Title & Lore Snippet */}
                  <div className="space-y-1 mb-2.5 sm:mb-3">
                    <h4 className={`text-xs sm:text-sm font-bold line-clamp-1 uppercase ${
                      isSelected ? "md:text-white md:dark:text-zinc-900 text-zinc-900 dark:text-white" : "text-zinc-900 dark:text-white"
                    }`}>
                      {s.name}
                    </h4>
                    <p className={`text-[10px] sm:text-[11px] line-clamp-2 leading-relaxed ${
                      isSelected ? "md:text-zinc-300 md:dark:text-zinc-600 text-zinc-500 dark:text-zinc-400" : "text-zinc-500 dark:text-zinc-400"
                    }`}>
                      {s.description || "A multi-part serialized epic."}
                    </p>
                  </div>

                  {/* Bottom Author & Metrics */}
                  <div className={`pt-2.5 sm:pt-3 border-t flex items-center justify-between text-[9px] sm:text-[10px] font-mono ${
                    isSelected ? "md:border-zinc-800 md:dark:border-zinc-200 border-zinc-100 dark:border-zinc-800" : "border-zinc-100 dark:border-zinc-800"
                  }`}>
                    <span className={`truncate max-w-[100px] sm:max-w-[120px] ${
                      isSelected ? "md:text-zinc-300 md:dark:text-zinc-700 text-zinc-400" : "text-zinc-400"
                    }`}>
                      @{s.user.username}
                    </span>
                    <span className={`font-bold flex items-center gap-1 ${
                      isSelected ? "md:text-white md:dark:text-zinc-900 text-zinc-500 dark:text-zinc-400" : "text-zinc-500 dark:text-zinc-400"
                    }`}>
                      <span>{s._count.stories} Vols • {sReads} Reads</span>
                      <ArrowRight className="w-3 h-3 md:hidden inline ml-1 opacity-70" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Author Saga Callout Banner: Mobile First */}
          <div className="p-4 sm:p-6 lg:p-8 rounded-sm bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5 sm:mt-0">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                  Writing a multi-volume trilogy or serial saga?
                </h4>
                <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                  Group your manuscripts into a sequential Series. Establish exact reading sequences, automatically link readers from one volume to the next, and keep readers engaged through every installment.
                </p>
              </div>
            </div>
            
            <Link
              href="/write/series"
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm text-[11px] sm:text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 flex-shrink-0 text-center"
            >
              <FilePenLine className="w-3.5 h-3.5" />
              <span>Publish a New Series</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
