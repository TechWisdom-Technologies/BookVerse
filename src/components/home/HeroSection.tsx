"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Sparkles, Play, ArrowRight, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-zinc-950 -mt-[env(safe-area-inset-top)] pt-0">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/50 to-transparent" />
        
        {/* Animated glowing orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-brand/30 rounded-full blur-[128px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[128px]" 
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-zinc-300 text-sm font-medium mb-8 shadow-2xl"
        >
          <Sparkles className="w-4 h-4 text-brand" />
          <span>The Next Generation Reading Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white tracking-tight mb-8"
        >
          Your Digital <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-orange-400 to-violet-500">
            Library Awaits
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg sm:text-xl text-zinc-400 max-w-2xl mb-12"
        >
          Immerse yourself in thousands of stories, connect with passionate readers, and experience literature like never before.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Link
            href="/library"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand text-white rounded-full font-black text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <BookOpen className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Explore Library</span>
            <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/stories"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/5 border-2 border-white/10 text-white rounded-full font-black text-lg backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Play className="w-4 h-4 ml-0.5" />
            </div>
            <span>Read Stories</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 flex items-center gap-8 text-sm text-zinc-500 font-medium"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="ml-4 flex flex-col items-start">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span>Trusted by 50K+ readers</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500"
      >
        <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-1 h-8 rounded-full bg-gradient-to-b from-brand/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
