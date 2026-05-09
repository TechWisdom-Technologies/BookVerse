"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Sparkles, Play, ArrowRight, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-500">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] dark:opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 dark:to-transparent" />
        
        {/* Animated Orbs - Subtle in Light Mode */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-zinc-200 dark:bg-zinc-800 rounded-full blur-[128px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.05, 0.15, 0.05],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-zinc-100 dark:bg-zinc-900 rounded-full blur-[128px]" 
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-12 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Modern Reading Experience</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-6xl sm:text-7xl lg:text-9xl font-bold text-zinc-900 dark:text-white tracking-tighter mb-10 uppercase leading-[0.9]"
        >
          Your Next <br className="hidden sm:block" />
          <span className="text-zinc-300 dark:text-zinc-800">
            Story Awaits.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-sm sm:text-base text-zinc-500 max-w-xl mb-16 font-medium italic leading-relaxed"
        >
          Discover thousands of stories, connect with passionate readers, and experience literature in a clean, minimalist environment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-8"
        >
          <Link
            href="/library"
            className="group relative inline-flex items-center justify-center gap-4 px-12 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-500 hover:scale-105 shadow-xl border border-zinc-900 dark:border-white"
          >
            <BookOpen className="w-4 h-4" />
            <span>Start Reading</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
          
          <Link
            href="/stories"
            className="group relative inline-flex items-center justify-center gap-4 px-12 py-4 bg-transparent border border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 rounded font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white hover:scale-105"
          >
            <Play className="w-4 h-4 ml-0.5" />
            <span>Latest Stories</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-24 flex items-center gap-10 text-[10px] font-bold uppercase tracking-widest text-zinc-300 dark:text-zinc-700"
        >
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-1 text-zinc-900 dark:text-white">
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
                <Star className="w-3 h-3 fill-current" />
              </div>
              <span className="italic">Trusted by 50K+ readers</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-zinc-200 dark:text-zinc-800"
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-zinc-200 dark:bg-zinc-800"
        />
      </motion.div>
    </section>
  );
}
