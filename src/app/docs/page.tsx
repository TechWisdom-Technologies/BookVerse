"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Settings,
  PenTool,
  Users,
  Wallet,
  BarChart3,
  ChevronRight,
  Info,
  BookMarked,
  Sparkles,
  ArrowRight,
  Search,
  Globe,
  Trophy,
  Star,
  Coins,
  Megaphone,
  CalendarClock,
  Zap,
  Shield,
  MessageSquare,
  Gift,
  Menu,
  Layers
} from "lucide-react";

type TabId = "getting-started" | "reading" | "writing" | "promotions" | "community" | "monetization" | "analytics";

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const TABS: TabConfig[] = [
  { id: "getting-started", label: "Getting Started", icon: Settings, description: "Account setup and basics" },
  { id: "reading", label: "Reading & Library", icon: BookOpen, description: "Discover and read stories" },
  { id: "writing", label: "Writing & Publishing", icon: PenTool, description: "Create and publish books" },
  { id: "promotions", label: "Marketing & Promo", icon: Megaphone, description: "Promote and schedule" },
  { id: "community", label: "Community", icon: Users, description: "Connect with readers and clubs" },
  { id: "monetization", label: "Monetization & Premium", icon: Wallet, description: "Earn tips and go Pro" },
  { id: "analytics", label: "Analytics", icon: BarChart3, description: "Track your performance" },
];

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState<TabId>("getting-started");

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
            <Info className="w-4 h-4" />
            BookVerse Comprehensive Platform Guide
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-4">
            Documentation.
          </h1>
          <p className="text-sm md:text-base text-zinc-500 font-medium max-w-2xl leading-relaxed">
            Welcome to the ultimate BookVerse handbook. From reading offline to advanced chapter scheduling and monetization algorithms, select a module to master the platform.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 shrink-0 space-y-2 lg:sticky lg:top-24 z-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6 px-4 italic">Topics</h3>
            <nav className="flex flex-col gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-start w-full p-4 rounded-2xl transition-all duration-300 border ${activeTab === tab.id
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-lg scale-[1.02]"
                      : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-3">
                      <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-white dark:text-zinc-900" : ""}`} />
                      <span className="text-xs font-black uppercase tracking-wider">{tab.label}</span>
                    </div>
                    {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${activeTab === tab.id ? "text-zinc-300 dark:text-zinc-500" : "text-zinc-400"}`}>
                    {tab.description}
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <section className="flex-1 min-w-0 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-3xl p-6 md:p-10 border border-zinc-100 dark:border-zinc-900">

            {/* Getting Started */}
            {activeTab === "getting-started" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                    <Settings className="w-6 h-6 text-indigo-500" />
                    Getting Started & Account Setup
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    BookVerse is more than just a reading app; it's a social hub for literature enthusiasts and creators. Mastering your identity is the first step.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">Identity & Profile Registry</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      Your identity acts as a passport within the BookVerse ecosystem. Once you register via Google or email, head to your <strong>Settings</strong> page to personalize your identity.
                    </p>
                    <ul className="space-y-3 text-xs text-zinc-500 list-disc pl-5">
                      <li><strong>Avatars & Bio:</strong> Add a high-resolution avatar and a compelling bio. An optimized bio is crucial for authors seeking to grow their followers.</li>
                      <li><strong>Public Profiles:</strong> Your profile (`/profile/your-username`) showcases your published works, your reading lists (shelves), and your activity timeline. Make sure it represents your brand!</li>
                      <li><strong>Security & Privacy:</strong> Control what others can see. You can opt to keep your reading lists private if desired.</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">Global Navigation Paradigm</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      BookVerse utilizes a hybrid navigation system optimized for both massive monitors and mobile devices.
                    </p>
                    <ul className="space-y-3 text-xs text-zinc-500">
                      <li className="flex gap-2 items-start"><Globe className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" /> <strong>Global Dock (Desktop):</strong> Found at the bottom of your screen, the dock holds shortcuts to Library, Stories, Universes, Series, and Community hubs.</li>
                      <li className="flex gap-2 items-start"><Menu className="w-4 h-4 shrink-0 mt-0.5 text-zinc-500" /> <strong>Sidebar & Profile Menu:</strong> Clicking your avatar (top right) opens the unified sidebar. Here you can access your Author Dashboard, Wallet, Offline Stories, Settings, and this Documentation.</li>
                      <li className="flex gap-2 items-start"><Search className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" /> <strong>Omni-Search:</strong> The search page handles fuzzy matching for authors, tags, book titles, and universe names simultaneously.</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">Notification Streams</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      BookVerse features a real-time notification engine. You will be instantly alerted when: an author you follow publishes a new chapter, someone tips your story, your reading challenge has 24 hours left, or you receive a reply to your book comment.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reading & Library */}
            {activeTab === "reading" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-emerald-500" />
                    Mastering the Reading Experience
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    BookVerse has engineered a distraction-free, customizable reading interface. Learn how to manage your digital library and leverage offline capabilities.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm md:col-span-2">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-indigo-500">
                      <BookMarked className="w-5 h-5" /> The Advanced PDF Engine
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      Unlike standard web readers, BookVerse utilizes a highly optimized PDF proxy and rendering engine (pdf.js) capable of handling massive documents smoothly.
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-500 list-disc pl-5">
                      <li><strong>Zoom & Pan:</strong> Intelligently scales pages without losing resolution.</li>
                      <li><strong>State Persistence:</strong> The platform remembers exactly which page you were on. If you leave and return to a book, you'll resume from the exact same spot.</li>
                      <li><strong>Dark Mode Inversion:</strong> Our reader supports visual adjustments for late-night reading, preventing eye strain.</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-500" /> Offline Reading Vault
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Going on a flight? Commuting? You can cache stories directly to your device. Navigate to any story, click "Save for Offline", and it will be stored securely in your browser's IndexedDB. Access them anytime from the <strong>Offline Stories</strong> tab in your profile menu, even with airplane mode on!
                    </p>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" /> AI Librarian AI
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Click the Sparkles icon on the top right. This brings up an intelligent assistant powered by language models that analyzes your reading history, current mood, and genre preferences to curate highly specific recommendations from the BookVerse database.
                    </p>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm md:col-span-2">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">The Personal Shelf Architecture</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Your Library (Shelf) is your command center. It tracks your exact reading progress percentages (e.g., 45% complete). When you finish a book, it moves to your "Completed" section, contributing to your global reading stats and Reading Challenge metrics.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Writing & Publishing */}
            {activeTab === "writing" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                    <PenTool className="w-6 h-6 text-rose-500" />
                    Author Studio & Content Architecture
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    BookVerse provides a professional-grade suite for managing complex literary worlds. We do not just host files; we build ecosystems.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-lg text-white">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-4 text-rose-400">The Hierarchical Data Model</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                      To keep large franchises organized, content is structured in three rigid layers. You must understand this to publish successfully.
                    </p>
                    <div className="space-y-4">
                      <div className="bg-zinc-950 p-5 rounded-xl">
                        <strong className="uppercase tracking-widest block mb-2 text-rose-300 text-[11px] flex items-center gap-2"><Globe className="w-4 h-4" /> Tier 1: Universes</strong>
                        <span className="text-zinc-400 text-xs">The absolute top level. E.g., "The Marvel Universe" or "The Cosmere". A universe houses infinite series and standalone books. It defines the overarching lore and timeline.</span>
                      </div>
                      <div className="bg-zinc-950 p-5 rounded-xl">
                        <strong className="uppercase tracking-widest block mb-2 text-amber-300 text-[11px] flex items-center gap-2"><Layers className="w-4 h-4" /> Tier 2: Series</strong>
                        <span className="text-zinc-400 text-xs">A sequential narrative chain. E.g., "Harry Potter". Books placed in a series will automatically display a "Next in Series" prompt to readers.</span>
                      </div>
                      <div className="bg-zinc-950 p-5 rounded-xl">
                        <strong className="uppercase tracking-widest block mb-2 text-emerald-300 text-[11px] flex items-center gap-2"><BookOpen className="w-4 h-4" /> Tier 3: Stories / Chapters</strong>
                        <span className="text-zinc-400 text-xs">The actual novel. It contains chapters. A story can be assigned to a Series, a Universe, both, or neither (Standalone).</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                      <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                        <PenTool className="w-4 h-4 text-indigo-500" /> The Manuscript Editor
                      </h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Our editor supports rich text, markdown shortcuts, and structural formatting. The system automatically calculates reading times based on word count. You can rearrange chapters via drag-and-drop in the dashboard.
                      </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                      <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500" /> AI Cover Generation
                      </h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Struggling with cover art? Within the editor's metadata tab, you can input a visual prompt, and our integrated AI will generate a beautiful, 16:9 optimized cover image for your story instantly.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">Publishing Requirements & SEO</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      Before a story goes live and enters the global search index, it must meet strict metadata standards:
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-500 list-disc pl-5">
                      <li><strong>Synopsis:</strong> At least 150 characters to engage readers.</li>
                      <li><strong>Tags & Genres:</strong> Select primary genres (Fantasy, Sci-Fi) and custom tags (e.g., #EnemiesToLovers). This fuels the recommendation engine.</li>
                      <li><strong>Status:</strong> Mark as 'Ongoing', 'Completed', or 'Hiatus'.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Marketing & Promos (NEW EXPANDED) */}
            {activeTab === "promotions" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                    <Megaphone className="w-6 h-6 text-rose-500" />
                    Marketing, Scheduling & Promotions
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    Writing the book is only 50% of the battle. The Author Studio equips you with tools to manipulate the algorithm, run campaigns, and maintain reader engagement through strategic releases.
                  </p>
                </div>

                <div className="space-y-6">

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-indigo-500">
                      <CalendarClock className="w-5 h-5" /> Chapter Release Scheduling
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      The algorithm favors consistent updates. Instead of publishing manually, utilize the <strong>Scheduling Engine</strong>.
                    </p>
                    <ul className="space-y-3 text-xs text-zinc-500">
                      <li><strong>Queueing:</strong> Draft multiple chapters and assign them future go-live dates (e.g., Every Friday at 5 PM EST).</li>
                      <li><strong>Timezone Normalization:</strong> The scheduler automatically converts your local time to UTC to ensure global readers get updates synchronously.</li>
                      <li><strong>Notification Triggers:</strong> The exact millisecond a scheduled chapter goes live, the system fires WebSocket events to all your followers, instantly pushing them a notification.</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-rose-500">
                      <Zap className="w-5 h-5" /> Algorithmic Boosting & Promotions
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      How does a story reach the "Trending" section on the homepage?
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl">
                        <strong className="uppercase tracking-widest block mb-1 text-[10px] text-zinc-900 dark:text-white">Velocity Metric</strong>
                        <p className="text-xs text-zinc-500">The system calculates views-per-hour. A sudden influx of views (velocity) heavily outweighs total lifetime views for trending placement.</p>
                      </div>
                      <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl">
                        <strong className="uppercase tracking-widest block mb-1 text-[10px] text-zinc-900 dark:text-white">Engagement Weight</strong>
                        <p className="text-xs text-zinc-500">1 Tip = 50 Views. 1 Comment = 10 Views. Earning tips massively spikes your algorithm score.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-emerald-500">
                      <Gift className="w-5 h-5" /> Author Newsletters (Creator Tier)
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      If you are on the <strong>Creator Tier</strong>, readers can subscribe directly to your author profile. You gain the ability to blast HTML newsletters directly to their email inboxes. Use this to announce upcoming releases, run giveaways, or share exclusive lore drops. Newsletters bypass social media algorithms and guarantee a 100% reach to your loyal fanbase.
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* Community */}
            {activeTab === "community" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                    <Users className="w-6 h-6 text-blue-500" />
                    Social Dynamics & Community
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    BookVerse thrives on interaction. Discover how the social mechanics operate beneath the hood.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm md:col-span-2">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-500" /> The Global Activity Feed
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      The Feed is the pulse of BookVerse. Every public action—publishing a book, leaving a 5-star review, achieving a challenge—is broadcasted to the feed.
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-500 list-disc pl-5">
                      <li>Toggle between "Global" (everyone) and "Following" (curated network).</li>
                      <li>Rich embeds allow users to click directly into a book or profile from a feed item.</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-500" /> Book Clubs
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Clubs are micro-communities. An admin creates a club, sets rules, and curates a "Club Reading List". Members get localized discussion forums tied to specific books on that list. Great for book-of-the-month events!
                    </p>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" /> Reading Challenges
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      (PRO Feature) The platform hosts seasonal challenges (e.g., "Read 5 Sci-Fi books in June"). The backend tracking engine automatically cross-references your completed books with challenge parameters to update your leaderboard ranking.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Monetization */}
            {activeTab === "monetization" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                    <Wallet className="w-6 h-6 text-amber-500" />
                    Economics, Wallets & Monetization
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    BookVerse integrates a seamless, multi-gateway financial system to empower creators and reward quality.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-lg text-white">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-emerald-400">
                      <Star className="w-5 h-5" /> The Subscription Tiers
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                      Access to BookVerse is gated by three tiers, processed securely through our backend entitlement engine.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                        <strong className="text-zinc-300 block mb-1">FREE</strong>
                        <ul className="text-[10px] text-zinc-500 space-y-1 list-disc pl-3">
                          <li>Read infinite free books</li>
                          <li>Write & publish</li>
                          <li>Standard dashboard</li>
                        </ul>
                      </div>
                      <div className="bg-zinc-950 p-4 rounded-xl border border-blue-900/50">
                        <strong className="text-blue-400 block mb-1">PRO READER</strong>
                        <ul className="text-[10px] text-zinc-500 space-y-1 list-disc pl-3">
                          <li>Ad-free experience</li>
                          <li>Reading challenges</li>
                          <li>Offline Vault limit removed</li>
                        </ul>
                      </div>
                      <div className="bg-zinc-950 p-4 rounded-xl border border-amber-900/50">
                        <strong className="text-amber-400 block mb-1">CREATOR</strong>
                        <ul className="text-[10px] text-zinc-500 space-y-1 list-disc pl-3">
                          <li>Receive Tips (Monetize)</li>
                          <li>Advanced Analytics</li>
                          <li>Newsletter Engine</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Coins className="w-5 h-5 text-emerald-500" /> Tipping Engine & BDT Conversion
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      BookVerse supports micro-transactions. Readers can send 'Tips' directly to an author's story.
                    </p>
                    <ul className="space-y-3 text-xs text-zinc-500">
                      <li><strong>Wallet Setup:</strong> In your Wallet page, configure your <strong>bKash</strong> and <strong>Nagad</strong> personal numbers.</li>
                      <li><strong>The Unified Ledger:</strong> Every transaction (tips received, tips sent, subscription fees) is logged immutably in your ledger. The system displays all amounts unified in BDT (Bangladeshi Taka).</li>
                      <li><strong>Payout Cycles:</strong> Tips are aggregated and disbursed to your registered mobile financial service (MFS) number automatically.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics */}
            {activeTab === "analytics" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-indigo-500" />
                    Advanced Telemetry & Analytics
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    Available exclusively to the <strong>Creator Tier</strong>, our analytics engine processes millions of reading events to provide actionable insights.
                  </p>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm mb-6">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-4">The Performance Registry</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                    We don't just track "views." We track human behavior.
                  </p>

                  <div className="space-y-4">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-xl border-l-2 border-rose-500">
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Reader Drop-off Matrix (Cohort Retention)</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        This matrix shows exactly what percentage of readers make it from Chapter 1 to Chapter 2, 3, etc. If you see a massive 40% drop-off at Chapter 4, you know exactly where your story pacing needs to be rewritten.
                      </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-xl border-l-2 border-indigo-500">
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Focus Index</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Tracks the average session duration and pages read per session. A high Focus Index (e.g., 45 minutes / 30 pages) means readers are binge-reading, indicating high immersion.
                      </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-xl border-l-2 border-emerald-500">
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Viral Amplification</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Measures how often your story is shared off-platform (Twitter, Facebook, WhatsApp) compared to its total views. Identifies if a book is becoming a viral sensation organically.
                      </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-xl border-l-2 border-amber-500">
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Audience Sentiment & Annotation Heatmaps</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        We aggregate reaction data (likes, laughs, mind-blown) and highlight data. See precisely which paragraphs users are highlighting in yellow vs. green. This tells you which quotes resonate the most.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </section>
        </div>
      </div>
    </main>
  );
}
