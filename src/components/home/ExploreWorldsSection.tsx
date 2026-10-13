"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Globe, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Compass, 
  Flame, 
  Layers, 
  FilePenLine, 
  Users,
  Eye,
  ExternalLink
} from "lucide-react";

export interface UniverseStoryItem {
  id: string;
  title: string;
  coverUrl: string | null;
  viewCount: number;
}

export interface UniverseItem {
  id: string;
  name: string;
  description: string | null;
  genre: string;
  coverUrl: string | null;
  createdAt?: string | Date;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  stories: UniverseStoryItem[];
  _count: {
    stories: number;
  };
}

interface ExploreWorldsSectionProps {
  universes: UniverseItem[];
}

const getUniverseGraphic = (name: string) => {
  const gradients = [
    "from-zinc-900 via-zinc-800 to-black",
    "from-neutral-900 via-zinc-800 to-zinc-950",
    "from-slate-900 via-zinc-800 to-neutral-900",
    "from-zinc-900 via-stone-800 to-zinc-950",
    "from-stone-900 via-zinc-800 to-neutral-950"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

export function ExploreWorldsSection({ universes }: ExploreWorldsSectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  if (!universes || universes.length === 0) return null;

  const activeUniverse = universes[selectedIndex] || universes[0];
  const totalReads = activeUniverse.stories?.reduce((acc, s) => acc + (s.viewCount || 0), 0) || 0;

  // Auto-advance spotlight every 9s if not paused
  useEffect(() => {
    if (!autoplay || universes.length <= 1) return;
    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % universes.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [autoplay, universes.length]);

  const handleSelect = (idx: number) => {
    setAutoplay(false);
    setSelectedIndex(idx);
  };

  const handlePrev = () => {
    setAutoplay(false);
    setSelectedIndex((prev) => (prev === 0 ? universes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setAutoplay(false);
    setSelectedIndex((prev) => (prev + 1) % universes.length);
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
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-700 dark:text-zinc-300" />
              Literary Realms • Shared Universes
            </div>
            
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white uppercase flex flex-wrap items-center gap-2.5 sm:gap-4 break-words">
              Explore Worlds
              <span className="text-[10px] sm:text-xs font-semibold normal-case px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800">
                {universes.length} Active Realmlines
              </span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              Step beyond standalone novels into sprawling literary multiverses. Traverse shared canons, overarching lore, and connected sagas woven across multiple stories.
            </p>
          </div>

          {/* Navigation Controls, Found World & Browse All */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Step Controls: Hidden on mobile */}
            <div className="hidden md:flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-sm border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
              <button
                type="button"
                onClick={handlePrev}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-sm bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95"
                aria-label="Previous realm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2.5 sm:px-3 text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
                {String(selectedIndex + 1).padStart(2, "0")} / {String(universes.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={handleNext}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-sm bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95"
                aria-label="Next realm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Found a Universe Button */}
            <Link 
              href="/write/universes" 
              className="group flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Found a Universe</span>
            </Link>

            {/* Browse All Link */}
            <Link 
              href="/universes" 
              className="group flex items-center gap-2 px-3.5 sm:px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white rounded-sm text-[10px] font-bold uppercase tracking-widest border border-zinc-200/80 dark:border-zinc-800 transition-all shadow-sm active:scale-95 whitespace-nowrap"
            >
              <span>All Worlds</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Cinematic Realm Stage: Hidden on mobile (< md), visible on desktop */}
        <div className="hidden md:block relative overflow-hidden rounded-sm bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/70 dark:border-zinc-800/80 shadow-md p-4 sm:p-8 lg:p-14">
          {/* Top Solid Black Line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-zinc-900 dark:bg-zinc-100" />

          <motion.div
            key={activeUniverse.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-start"
          >
            
            {/* Left Column: Cinematic Panorama Portal (5 Columns) */}
            <div className="lg:col-span-5 space-y-4">
              <Link href={`/universes/${activeUniverse.id}`} className="block relative group/portal">
                <div className="relative aspect-[16/11] sm:aspect-[4/3] lg:aspect-[5/4] w-full rounded-sm overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-700 shadow-2xl transition-all duration-500 group-hover/portal:shadow-2xl">
                  
                  {activeUniverse.coverUrl ? (
                    <Image
                      src={activeUniverse.coverUrl}
                      alt={activeUniverse.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 500px"
                      className="object-cover transition-transform duration-700 group-hover/portal:scale-105 opacity-90 group-hover/portal:opacity-100"
                      priority
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getUniverseGraphic(activeUniverse.name)} flex flex-col items-center justify-center p-6 sm:p-8 text-center relative overflow-hidden`}>
                      {/* Subtle Cartography Orbit Lines */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
                      <div className="absolute -inset-10 border border-white/5 rounded-full pointer-events-none" />
                      
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-sm bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 sm:mb-4 relative z-10 shadow-lg group-hover/portal:scale-110 transition-transform">
                        <Compass className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow" />
                      </div>
                      
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-white/70 relative z-10">
                        {activeUniverse.genre} • CANON REALM
                      </span>
                      <h4 className="text-base sm:text-xl font-black uppercase tracking-tight text-white mt-1 relative z-10 line-clamp-2 px-3 sm:px-4">
                        {activeUniverse.name}
                      </h4>
                    </div>
                  )}

                  {/* Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 pointer-events-none" />

                  {/* Floating Top Badge: Architect */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-sm bg-black/60 backdrop-blur-md border border-white/15 text-white shadow-lg">
                    {activeUniverse.user.avatarUrl ? (
                      <div className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full overflow-hidden">
                        <Image src={activeUniverse.user.avatarUrl} alt="" fill sizes="16px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white/20 flex items-center justify-center text-[7px] sm:text-[8px] font-bold">
                        {activeUniverse.user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider font-bold">
                      @{activeUniverse.user.username}
                    </span>
                  </div>

                  {/* Bottom Stats & Hover Action */}
                  <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 z-20 flex flex-col xs:flex-row items-start xs:items-end justify-between gap-2.5 xs:gap-4">
                    <div className="space-y-0.5 sm:space-y-1">
                      <div className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-zinc-300 flex items-center gap-2 sm:gap-3">
                        <span className="flex items-center gap-1 font-bold">
                          <BookOpen className="w-3 h-3 text-zinc-400" />
                          {activeUniverse._count.stories} {activeUniverse._count.stories === 1 ? "Story" : "Stories"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-bold">
                          <Flame className="w-3 h-3 text-amber-400" />
                          {totalReads} Reads
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-sm border border-white/30 group-hover/portal:bg-white group-hover/portal:text-zinc-900 transition-colors">
                      Enter Realm <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/portal:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Column: Deep Lore Dossier & Canon Stories (7 Columns) */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 lg:space-y-8">
              
              {/* Sector Meta Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm">
                  Sector #{String(selectedIndex + 1).padStart(2, "0")}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                  <Compass className="w-3 h-3 text-zinc-400" /> {activeUniverse.genre}
                </span>

                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider truncate max-w-[150px] xs:max-w-none">
                  <Users className="w-3 h-3 text-zinc-400" /> By {activeUniverse.user.displayName || activeUniverse.user.username}
                </span>
              </div>

              {/* Massive Universe Title */}
              <Link href={`/universes/${activeUniverse.id}`} className="block group/title">
                <h3 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.15] group-hover/title:text-zinc-600 dark:group-hover/title:text-zinc-300 transition-colors uppercase break-words">
                  {activeUniverse.name}
                </h3>
              </Link>

              {/* World Premise / Lore Synopsis */}
              <div className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-3.5 sm:pl-4 py-0.5 sm:py-1">
                <p className="text-xs sm:text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed italic line-clamp-3 sm:line-clamp-4">
                  &ldquo;{activeUniverse.description || "No public lore overview published for this universe yet. Explore connected novels to uncover the overarching canon."}&rdquo;
                </p>
              </div>

              {/* Connected Canon Stories in this Universe */}
              <div className="space-y-2.5 sm:space-y-3 pt-1">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Canon Stories ({activeUniverse.stories.length})
                  </span>
                  {activeUniverse.stories.length > 0 && (
                    <Link 
                      href={`/universes/${activeUniverse.id}`}
                      className="text-[10px] sm:text-[11px] font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1"
                    >
                      View All <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </Link>
                  )}
                </div>

                {activeUniverse.stories && activeUniverse.stories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
                    {activeUniverse.stories.slice(0, 3).map((story) => (
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
                          <h5 className="text-[11px] sm:text-xs font-bold text-zinc-900 dark:text-white truncate group-hover/story:text-zinc-600 dark:group-hover/story:text-zinc-300">
                            {story.title}
                          </h5>
                          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-zinc-400 mt-0.5">
                            <Eye className="w-2.5 h-2.5" />
                            <span>{story.viewCount || 0} reads</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 sm:p-4 rounded-sm bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 text-[11px] sm:text-xs text-zinc-500 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3">
                    <span>This literary realm is freshly charted. Be the first author to submit a chapter to this canon.</span>
                    <Link href="/write" className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white underline whitespace-nowrap">
                      Write Chapter
                    </Link>
                  </div>
                )}
              </div>

              {/* CTAs: Responsive Full-Width on Mobile */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <Link
                  href={`/universes/${activeUniverse.id}`}
                  className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 text-center"
                >
                  <Compass className="w-4 h-4" /> Traverse Universe Canon
                </Link>

                <Link
                  href="/write/universes"
                  className="px-5 py-3 sm:py-3.5 rounded-sm border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-center"
                >
                  <FilePenLine className="w-3.5 h-3.5" /> Found Your World
                </Link>
              </div>

            </div>

          </motion.div>
        </div>

        {/* Clean World Switcher Deck: Responsive Symmetrical Deck */}
        <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-400">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <Layers className="w-3.5 h-3.5" /> All Canon Realms ({universes.length})
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-zinc-400">
              <span className="hidden md:inline">Select any world to spotlight above</span>
              <span className="md:hidden inline">Tap any realm to explore</span>
            </span>
          </div>

          {/* Symmetrical Grid of Universe Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {universes.map((u, idx) => {
              const isSelected = idx === selectedIndex;
              const uReads = u.stories?.reduce((acc, s) => acc + (s.viewCount || 0), 0) || 0;
              return (
                <Link
                  key={u.id}
                  href={`/universes/${u.id}`}
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
                  {/* Top Row: Sector Index & Genre */}
                  <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3 text-[10px] font-mono">
                    <span className={`font-bold ${isSelected ? "md:text-white md:dark:text-zinc-900 text-zinc-400" : "text-zinc-400"}`}>
                      #{String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] uppercase font-bold tracking-wider ${
                      isSelected 
                        ? "md:bg-zinc-800 md:text-zinc-200 md:dark:bg-zinc-200 md:dark:text-zinc-800 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400" 
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                    }`}>
                      {u.genre}
                    </span>
                  </div>

                  {/* World Thumbnail / Graphic */}
                  <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden bg-zinc-950 mb-2.5 sm:mb-3 border border-zinc-200/30 dark:border-zinc-700/40">
                    {u.coverUrl ? (
                      <Image
                        src={u.coverUrl}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 240px"
                        className="object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${getUniverseGraphic(u.name)} flex items-center justify-center`}>
                        <Compass className="w-6 h-6 text-white/80" />
                      </div>
                    )}
                  </div>

                  {/* Title & Lore Snippet */}
                  <div className="space-y-1 mb-2.5 sm:mb-3">
                    <h4 className={`text-xs sm:text-sm font-bold line-clamp-1 uppercase ${
                      isSelected ? "md:text-white md:dark:text-zinc-900 text-zinc-900 dark:text-white" : "text-zinc-900 dark:text-white"
                    }`}>
                      {u.name}
                    </h4>
                    <p className={`text-[10px] sm:text-[11px] line-clamp-2 leading-relaxed ${
                      isSelected ? "md:text-zinc-300 md:dark:text-zinc-600 text-zinc-500 dark:text-zinc-400" : "text-zinc-500 dark:text-zinc-400"
                    }`}>
                      {u.description || "Canon multiverse overview."}
                    </p>
                  </div>

                  {/* Bottom Architect & Metrics */}
                  <div className={`pt-2.5 sm:pt-3 border-t flex items-center justify-between text-[9px] sm:text-[10px] font-mono ${
                    isSelected ? "md:border-zinc-800 md:dark:border-zinc-200 border-zinc-100 dark:border-zinc-800" : "border-zinc-100 dark:border-zinc-800"
                  }`}>
                    <span className={`truncate max-w-[100px] sm:max-w-[120px] ${
                      isSelected ? "md:text-zinc-300 md:dark:text-zinc-700 text-zinc-400" : "text-zinc-400"
                    }`}>
                      @{u.user.username}
                    </span>
                    <span className={`font-bold flex items-center gap-1 ${
                      isSelected ? "md:text-white md:dark:text-zinc-900 text-zinc-500 dark:text-zinc-400" : "text-zinc-500 dark:text-zinc-400"
                    }`}>
                      <span>{u._count.stories} Stories • {uReads} Reads</span>
                      <ArrowRight className="w-3 h-3 md:hidden inline ml-1 opacity-70" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Architect World Founding Callout Banner: Mobile First */}
          <div className="p-4 sm:p-6 lg:p-8 rounded-sm bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5 sm:mt-0">
                <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                  Building a multi-story saga or shared universe?
                </h4>
                <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                  Charter a canon universe in BookVerse. Establish overarching world lore, connect multiple books and spin-offs, invite co-authors, and let readers immerse themselves in your universe.
                </p>
              </div>
            </div>
            
            <Link
              href="/write/universes"
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm text-[11px] sm:text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 flex-shrink-0 text-center"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Found a New World</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
