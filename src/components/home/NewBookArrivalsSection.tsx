"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Star, 
  Sparkles,
  FileText,
  Languages,
  Eye,
  X,
  Library,
  Bookmark
} from "lucide-react";

export interface NewArrivalBook {
  id: string;
  title: string;
  authorName: string;
  coverUrl: string | null;
  genre: string;
  language?: string;
  description?: string | null;
  fileType?: string;
  downloadCount: number;
  createdAt?: Date | string;
  _count?: { reviews: number };
  averageRating?: number;
}

interface NewBookArrivalsSectionProps {
  books: NewArrivalBook[];
}

export function NewBookArrivalsSection({ books }: NewBookArrivalsSectionProps) {
  const [selectedFormat, setSelectedFormat] = useState<"ALL" | "EPUB" | "PDF">("ALL");
  const [quickPeekBook, setQuickPeekBook] = useState<NewArrivalBook | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter books by format if specified
  const filteredBooks = useMemo(() => {
    if (selectedFormat === "ALL") return books;
    return books.filter((b) => (b.fileType || "").toUpperCase() === selectedFormat);
  }, [books, selectedFormat]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -340 : 340;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (!books || books.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/40 dark:bg-zinc-950/80 relative overflow-hidden">
      {/* Subtle Library Atmospheric Elements */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/2 -right-32 w-96 h-96 bg-amber-500/5 dark:bg-amber-500/5 rounded-full blur-3xl"
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 bg-zinc-400/5 dark:bg-zinc-600/5 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header: Mobile First */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-5 sm:gap-6 pb-6 border-b border-zinc-200/60 dark:border-zinc-900">
          <div className="space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 shadow-sm">
              <Library className="w-3.5 h-3.5 text-zinc-900 dark:text-white" />
              Library Archive • Fresh Acquisitions
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white uppercase flex flex-wrap items-center gap-2.5 sm:gap-4 break-words">
              New Book Arrivals
              <span className="text-[10px] sm:text-xs font-semibold normal-case px-2 py-0.5 rounded-sm bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                {books.length} Volumes
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-xl leading-relaxed">
              Curated reading editions, full manuscripts, and digitized volumes freshly added to the community shelves.
            </p>
          </div>

          {/* Format Tabs & Carousel Nav */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Format Filter Switcher */}
            <div className="flex items-center p-1 bg-white dark:bg-zinc-900 rounded-sm border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
              {(["ALL", "EPUB", "PDF"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-sm text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all ${
                    selectedFormat === fmt
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {fmt === "ALL" ? "All Formats" : fmt}
                </button>
              ))}
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-zinc-900 rounded-sm border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* View All */}
            <Link 
              href="/library?sort=recent" 
              className="group flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              Open Library <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 3D Exhibition Slipcase Rail (Hidden Scrollbar) */}
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-4 px-1 scroll-smooth snap-x snap-mandatory touch-pan-x scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {filteredBooks.map((book, idx) => {
            const avgRating = book.averageRating || 0;
            const reviewCount = book._count?.reviews || 0;
            const isEpub = (book.fileType || "").toUpperCase() === "EPUB";

            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="flex-shrink-0 w-[72vw] sm:w-72 max-w-[280px] snap-start group"
              >
                <div className="relative h-full flex flex-col justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1.5">
                  
                  {/* Top Bar Accent: Clean Black Line */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-zinc-900 dark:bg-zinc-100 rounded-t-sm" />

                  {/* 3D Book Cover Card Presentation */}
                  <div className="relative aspect-[2/3] w-full rounded-sm overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-4 shadow-lg border border-zinc-200/60 dark:border-zinc-700/80 group-hover:shadow-2xl transition-all duration-500">
                    
                    {/* Realistic Hardcover Spine Edge Highlight (left spine crease) */}
                    <div 
                      aria-hidden="true" 
                      className="absolute inset-y-0 left-0 w-3.5 bg-gradient-to-r from-black/40 via-black/15 to-transparent z-20 pointer-events-none"
                    />

                    {/* Book Cover Image */}
                    {book.coverUrl ? (
                      <Image
                        src={book.coverUrl}
                        alt={book.title}
                        fill
                        sizes="288px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 text-center">
                        <BookOpen className="w-10 h-10 text-zinc-400 mb-2" />
                        <span className="text-xs font-serif font-bold text-zinc-600 dark:text-zinc-400 line-clamp-3">
                          {book.title}
                        </span>
                      </div>
                    )}

                    {/* Format Pill (EPUB / PDF) */}
                    <div className="absolute top-2.5 right-2.5 z-20">
                      <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest shadow-md flex items-center gap-1 ${
                        isEpub 
                          ? "bg-emerald-600 text-white" 
                          : "bg-rose-600 text-white"
                      }`}>
                        <FileText className="w-2.5 h-2.5" />
                        {book.fileType || "BOOK"}
                      </span>
                    </div>

                    {/* Hover Action Overlay: Quick Peek */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex flex-col items-center justify-center gap-2.5 p-4">
                      <button
                        type="button"
                        onClick={() => setQuickPeekBook(book)}
                        className="w-full py-2 px-3 rounded-sm bg-white text-zinc-900 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg hover:bg-zinc-100 active:scale-95 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> Quick Preview
                      </button>
                      <Link
                        href={`/library/${book.id}`}
                        className="w-full py-2 px-3 rounded-sm bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg hover:bg-black active:scale-95 transition-all border border-white/20"
                      >
                        <BookOpen className="w-3.5 h-3.5" /> View Book
                      </Link>
                    </div>

                  </div>

                  {/* Book Metadata */}
                  <div className="space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Genre & Language Row */}
                      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        <span className="px-1.5 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          {book.genre}
                        </span>
                        {book.language && (
                          <span className="flex items-center gap-1">
                            <Languages className="w-2.5 h-2.5" /> {book.language}
                          </span>
                        )}
                      </div>

                      {/* Title: Classical Serif font */}
                      <Link href={`/library/${book.id}`} className="block group/link">
                        <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-white leading-snug line-clamp-2 group-hover/link:text-zinc-600 dark:group-hover/link:text-zinc-300 transition-colors">
                          {book.title}
                        </h3>
                      </Link>

                      {/* Author */}
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1 font-medium">
                        by {book.authorName}
                      </p>
                    </div>

                    {/* Bottom Stats & Direct Link */}
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between mt-3 text-[10px] text-zinc-400 font-medium">
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-zinc-700 dark:text-zinc-300">
                          {avgRating > 0 ? avgRating.toFixed(1) : "New"}
                        </span>
                        {reviewCount > 0 && <span>({reviewCount})</span>}
                      </div>

                      {/* Downloads */}
                      <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                        <Download className="w-3 h-3" />
                        <span>{book.downloadCount}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Quick Peek Inspection Modal */}
      <AnimatePresence>
        {quickPeekBook && (
          <div 
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setQuickPeekBook(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl overflow-hidden rounded-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-4 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Top Accent */}
              <div className="absolute top-0 inset-x-0 h-1 bg-zinc-900 dark:bg-zinc-100" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setQuickPeekBook(null)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                
                {/* Modal Book Cover */}
                <div className="sm:col-span-5 relative aspect-[2/3] w-full rounded-sm overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-xl border border-zinc-200 dark:border-zinc-700">
                  <div 
                    aria-hidden="true" 
                    className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent z-10 pointer-events-none" 
                  />
                  {quickPeekBook.coverUrl ? (
                    <Image
                      src={quickPeekBook.coverUrl}
                      alt={quickPeekBook.title}
                      fill
                      sizes="220px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      <BookOpen className="w-10 h-10 text-zinc-400 mb-2" />
                      <span className="text-xs font-serif font-bold text-zinc-600 dark:text-zinc-400">
                        {quickPeekBook.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Modal Book Details */}
                <div className="sm:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-[9px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      {quickPeekBook.genre}
                    </span>
                    <span className="px-2 py-0.5 rounded-sm bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[9px] font-bold uppercase tracking-wider">
                      {quickPeekBook.fileType || "BOOK"}
                    </span>
                    {quickPeekBook.language && (
                      <span className="text-[10px] text-zinc-400">
                        • {quickPeekBook.language}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
                    {quickPeekBook.title}
                  </h3>

                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Authored by <span className="font-bold text-zinc-900 dark:text-white">{quickPeekBook.authorName}</span>
                  </p>

                  <div className="max-h-36 overflow-y-auto pr-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed italic border-l-2 border-zinc-200 dark:border-zinc-800 pl-3">
                    {quickPeekBook.description || "No full synopsis provided for this volume. Open the book to start reading or check reader reviews."}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 flex items-center gap-3">
                    <Link
                      href={`/library/${quickPeekBook.id}`}
                      className="flex-1 py-2.5 px-4 rounded-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:opacity-90 active:scale-95 transition-all text-center"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Read / Download
                    </Link>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
