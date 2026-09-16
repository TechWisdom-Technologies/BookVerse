"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Compass, ChevronDown, BookOpen, Search, Heart, Sparkles, Star, Users, Flame, Zap, Activity, Award, Bookmark 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const iconsList = [BookOpen, Search, Heart, Sparkles, Star, Users, Flame, Compass, Zap, Activity, Award, Bookmark];

interface Category {
  name: string;
  count: string;
}

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const [visibleRows, setVisibleRows] = useState(1);
  const itemsPerRow = 6; // Based on lg:grid-cols-6
  const visibleCount = visibleRows * itemsPerRow;
  const hasMore = visibleCount < categories.length;

  const handleLoadMore = () => {
    setVisibleRows((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-center mb-16 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          <Compass className="w-3 h-3" /> Explore
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white">
          Browse by Category
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <AnimatePresence>
          {categories.slice(0, visibleCount).map((cat, index) => {
            const Icon = iconsList[index % iconsList.length];
            return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: (index % itemsPerRow) * 0.05 }}
            >
              <Link 
                href={`/stories?genre=${encodeURIComponent(cat.name)}`} 
                className="group relative flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 overflow-hidden h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/50 to-transparent dark:from-zinc-800/50 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <Icon className="w-6 h-6 mb-4 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white group-hover:scale-110 transition-all duration-500 relative z-10" />
                
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 group-hover:text-brand transition-colors mb-1 relative z-10 truncate px-2 text-center w-full">
                  {cat.name}
                </h3>
                <p className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 relative z-10">
                  {cat.count} Stories
                </p>
              </Link>
            </motion.div>
          )})}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="group flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm hover:shadow"
          >
            Load More <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
