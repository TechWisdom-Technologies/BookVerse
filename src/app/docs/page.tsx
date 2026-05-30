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
                    Getting Started & Platform Architecture
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    BookVerse is a high-performance, full-stack literary ecosystem. It seamlessly bridges the gap between casual reading and professional publishing. Understanding the underlying mechanics is essential to maximizing your experience.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">Authentication & Identity</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      BookVerse utilizes a secure, stateless authentication mechanism. When you register or log in (via Google or Email), a secure session is established across all devices.
                    </p>
                    <ul className="space-y-3 text-xs text-zinc-500 list-disc pl-5">
                      <li><strong>Account Archetypes:</strong> Every user begins as a <em>Reader</em>. By navigating to the Author Studio and publishing your first work, your account dynamically unlocks <em>Author</em> privileges (dashboard access, analytics, monetization).</li>
                      <li><strong>Profile Optimization:</strong> Your profile (`/profile/[username]`) is public. High-resolution avatars, a polished bio, and curated reading shelves act as your digital resume. Authors with fully completed profiles experience a 40% higher organic follow rate.</li>
                      <li><strong>Privacy Controls:</strong> Within <strong>Settings</strong>, you maintain granular control over data visibility. You can toggle your reading history, current reading list, and follower counts between Public and Private states.</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">The Omni-Search Infrastructure</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      Finding content on BookVerse is powered by a custom indexing engine designed for literary discovery. The Omni-Search bar is accessible globally via the top navigation.
                    </p>
                    <ul className="space-y-3 text-xs text-zinc-500">
                      <li className="flex gap-2 items-start"><Search className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" /> <strong>Fuzzy Matching:</strong> The engine automatically corrects minor typos and searches across Book Titles, Author Names, Series Names, and Universes simultaneously.</li>
                      <li className="flex gap-2 items-start"><Globe className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" /> <strong>Tag-Based Filtering:</strong> You can execute advanced queries by clicking on Genre Tags. Combining tags (e.g., #Sci-Fi + #Cyberpunk) narrows the database to highly specific intersections.</li>
                      <li className="flex gap-2 items-start"><Menu className="w-4 h-4 shrink-0 mt-0.5 text-zinc-500" /> <strong>Global Dock & Sidebar:</strong> Desktop users benefit from the Global Dock for rapid switching between Library and Discovery, while the unified Sidebar (accessed via your Avatar) houses core administrative functions.</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">Real-Time Event Streams</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      The BookVerse notification system is asynchronous and real-time. You are subscribed to event streams based on your network graph. You receive immediate alerts for: new chapter publications from followed authors, direct replies to your comments, virtual gifts received, and daily reading streak reminders.
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
                    BookVerse has engineered a distraction-free, customizable reading interface. Learn how to manage your digital library, leverage offline capabilities, and track your reading habits.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm md:col-span-2">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-indigo-500">
                      <BookMarked className="w-5 h-5" /> The Advanced PDF & Text Engine
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      Whether you are reading a web-novel format or a full PDF book, BookVerse utilizes highly optimized rendering engines to handle massive documents smoothly.
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-500 list-disc pl-5">
                      <li><strong>Zoom & Pan:</strong> Intelligently scales PDF pages without losing resolution.</li>
                      <li><strong>State Persistence:</strong> The platform remembers exactly which chapter or page you were on. If you leave and return to a book, you'll resume from the exact same spot.</li>
                      <li><strong>Customization:</strong> Adjust font sizes, line spacing, and switch between light, dark, and sepia themes for web-novels to prevent eye strain.</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-500" /> Offline Reading Vault
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Going on a flight? Commuting? You can cache stories directly to your device. Navigate to any story, click "Save for Offline", and it will be stored securely in your browser's IndexedDB. Access them anytime from the <strong>Offline Stories</strong> tab in your profile menu, even with airplane mode on! Note: Pro Readers have no limits on offline storage.
                    </p>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-500" /> Reading Stats & Analytics
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Visit your <strong>Reading Stats</strong> dashboard to see your literary journey visualized. We track your total pages read, books completed, and favorite genres. Watch your reading streak grow day by day, and earn special profile badges for hitting reading milestones.
                    </p>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm md:col-span-2">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">The Personal Shelf Architecture</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Your Library (Shelf) is your command center. It tracks your exact reading progress percentages (e.g., 45% complete). You can organize books into custom folders or tags. When you finish a book, it moves to your "Completed" section, contributing to your global reading stats and Reading Challenge metrics.
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
                        <strong className="uppercase tracking-widest block mb-2 text-emerald-300 text-[11px] flex items-center gap-2"><BookOpen className="w-4 h-4" /> Tier 3: Stories & Books</strong>
                        <span className="text-zinc-400 text-xs">The actual novel. A story can be a serial web-novel with chapters, or a single uploaded PDF Book. It can be assigned to a Series, a Universe, both, or neither (Standalone).</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                      <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                        <PenTool className="w-4 h-4 text-indigo-500" /> The Manuscript Editor vs PDF Upload
                      </h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Authors have two choices: write directly in our rich-text editor (perfect for episodic serials) or upload a finished PDF (perfect for traditional books). The editor automatically calculates reading times based on word count, and allows drag-and-drop chapter reordering.
                      </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                      <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500" /> AI Covers & Illustrations
                      </h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Struggling with art? Our integrated AI pipelines can generate a beautiful cover image for your story instantly based on your prompt. For web-novel chapters, you can also generate specific chapter illustrations to enhance the reading experience.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">Publishing Requirements & DMCA</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      Before a story goes live and enters the global search index, it must meet strict metadata standards. Furthermore, all content is subject to our DMCA policy.
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-500 list-disc pl-5">
                      <li><strong>Synopsis & Tags:</strong> At least 150 characters to engage readers. Select primary genres (Fantasy, Sci-Fi) and custom tags to fuel the recommendation engine.</li>
                      <li><strong>Status:</strong> Mark as 'Ongoing', 'Completed', or 'Hiatus'.</li>
                      <li><strong>Copyright:</strong> Do not upload copyrighted works that you do not own. Our DMCA takedown process is active and heavily monitored.</li>
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
                      The Feed is the pulse of BookVerse. Every public action—publishing a book, leaving a 5-star review, achieving a challenge, or unlocking a badge—is broadcasted to the feed.
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-500 list-disc pl-5">
                      <li>Toggle between "Global" (everyone) and "Following" (curated network).</li>
                      <li>Rich embeds allow users to click directly into a book or profile from a feed item.</li>
                      <li>Comment, like, and interact directly on activity updates.</li>
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
                      <Trophy className="w-4 h-4 text-amber-500" /> Reading Challenges & Achievements
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Participate in seasonal Reading Challenges (e.g., "Read 5 Sci-Fi books in June"). The backend tracking engine automatically cross-references your completed books to update your leaderboard ranking. Unlock permanent Profile Achievements and Badges for hitting major milestones.
                    </p>
                  </div>
                  
                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm md:col-span-2">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Gift className="w-4 h-4 text-pink-500" /> Virtual Gifts & Tipping
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Show appreciation for your favorite authors by sending them Virtual Gifts or direct Tips! Gifts appear prominently on the story page and in the author's notifications, providing both financial support and algorithmic boosts to the story.
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
                    BookVerse integrates a robust financial ledger and multi-gateway system, designed to empower creators in Bangladesh and beyond. It transforms reading platforms into sustainable economies.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-lg text-white">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-emerald-400">
                      <Star className="w-5 h-5" /> The Subscription Engine
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                      Access and privileges on BookVerse are gated by a scalable entitlement engine.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                        <strong className="text-zinc-300 block mb-1">FREE</strong>
                        <ul className="text-[10px] text-zinc-500 space-y-1 list-disc pl-3">
                          <li>Infinite reading access</li>
                          <li>Basic author studio</li>
                          <li>Standard community access</li>
                        </ul>
                      </div>
                      <div className="bg-zinc-950 p-4 rounded-xl border border-blue-900/50">
                        <strong className="text-blue-400 block mb-1">PRO READER</strong>
                        <ul className="text-[10px] text-zinc-500 space-y-1 list-disc pl-3">
                          <li>Unlimited Offline Vault caching</li>
                          <li>Exclusive Reading Challenges</li>
                          <li>Zero advertisements</li>
                        </ul>
                      </div>
                      <div className="bg-zinc-950 p-4 rounded-xl border border-amber-900/50">
                        <strong className="text-amber-400 block mb-1">CREATOR</strong>
                        <ul className="text-[10px] text-zinc-500 space-y-1 list-disc pl-3">
                          <li>Unlocks Wallet & Tip receiving</li>
                          <li>Advanced Telemetry & Analytics</li>
                          <li>Direct Newsletter Engine</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Coins className="w-5 h-5 text-emerald-500" /> Tipping, MFS Integration & The Ledger
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      The core of author monetization is the micro-transaction engine, fully integrated with Mobile Financial Services (MFS) popular in Bangladesh.
                    </p>
                    <ul className="space-y-3 text-xs text-zinc-500">
                      <li><strong>Wallet Configuration:</strong> Navigate to your Wallet dashboard to bind your <strong>bKash</strong>, <strong>Nagad</strong>, or <strong>Upay</strong> accounts. The system uses strict validation to ensure numbers are correctly formatted.</li>
                      <li><strong>Immutable Ledger:</strong> Every financial action—whether a reader purchases a virtual gift for you, or sends a direct tip—is recorded in an immutable ledger. You can download CSV reports of all transactions for accounting purposes.</li>
                      <li><strong>Payout Cycles:</strong> Funds accumulate in your BookVerse wallet in BDT (Bangladeshi Taka). Upon reaching the minimum threshold (e.g., 500 BDT), the automated disbursement engine processes payouts directly to your connected MFS account at the end of the month.</li>
                      <li><strong>Platform Fee:</strong> To maintain servers and AI resources, BookVerse takes a nominal infrastructure fee on processed tips, clearly itemized in your wallet ledger.</li>
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
                    Available exclusively to the <strong>Creator Tier</strong>, our analytics engine processes millions of reading events to provide actionable, data-driven insights. It is the most powerful tool an author has to refine their craft.
                  </p>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm mb-6">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-4">The Performance Registry: Beyond Page Views</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                    Vanity metrics like "Total Views" are notoriously misleading. The BookVerse engine tracks deeply contextual human behavior, calculating exactly how engaging your manuscript is on a paragraph-by-paragraph basis.
                  </p>

                  <div className="space-y-4">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-xl border-l-2 border-rose-500">
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Reader Drop-off Matrix (Cohort Retention)</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        This matrix calculates the survival rate of your readership. It shows exactly what percentage of readers who start Chapter 1 proceed to Chapter 2, 3, etc. If the data shows a 40% sudden drop-off at Chapter 4, it scientifically pinpoints where your pacing dragged or a plot point failed, telling you exactly what to rewrite.
                      </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-xl border-l-2 border-indigo-500">
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Focus Index & Session Parsing</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        The engine tracks scroll velocity and dwell time to calculate the Focus Index (average session duration and pages read per session). A high Focus Index (e.g., 45 minutes continuous reading) proves readers are binge-reading, signaling high narrative immersion. Low dwell times indicate skimming.
                      </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-xl border-l-2 border-emerald-500">
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Viral Amplification & K-Factor</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Measures the viral coefficient (K-Factor) by tracking how often your story link is shared off-platform (to Facebook, WhatsApp, etc.) compared to internal discovery. A K-Factor above 1.0 means your story is growing exponentially and organically through word-of-mouth.
                      </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-xl border-l-2 border-amber-500">
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Audience Sentiment & Annotation Heatmaps</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        We aggregate micro-interactions (comments, likes, paragraph highlights) into a visual heatmap over your manuscript. See precisely which sentences readers highlighted the most. This instantly reveals which quotes, character interactions, or jokes resonated most powerfully with your audience.
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
