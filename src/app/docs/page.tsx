"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Settings,
  Clock,
  ArrowRight,
  ArrowLeft,
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
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Simple Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Documentation.</h1>
              <p className="text-sm text-zinc-500 font-medium">Master the BookVerse ecosystem, algorithms, and payouts.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded">
            BookVerse Guide
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-20">

          {/* Sidebar Navigation */}
          <aside>
            <nav className="flex flex-col gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded transition-all group ${activeTab === tab.id
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md'
                    : 'text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-inherit' : 'text-zinc-200 group-hover:text-inherit'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
                  </div>
                  {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <section className="max-w-3xl">

            {/* Getting Started */}
            {activeTab === "getting-started" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-200 dark:border-zinc-900">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Introduction & Platform Overview</h2>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase">Purpose, benefits, and future roadmap of BookVerse.</p>
                </div>

                <div className="space-y-8">
                  {/* What is it & What you can do */}
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">What is BookVerse?</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                      BookVerse is a next-generation digital reading and publishing ecosystem designed to bridge the gap between passionate readers and visionary authors. We provide a premium, distraction-free environment for consuming serialized fiction, alongside professional-grade tools for writers to publish, monetize, and scale their audience.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/30">
                        <BookOpen className="w-5 h-5 text-emerald-500 mb-2" />
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-1 uppercase tracking-widest">Read & Discover</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">Immerse yourself in thousands of novels with dynamic typography, offline vaulting, and an intelligent recommendation engine.</p>
                      </div>
                      <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/30">
                        <PenTool className="w-5 h-5 text-rose-500 mb-2" />
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-1 uppercase tracking-widest">Write & Publish</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">Use our advanced Creator Studio to organize universes, write drafts, co-author with friends, and instantly publish to a global audience.</p>
                      </div>
                      <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/30">
                        <Wallet className="w-5 h-5 text-green-500 mb-2" />
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-1 uppercase tracking-widest">Earn & Monetize</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">Turn your passion into profit. Receive direct tips from readers, run internal ad campaigns, and earn through our transparent Creator Tier payouts.</p>
                      </div>
                      <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/30">
                        <Users className="w-5 h-5 text-blue-500 mb-2" />
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-1 uppercase tracking-widest">Connect & Guilds</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">Join vibrant Book Clubs, form Fan Guilds, and interact directly with authors through inline reactions, polls, and dedicated forums.</p>
                      </div>
                    </div>
                  </div>

                  {/* Why use it / Benefits */}
                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Why Choose BookVerse? (Platform Benefits)</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs text-zinc-900 dark:text-white block mb-0.5 uppercase tracking-wider">Premium Aesthetics & UX</strong>
                          <p className="text-xs text-zinc-500">Unlike legacy platforms, BookVerse prioritizes a modern, ad-free (for Pro), and lightning-fast reading experience with highly customizable themes and dyslexia-friendly typography.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <TrendingUp className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs text-zinc-900 dark:text-white block mb-0.5 uppercase tracking-wider">Velocity-Based Fair Algorithm</strong>
                          <p className="text-xs text-zinc-500">Our algorithm rewards consistency and actual read-through rates, meaning new authors can easily reach the front page without competing against decade-old established books.</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Shield className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs text-zinc-900 dark:text-white block mb-0.5 uppercase tracking-wider">Author Sovereignty & Safety</strong>
                          <p className="text-xs text-zinc-500">Complete control over your content. Advanced moderation tools, shadowbanning, and automated review-bomb protection keep your comment sections healthy.</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* How to Get Started */}
                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">How to Get Started</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* For Readers */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" /> For Readers
                        </h4>
                        <ul className="space-y-3 text-xs text-zinc-500">
                          <li className="flex gap-3">
                            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold shrink-0">1</span>
                            <span className="leading-relaxed"><strong>Create an Account:</strong> Sign up using Google or Email. Set up your profile and configure your reading typography.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold shrink-0">2</span>
                            <span className="leading-relaxed"><strong>Browse the Library:</strong> Explore the homepage, check the trending charts, or use the intelligent search to find your first book.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold shrink-0">3</span>
                            <span className="leading-relaxed"><strong>Save to Vault:</strong> Add stories to your Library Vault for offline reading, syncing, and automatic chapter update notifications.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold shrink-0">4</span>
                            <span className="leading-relaxed"><strong>Engage:</strong> Leave comments, highlight your favorite quotes, cast votes, and tip the authors you love.</span>
                          </li>
                        </ul>
                      </div>

                      {/* For Authors */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-rose-500 flex items-center gap-2">
                          <PenTool className="w-4 h-4" /> For Authors
                        </h4>
                        <ul className="space-y-3 text-xs text-zinc-500">
                          <li className="flex gap-3">
                            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold shrink-0">1</span>
                            <span className="leading-relaxed"><strong>Access Creator Studio:</strong> Click "Write" in the top navigation to enter your private author dashboard.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold shrink-0">2</span>
                            <span className="leading-relaxed"><strong>Create a Universe:</strong> Define your overarching lore, characters, and invite co-authors if collaborating.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold shrink-0">3</span>
                            <span className="leading-relaxed"><strong>Publish Chapters:</strong> Use the rich-text editor to write, format, save drafts, and schedule your chapter releases.</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold shrink-0">4</span>
                            <span className="leading-relaxed"><strong>Monetize:</strong> Setup your payout options in settings. Build your audience and track your real-time earnings in the Wallet tab.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* System & Device Support */}
                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Supported Devices & Accessibility</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/30">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-1 uppercase tracking-widest flex items-center gap-2"><Globe className="w-4 h-4 text-zinc-400" /> Desktop Web</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">Optimized for Chrome, Firefox, and Safari. Features our full widescreen reading experience and the comprehensive Creator Studio for writing.</p>
                      </div>
                      <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/30">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-1 uppercase tracking-widest flex items-center gap-2"><Download className="w-4 h-4 text-zinc-400" /> Mobile PWA</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">Install via your mobile browser's "Add to Home Screen". Functions exactly like a native app with push notifications and offline vault access.</p>
                      </div>
                      <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/30">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-1 uppercase tracking-widest flex items-center gap-2"><Settings className="w-4 h-4 text-zinc-400" /> Accessibility</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">Built-in Dyslexia-friendly fonts (OpenDyslexic), adjustable line heights, strict contrast modes, and full screen-reader compatibility.</p>
                      </div>
                    </div>
                  </div>

                  {/* New User Quick Tips */}
                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Quick Tips for New Users</h3>
                    <div className="space-y-3">
                      <div className="flex gap-3 items-start p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20">
                        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs text-indigo-900 dark:text-indigo-400 block mb-0.5">Customize Your Reading Theme</strong>
                          <p className="text-xs text-indigo-700 dark:text-indigo-300">Click the gear icon while reading any chapter to switch between Light, Dark, Sepia, and AMOLED Black modes. Your preference is saved globally across devices.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 items-start p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                        <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs text-emerald-900 dark:text-emerald-400 block mb-0.5">Understanding "Velocity" for Authors</strong>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300">Publishing 1 chapter a day for 7 days boosts your algorithm ranking significantly more than publishing 7 chapters on a single day. Consistency is heavily rewarded.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 items-start p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20">
                        <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs text-amber-900 dark:text-amber-400 block mb-0.5">Enable Two-Factor Authentication</strong>
                          <p className="text-xs text-amber-700 dark:text-amber-300">Head to Settings &gt; Profile to enable 2FA. This is highly recommended to secure your library and protect your Creator Wallet earnings.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Platform Values */}
                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Our Core Values</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm">
                        <Heart className="w-4 h-4 text-rose-500 mb-2" />
                        <strong className="text-xs text-zinc-900 dark:text-white block mb-1 uppercase tracking-wider">Respect the Craft</strong>
                        <p className="text-xs text-zinc-500">Constructive criticism is welcome. Toxicity and review bombing are strictly prohibited and immediately moderated.</p>
                      </div>
                      <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm">
                        <ShieldAlert className="w-4 h-4 text-amber-500 mb-2" />
                        <strong className="text-xs text-zinc-900 dark:text-white block mb-1 uppercase tracking-wider">Protect Originality</strong>
                        <p className="text-xs text-zinc-500">Zero tolerance for plagiarism and unauthorized AI-scraped generation. Original human creation is fiercely protected.</p>
                      </div>
                      <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm">
                        <Scale className="w-4 h-4 text-blue-500 mb-2" />
                        <strong className="text-xs text-zinc-900 dark:text-white block mb-1 uppercase tracking-wider">Fair Revenue</strong>
                        <p className="text-xs text-zinc-500">We believe authors deserve the lion's share of the value they create. Our payout splits are highly competitive.</p>
                      </div>
                    </div>
                  </div>

                  {/* Future Works */}
                  <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800">
                    <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-indigo-400">
                      <Globe className="w-4 h-4" /> The Future Roadmap
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                      We are continuously evolving. Here is what we are actively building for the next major phases of BookVerse:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-black/40 rounded-lg border border-zinc-800/60">
                        <strong className="block text-zinc-200 mb-1">Native Mobile Applications</strong>
                        <span className="text-zinc-500">Fully native iOS and Android apps with lock-screen audio controls and enhanced offline storage.</span>
                      </div>
                      <div className="p-3 bg-black/40 rounded-lg border border-zinc-800/60">
                        <strong className="block text-zinc-200 mb-1">AI-Powered Audiobooks</strong>
                        <span className="text-zinc-500">Auto-generate high-quality, emotionally expressive audiobook narration for all published stories.</span>
                      </div>
                      <div className="p-3 bg-black/40 rounded-lg border border-zinc-800/60">
                        <strong className="block text-zinc-200 mb-1">Print-on-Demand Logistics</strong>
                        <span className="text-zinc-500">Allow readers to order physical paperback copies of their favorite stories directly from the app.</span>
                      </div>
                      <div className="p-3 bg-black/40 rounded-lg border border-zinc-800/60">
                        <strong className="block text-zinc-200 mb-1">Interactive Visual Novels</strong>
                        <span className="text-zinc-500">Support for branching storylines, character portraits, and background music integration.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reading & Library */}
            {activeTab === "reading" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-200 dark:border-zinc-900">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Reading Experience & Vault</h2>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase">Typography, offline synchronization, and highlights.</p>
                </div>

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
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-200 dark:border-zinc-900">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Creator Studio & Co-Authoring</h2>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase">Narrative structures and interactive storytelling.</p>
                </div>

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
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-200 dark:border-zinc-900">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Marketing & Audience Growth</h2>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase">Scale your audience and maximize visibility.</p>
                </div>

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
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-200 dark:border-zinc-900">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Community & Social Architecture</h2>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase">Guilds, comments, and reader expectations.</p>
                </div>

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
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-200 dark:border-zinc-900">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Economy, Wallets & Tiers</h2>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase">Turn passion into profit. Payout logistics and subscriptions.</p>
                </div>

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
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-200 dark:border-zinc-900">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Advanced Telemetry & Analytics</h2>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase">Audience retention and interaction heatmapping.</p>
                </div>

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
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="pb-6 border-b border-zinc-200 dark:border-zinc-900">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">Trust, Safety & Compliance</h2>
                  <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase">Content ratings, DMCA, and appeals.</p>
                </div>

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
          </section>
        </div>
      </div>
    </main>
  );
}
