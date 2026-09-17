"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Settings,
  Clock,
  ArrowRight,
  PenTool,
  Users,
  Wallet,
  BarChart3,
  ChevronRight,
  Info,
  BookMarked,
  Sparkles,
  Search,
  Globe,
  Trophy,
  Star,
  Coins,
  Megaphone,
  CalendarClock,
  Shield,
  MessageSquare,
  Gift,
  Layers,
  ShieldAlert,
  AlertTriangle,
  Award,
  RefreshCw,
  Heart,
  TrendingUp,
  Download,
  Lock,
  Mail,
  Zap,
  Globe2,
  PieChart,
  Scale
} from "lucide-react";

type TabId = "getting-started" | "reading" | "writing" | "promotions" | "community" | "monetization" | "analytics" | "safety-admin";

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const TABS: TabConfig[] = [
  { id: "getting-started", label: "Getting Started", icon: Settings, description: "Account Setup, Security & Navigation" },
  { id: "reading", label: "Reading & Library", icon: BookOpen, description: "Sync, Offline Vault & Accessibility" },
  { id: "writing", label: "Writing & Publishing", icon: PenTool, description: "Editor, Co-Authoring & Drafts" },
  { id: "promotions", label: "Marketing & Growth", icon: Megaphone, description: "Trending Algorithm & Ads" },
  { id: "community", label: "Social & Community", icon: Users, description: "Clubs, Guilds & Moderation" },
  { id: "monetization", label: "Earning & Wallets", icon: Wallet, description: "Payouts, Taxes & Tiers" },
  { id: "analytics", label: "Author Analytics", icon: BarChart3, description: "Retention, Heatmaps & Telemetry" },
  { id: "safety-admin", label: "Trust & Safety", icon: ShieldAlert, description: "DMCA, Appeals & Content Ratings" },
];

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState<TabId>("getting-started");

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-16">

        {/* Hero Header */}
        <header className="mb-16 pb-12 border-b border-zinc-200 dark:border-zinc-800/60 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-2 text-xs font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 w-fit px-3 py-1.5 rounded-full">
              <BookOpen className="w-4 h-4" />
              BookVerse Official Documentation
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
              The Definitive Guide.
            </h1>
            <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              Master the BookVerse ecosystem. From optimizing your typography to mastering the Trending Algorithm and understanding the creator payout architecture, this comprehensive knowledge base has you covered.
            </p>
          </div>

          <div className="shrink-0 flex gap-4">
            <Link href="/write/dashboard" className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl text-sm transition-all hover:scale-105 shadow-lg">
              Creator Dashboard
            </Link>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">

          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-80 shrink-0 space-y-2 lg:sticky lg:top-24 z-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-6 px-4">Documentation Modules</h3>
            <nav className="flex flex-col gap-2.5">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-start w-full p-4 rounded-2xl transition-all duration-300 border text-left ${activeTab === tab.id
                    ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 shadow-xl shadow-zinc-200/20 dark:shadow-none scale-[1.02]"
                    : "bg-transparent border-transparent text-zinc-500 hover:bg-zinc-200/50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                        <tab.icon className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-bold ${activeTab === tab.id ? 'text-zinc-900 dark:text-white' : ''}`}>{tab.label}</span>
                    </div>
                    {activeTab === tab.id && <ChevronRight className="w-4 h-4 text-indigo-500" />}
                  </div>
                  <span className={`text-xs font-medium pl-11 leading-relaxed ${activeTab === tab.id ? "text-zinc-500" : "text-zinc-400"}`}>
                    {tab.description}
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <section className="flex-1 min-w-0">
            <div className="bg-white dark:bg-zinc-950 rounded-3xl p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 shadow-sm">

              {/* Getting Started */}
              {activeTab === "getting-started" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <header className="border-b border-zinc-100 dark:border-zinc-800/60 pb-8">
                    <h2 className="text-3xl font-black tracking-tight mb-4 flex items-center gap-4 text-zinc-900 dark:text-white">
                      <Settings className="w-8 h-8 text-indigo-500" />
                      Getting Started & Architecture
                    </h2>
                    <p className="text-zinc-500 text-base leading-relaxed">
                      Welcome to the BookVerse ecosystem. This module covers account initialization, algorithmic personalization, and data security protocols.
                    </p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl shrink-0"><Lock className="w-5 h-5 text-indigo-500" /></div>
                        <div>
                          <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Account Security & Verification</h3>
                          <p className="text-sm text-zinc-500 leading-relaxed mb-3">
                            BookVerse employs enterprise-grade security for your library and financial data. We highly recommend enabling Two-Factor Authentication (2FA) in your Account Settings. Authors earning over $500/month must complete Identity Verification (KYC) to comply with international payout regulations.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl shrink-0"><Zap className="w-5 h-5 text-indigo-500" /></div>
                        <div>
                          <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">The Recommendation Engine</h3>
                          <p className="text-sm text-zinc-500 leading-relaxed">
                            Our proprietary discovery algorithm (BookBrain™) analyzes over 40 data points including your read velocity, chapter drop-off rates, and tag interactions. It continually adapts your homepage feed. The more you interact with stories via comments and votes, the more accurate your customized feed becomes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-800">
                      <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-zinc-400" /> Platform Architecture
                      </h3>
                      <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
                        <li className="flex gap-3">
                          <span className="font-bold text-zinc-900 dark:text-white min-w-[80px]">Web App</span>
                          Optimized for ultra-fast chapter loading and immersive wide-screen reading. Perfect for authors in the Creator Studio.
                        </li>
                        <li className="flex gap-3">
                          <span className="font-bold text-zinc-900 dark:text-white min-w-[80px]">Mobile PWA</span>
                          Install BookVerse directly to your home screen. Features offline caching and background synchronization for uninterrupted reading during commutes.
                        </li>
                        <li className="flex gap-3">
                          <span className="font-bold text-zinc-900 dark:text-white min-w-[80px]">API Access</span>
                          Enterprise partners can access our RESTful GraphQL API for headless integration. (Requires Pro Tier API Key).
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Reading & Library */}
              {activeTab === "reading" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <header className="border-b border-zinc-100 dark:border-zinc-800/60 pb-8">
                    <h2 className="text-3xl font-black tracking-tight mb-4 flex items-center gap-4 text-zinc-900 dark:text-white">
                      <BookOpen className="w-8 h-8 text-emerald-500" />
                      Reading Experience & Vault
                    </h2>
                    <p className="text-zinc-500 text-base leading-relaxed">
                      Engineered for maximum immersion. Discover how to customize typography, manage offline synchronization, and leverage the Highlight Engine.
                    </p>
                  </header>

                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 p-6 rounded-2xl">
                        <BookMarked className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-4" />
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-2">The Highlight Engine</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Select any text to trigger the multi-color highlight tool. All highlights are indexed in your personal Library Vault. You can export highlights as Markdown files or share them as stylized quote-cards directly to Twitter/X.
                        </p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 p-6 rounded-2xl">
                        <Download className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-4" />
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Offline Vault Sync</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Click "Save to Vault" on any series. Our background service worker will silently download all chapters and images. Progression made offline automatically syncs back to the cloud the moment a network connection is restored.
                        </p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 p-6 rounded-2xl">
                        <Settings className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-4" />
                        <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Dynamic Typography</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          Full control over your sensory experience. Adjust line-height, margin width, and font families (including Dyslexic-friendly fonts). The auto-dark mode leverages ambient light sensors to prevent eye strain.
                        </p>
                      </div>
                    </div>

                    <div className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" /> Gamification & Telemetry
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                        BookVerse tracks your reading velocity and consistency. Daily Streaks require reading 500 words or spending 5 minutes active in the reader. Consistently maintaining streaks unlocks profile frames, exclusive avatars, and "Top Reader" badges that appear next to your comments.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Writing & Publishing */}
              {activeTab === "writing" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <header className="border-b border-zinc-100 dark:border-zinc-800/60 pb-8">
                    <h2 className="text-3xl font-black tracking-tight mb-4 flex items-center gap-4 text-zinc-900 dark:text-white">
                      <PenTool className="w-8 h-8 text-rose-500" />
                      Creator Studio & Co-Authoring
                    </h2>
                    <p className="text-zinc-500 text-base leading-relaxed">
                      A professional-grade environment for managing complex narrative structures, collaborative editing, and interactive storytelling.
                    </p>
                  </header>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Hierarchical Organization</h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                          BookVerse utilizes a strict 3-tier architectural model to ensure scalable catalog management for prolific authors.
                        </p>
                        <ul className="space-y-6">
                          <li className="relative pl-6 border-l-2 border-rose-500">
                            <h4 className="font-bold text-zinc-900 dark:text-white mb-1">1. Canon Universes</h4>
                            <p className="text-xs text-zinc-500">The overarching IP container (e.g., "The Cosmere"). Universes dictate global settings, co-author permissions, and overarching genre tags.</p>
                          </li>
                          <li className="relative pl-6 border-l-2 border-amber-500">
                            <h4 className="font-bold text-zinc-900 dark:text-white mb-1">2. Sequential Series</h4>
                            <p className="text-xs text-zinc-500">Directly linked narratives that require sequential reading. The algorithm uses this to auto-queue the next book.</p>
                          </li>
                          <li className="relative pl-6 border-l-2 border-emerald-500">
                            <h4 className="font-bold text-zinc-900 dark:text-white mb-1">3. Standalone Stories</h4>
                            <p className="text-xs text-zinc-500">Individual manuscripts. Supports Markdown, rich-text WYSIWYG editing, and direct ePub/PDF ingest.</p>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-2xl">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-rose-400">
                          <Users className="w-5 h-5" /> Co-Authoring & Royalties
                        </h3>
                        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                          Invite collaborators to your Universe via the dashboard. When a story is co-authored, you can establish an automated Royalty Split.
                          For example, if you set a 60/40 split, any Tips or Ad Revenue generated by that specific story is automatically distributed to both authors' wallets in real-time.
                        </p>
                        <div className="p-4 bg-black/40 rounded-xl border border-zinc-800">
                          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Version Control</h4>
                          <p className="text-xs text-zinc-400">Our editor includes basic Git-style revision history. You can rollback to any previous save state up to 30 days old.</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Interactive Chapter Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                          <strong className="block text-sm text-zinc-900 dark:text-white mb-2">In-Line Reactions</strong>
                          <p className="text-xs text-zinc-500">Allow readers to leave timestamped comments on specific paragraphs, generating highly localized feedback for beta testing.</p>
                        </div>
                        <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                          <strong className="block text-sm text-zinc-900 dark:text-white mb-2">Branching Polls</strong>
                          <p className="text-xs text-zinc-500">Embed verified polls at the end of a chapter. Use audience consensus to determine the direction of the next chapter's plot.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Promotions & Marketing */}
              {activeTab === "promotions" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <header className="border-b border-zinc-100 dark:border-zinc-800/60 pb-8">
                    <h2 className="text-3xl font-black tracking-tight mb-4 flex items-center gap-4 text-zinc-900 dark:text-white">
                      <Megaphone className="w-8 h-8 text-amber-500" />
                      Marketing & Audience Growth
                    </h2>
                    <p className="text-zinc-500 text-base leading-relaxed">
                      Decoding the BookVerse algorithms. Learn how to systematically scale your audience, utilize internal ad networks, and maximize visibility.
                    </p>
                  </header>

                  <div className="space-y-8">
                    <div className="p-8 bg-amber-50 dark:bg-amber-500/5 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-amber-600" /> The Trending Algorithm Exposed
                      </h3>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                        Trending placement is not based on total all-time views. It is a velocity-based metric calculated using a proprietary formula. To rank on the front page, focus on these heavily weighted vectors:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm">
                          <strong className="block text-sm text-zinc-900 dark:text-white mb-1">1. Update Velocity (High Weight)</strong>
                          <p className="text-xs text-zinc-500">Consistent, scheduled updates (e.g., every Tuesday/Thursday) score drastically higher than erratic mass-dumps.</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm">
                          <strong className="block text-sm text-zinc-900 dark:text-white mb-1">2. Read-Through Rate (RTR)</strong>
                          <p className="text-xs text-zinc-500">If 100 people click your book and 80 finish Chapter 1, your high RTR will skyrocket you above books with million views but terrible retention.</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm">
                          <strong className="block text-sm text-zinc-900 dark:text-white mb-1">3. Financial Engagement</strong>
                          <p className="text-xs text-zinc-500">Tips, gifts, and premium unlocks act as massive multipliers. A single $5 tip weighs heavier than 500 standard page views.</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm">
                          <strong className="block text-sm text-zinc-900 dark:text-white mb-1">4. External Amplification</strong>
                          <p className="text-xs text-zinc-500">Links clicked from Twitter/Facebook into BookVerse bypass internal competition and add a viral coefficient multiplier to your rank.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Automated Newsletters</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                          (Creator Tier Exclusive). When you publish a major milestone or start a new series, you can trigger an automated HTML email newsletter to all your followers. You have complete control over the subject line and preview text.
                        </p>
                      </div>
                      <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">Internal Ad Campaigns</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                          Reinvest your wallet balance to buy "Featured" slots on the homepage or within the Genre Matchmaker. The dashboard provides detailed CPA (Cost Per Acquisition) and ROI tracking for your ads.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Social & Community */}
              {activeTab === "community" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <header className="border-b border-zinc-100 dark:border-zinc-800/60 pb-8">
                    <h2 className="text-3xl font-black tracking-tight mb-4 flex items-center gap-4 text-zinc-900 dark:text-white">
                      <Users className="w-8 h-8 text-blue-500" />
                      Community & Social Architecture
                    </h2>
                    <p className="text-zinc-500 text-base leading-relaxed">
                      Leverage BookVerse's massive social graph. Establish guilds, moderate your comment sections, and manage reader expectations.
                    </p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-blue-500" /> Book Clubs & Guilds
                        </h3>
                        <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                          Readers can form independent Book Clubs with dedicated moderation tools, private forums, and "Book of the Month" integrations. Authors can establish verified "Fan Guilds" which serve as official headquarters for their readers, complete with announcements and exclusive Q&A threads.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2">
                          <Globe2 className="w-5 h-5 text-blue-500" /> The Activity Feed
                        </h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                          A real-time, chronological feed. Unlike algorithmic social media, the BookVerse feed guarantees your followers see 100% of your chapter updates, status posts, and book recommendations without artificial suppression.
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-zinc-900 text-white rounded-2xl shadow-xl border border-zinc-800">
                      <h3 className="text-lg font-bold mb-4 text-blue-400">Author Moderation Tools</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                        Your book is your territory. You have absolute sovereignty over your comment sections and reviews.
                      </p>
                      <ul className="space-y-3">
                        <li className="p-3 bg-black/40 rounded-lg text-sm border border-zinc-800">
                          <strong className="block text-white mb-1">Shadowbanning</strong> Silently mute disruptive users. They can still comment, but no one else will ever see it.
                        </li>
                        <li className="p-3 bg-black/40 rounded-lg text-sm border border-zinc-800">
                          <strong className="block text-white mb-1">Review Bomb Protection</strong> Our AI automatically flags and isolates sudden influxes of 1-star reviews from accounts with no read-history on your book.
                        </li>
                        <li className="p-3 bg-black/40 rounded-lg text-sm border border-zinc-800">
                          <strong className="block text-white mb-1">Spoiler Tags</strong> Force-collapse comments containing spoilers. Repeat offenders can be automatically filtered.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Monetization */}
              {activeTab === "monetization" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <header className="border-b border-zinc-100 dark:border-zinc-800/60 pb-8">
                    <h2 className="text-3xl font-black tracking-tight mb-4 flex items-center gap-4 text-zinc-900 dark:text-white">
                      <Wallet className="w-8 h-8 text-green-500" />
                      Economy, Wallets & Tiers
                    </h2>
                    <p className="text-zinc-500 text-base leading-relaxed">
                      Turn passion into profit. Understand the ledger infrastructure, regional payout logistics, and subscription tier matrices.
                    </p>
                  </header>

                  <div className="space-y-8">
                    <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30">
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Payout Infrastructure & Logistics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <strong className="text-sm text-zinc-900 dark:text-white block mb-1">Regional Gateways</strong>
                          <p className="text-xs text-zinc-500">We deeply integrate with localized mobile financial services (MFS) including bKash, Nagad, and Upay to bypass exorbitant international wire fees.</p>
                        </div>
                        <div>
                          <strong className="text-sm text-zinc-900 dark:text-white block mb-1">Ledger Cycles (Net-30)</strong>
                          <p className="text-xs text-zinc-500">Revenues generated in January are audited for fraud/chargebacks in February, and disbursed by March 1st. Minimum withdrawal threshold is $10.00 USD.</p>
                        </div>
                        <div>
                          <strong className="text-sm text-zinc-900 dark:text-white block mb-1">Taxation & W-8BEN</strong>
                          <p className="text-xs text-zinc-500">Authors crossing the $600/yr threshold must submit digital tax forms via the dashboard to prevent mandatory 30% withholding.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Subscription Tier Matrix</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                          <h4 className="text-lg font-black uppercase tracking-wider mb-2 text-zinc-500">Free Tier</h4>
                          <p className="text-sm text-zinc-500 leading-relaxed mb-6">The essential BookVerse experience.</p>
                          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                            <li>✓ Unlimited reading access</li>
                            <li>✓ Publish infinite stories</li>
                            <li>✓ Receive reader tips</li>
                            <li>✗ Ad-supported reading</li>
                          </ul>
                        </div>

                        <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border-2 border-blue-500 shadow-md relative">
                          <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl-xl">Pro</div>
                          <h4 className="text-lg font-black uppercase tracking-wider mb-2 text-blue-500">Pro Reader</h4>
                          <p className="text-sm text-zinc-500 leading-relaxed mb-6">For the voracious bibliophile.</p>
                          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                            <li>✓ 100% Ad-Free interface</li>
                            <li>✓ Unlimited Offline Vault</li>
                            <li>✓ Custom reading themes</li>
                            <li>✓ Pro Badge on profile</li>
                          </ul>
                        </div>

                        <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border-2 border-amber-500 shadow-md relative">
                          <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl-xl">Creator</div>
                          <h4 className="text-lg font-black uppercase tracking-wider mb-2 text-amber-500">Creator</h4>
                          <p className="text-sm text-zinc-500 leading-relaxed mb-6">The ultimate author toolkit.</p>
                          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                            <li>✓ Advanced Analytics Dashboard</li>
                            <li>✓ Email Newsletter blasts</li>
                            <li>✓ Sponsor Gift Codes</li>
                            <li>✓ Full financial ledger history</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics */}
              {activeTab === "analytics" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <header className="border-b border-zinc-100 dark:border-zinc-800/60 pb-8">
                    <h2 className="text-3xl font-black tracking-tight mb-4 flex items-center gap-4 text-zinc-900 dark:text-white">
                      <BarChart3 className="w-8 h-8 text-indigo-500" />
                      Advanced Telemetry & Analytics
                    </h2>
                    <p className="text-zinc-500 text-base leading-relaxed">
                      Exclusive to Creator Tier. Master the science of audience retention, cohort analysis, and interaction heatmapping.
                    </p>
                  </header>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border-l-4 border-rose-500">
                          <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><PieChart className="w-4 h-4 text-rose-500" /> Drop-Off Matrix (Retention)</h4>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Visualizes cohort retention across chapters. Identify exactly which chapter causes the highest churn rate. If 40% of readers abandon your book at Chapter 5, you have identified a critical pacing flaw to rewrite.
                          </p>
                        </div>

                        <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl border-l-4 border-indigo-500">
                          <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /> Focus Index (Session Intensity)</h4>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Measures the temporal density of reading sessions. Calculates average minutes spent per chapter and how many consecutive chapters a user consumes before exiting the app.
                          </p>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Granular Telemetry Feeds</h3>
                        <ul className="space-y-4">
                          <li className="flex items-start gap-3">
                            <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-1" />
                            <div>
                              <strong className="text-sm block text-zinc-900 dark:text-white">Highlight Heatmaps</strong>
                              <p className="text-xs text-zinc-500">Overlay an infrared heatmap on your manuscript to see exactly which sentences resonate most, down to the character level.</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <Users className="w-4 h-4 text-blue-500 shrink-0 mt-1" />
                            <div>
                              <strong className="text-sm block text-zinc-900 dark:text-white">Demographic Sorting</strong>
                              <p className="text-xs text-zinc-500">Analyze the age, regional origin, and intersecting genre preferences of your core audience to hyper-target your next ad campaign.</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Trust, Safety & Admin */}
              {activeTab === "safety-admin" && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <header className="border-b border-zinc-100 dark:border-zinc-800/60 pb-8">
                    <h2 className="text-3xl font-black tracking-tight mb-4 flex items-center gap-4 text-zinc-900 dark:text-white">
                      <ShieldAlert className="w-8 h-8 text-rose-600" />
                      Trust, Safety & Compliance
                    </h2>
                    <p className="text-zinc-500 text-base leading-relaxed">
                      Maintaining a secure and legally compliant ecosystem. Policies regarding content ratings, DMCA protection, and moderation appeals.
                    </p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-zinc-400" /> Content Ratings & Filters
                      </h3>
                      <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                        All manuscripts must be accurately tagged with demographic maturity ratings (e.g., YA, Mature, Explicit). Our automated auditing AI scans drafts for extreme violence or explicit phrasing. Failure to properly categorize mature content will result in automatic shadow-filtering and potential account suspension.
                      </p>
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-400">
                        <strong>Note:</strong> Extreme illegal content is reported to relevant authorities immediately via automated hashing databases.
                      </div>
                    </div>

                    <div className="p-6 bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/50 shadow-sm">
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2 text-rose-600 dark:text-rose-400">
                        <Shield className="w-5 h-5" /> DMCA & Intellectual Property
                      </h3>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                        We enforce a zero-tolerance policy for plagiarism. If your copyrighted work has been uploaded without authorization:
                      </p>
                      <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 list-decimal pl-4">
                        <li>File an official DMCA Takedown Notice via the Support Portal.</li>
                        <li>Provide immutable proof of prior publication.</li>
                        <li>Our legal team initiates a 48-hour takedown protocol.</li>
                      </ul>
                      <p className="text-xs mt-4 text-zinc-500">False DMCA claims are subject to counter-notices and potential legal liability under perjury statutes.</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
