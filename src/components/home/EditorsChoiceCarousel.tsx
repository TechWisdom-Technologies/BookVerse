"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Award, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Download, 
  BookOpen, 
  Sparkles 
} from "lucide-react";

export interface FeaturedBook {
  id: string;
  title: string;
  authorName: string;
  coverUrl: string | null;
  genre: string;
  downloadCount: number;
  _count?: { reviews: number };
  averageRating?: number;
}

interface EditorsChoiceCarouselProps {
  books: FeaturedBook[];
}

export function EditorsChoiceCarousel({ books }: EditorsChoiceCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [books]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = 300; // approximate width + gap
    const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!books || books.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header with Title & Navigation Controls: Mobile First */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-5 sm:gap-6 pb-6 border-b border-zinc-200/60 dark:border-zinc-900">
          <div className="space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 shadow-sm">
              <Award className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
              Recommended • Editorial Selection
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white uppercase flex flex-wrap items-center gap-2.5 sm:gap-4 break-words">
              Editor&apos;s Choice
              <span className="hidden md:block h-[2px] w-20 bg-zinc-900 dark:bg-white opacity-10 rounded-full"></span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-xl leading-relaxed">
              Curated masterworks, top-rated literature, and critically acclaimed editions handpicked by the BookVerse editors.
            </p>
          </div>

          {/* Navigation Controls & Browse All */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-sm border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="w-8 h-8 rounded-sm bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:scale-100 hover:scale-105 active:scale-95 shadow-sm"
                aria-label="Previous books"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="w-8 h-8 rounded-sm bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:scale-100 hover:scale-105 active:scale-95 shadow-sm"
                aria-label="Next books"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link 
              href="/library" 
              className="group flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              Browse All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Carousel Rail (No ugly scrollbar, Native touch scroll & vertical pan enabled) */}
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 px-1 scroll-smooth snap-x snap-mandatory overscroll-x-contain scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {books.map((book, idx) => {
            const avgRating = book.averageRating || 0;
            const reviewCount = book._count?.reviews || 0;

            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="flex-shrink-0 w-[72vw] sm:w-72 max-w-[280px] snap-start group"
              >
                <Link href={`/library/${book.id}`} className="block h-full">
                  <div className="relative h-full flex flex-col justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-sm shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1.5">
                    
                    {/* Top Solid Black Accent Line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-zinc-900 dark:bg-zinc-100 rounded-t-sm" />

                    {/* Book Cover Image Container */}
                    <div className="relative aspect-[2/3] w-full rounded-sm overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-4 shadow border border-zinc-200/60 dark:border-zinc-700/80 group-hover:shadow-xl transition-all duration-500">
                      
                      {/* Left Spine Crease Highlight */}
                      <div 
                        aria-hidden="true" 
                        className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/35 via-black/10 to-transparent z-10 pointer-events-none"
                      />

                      {book.coverUrl ? (
                        <Image
                          src={book.coverUrl}
                          alt={book.title}
                          fill
                          sizes="288px"
                          draggable={false}
                          className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 text-center">
                          <BookOpen className="w-10 h-10 text-zinc-400 mb-2" />
                          <span className="text-xs font-serif font-bold text-zinc-600 dark:text-zinc-400 line-clamp-3">
                            {book.title}
                          </span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 z-20">
                        <span className="px-2 py-0.5 rounded-sm bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[8px] font-black uppercase tracking-widest shadow-md flex items-center gap-1">
                          <Award className="w-2.5 h-2.5" /> Pick
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-end p-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white">
                          <BookOpen className="w-3.5 h-3.5" /> Read Volume
                        </span>
                      </div>
                    </div>

                    {/* Book Metadata */}
                    <div className="space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Genre Tag */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                            {book.genre}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                          {book.title}
                        </h3>

                        {/* Author */}
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1 font-medium">
                          by {book.authorName}
                        </p>
                      </div>

                      {/* Bottom Footer: Rating & Downloads */}
                      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between mt-3 text-[10px] text-zinc-400 font-medium">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">
                            {avgRating > 0 ? avgRating.toFixed(1) : "5.0"}
                          </span>
                          {reviewCount > 0 && <span>({reviewCount})</span>}
                        </div>

                        <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                          <Download className="w-3 h-3" />
                          <span>{book.downloadCount}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
