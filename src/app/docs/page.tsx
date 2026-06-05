"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Settings,
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
  Heart
} from "lucide-react";

type TabId = "getting-started" | "reading" | "writing" | "promotions" | "community" | "monetization" | "analytics" | "safety-admin";

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const TABS: TabConfig[] = [
  { id: "getting-started", label: "Getting Started", icon: Settings, description: "Account setup & finding books" },
  { id: "reading", label: "Reading & Library", icon: BookOpen, description: "Your shelf, streaks & offline" },
  { id: "writing", label: "Writing & Publishing", icon: PenTool, description: "Creating universes & stories" },
  { id: "promotions", label: "Marketing & Growth", icon: Megaphone, description: "Get more readers & followers" },
  { id: "community", label: "Social & Community", icon: Users, description: "Book clubs & discussions" },
  { id: "monetization", label: "Earning & Wallets", icon: Wallet, description: "Tips, bKash/Nagad & Pro" },
  { id: "analytics", label: "Author Analytics", icon: BarChart3, description: "Understand your audience" },
  { id: "safety-admin", label: "Trust & Safety", icon: ShieldAlert, description: "Guidelines & reporting" },
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
            BookVerse Help Center & Guide
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-4">
            Welcome to BookVerse.
          </h1>
          <p className="text-sm md:text-base text-zinc-500 font-medium max-w-2xl leading-relaxed">
            Your complete guide to reading, writing, and earning on BookVerse. Whether you're here to discover your next favorite novel or publish your own masterpiece, everything you need to know is right here!
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 shrink-0 space-y-2 lg:sticky lg:top-24 z-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6 px-4 italic">Help Topics</h3>
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
                    Getting Started & Basics
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    Welcome aboard! Learn how to set up your profile, find amazing stories, and navigate BookVerse like a pro.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">Setting Up Your Profile</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      Your profile is your home on BookVerse. A great profile helps you connect with other readers and authors!
                    </p>
                    <ul className="space-y-3 text-xs text-zinc-500 list-disc pl-5">
                      <li><strong>Avatar & Bio:</strong> Go to your settings to upload a fun profile picture and write a short bio about what you love to read.</li>
                      <li><strong>Onboarding Quiz:</strong> When you first join, we ask about your favorite genres. We use this to magically recommend the perfect books for you on your homepage!</li>
                      <li><strong>Public vs. Private:</strong> You can choose to show off your reading library to the world, or keep it totally private in your account settings.</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">Finding Your Next Great Read</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      With thousands of stories, our search tools make finding your next obsession super easy.
                    </p>
                    <ul className="space-y-3 text-xs text-zinc-500">
                      <li className="flex gap-2 items-start"><Search className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" /> <strong>The Search Bar:</strong> Type in a book title, an author's name, or even a series name. Our smart search will find it instantly!</li>
                      <li className="flex gap-2 items-start"><Globe className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" /> <strong>Using Tags:</strong> Want a "Sci-Fi" story with "Enemies to Lovers"? Just click on the tags! You can combine tags to find exactly what you're in the mood for.</li>
                    </ul>
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
                    Reading & Library
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    BookVerse is designed to give you the most comfortable reading experience possible. Here's how to make the most of it.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm md:col-span-2">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-emerald-500">
                      <Trophy className="w-5 h-5" /> Reading Streaks & Achievements
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      We love rewarding readers! The more you read, the more you level up your profile.
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-500 list-disc pl-5">
                      <li><strong>Daily Streaks:</strong> Read at least a few pages or for 5 minutes a day to keep your reading streak alive. Watch your flame icon grow!</li>
                      <li><strong>Badges:</strong> Complete books to earn beautiful profile badges like "Novice Reader" or "Scholar". Show them off to your friends!</li>
                      <li><strong>Auto-Save:</strong> Never lose your place. If you close the app, we remember exactly which chapter or page you were on.</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <BookMarked className="w-5 h-5 text-indigo-500" /> Highlighting & Notes
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Did you find a quote you absolutely love? Just select the text while reading to highlight it! You can pick your favorite colors and even attach personal notes to your highlights. All your highlights are saved safely in your Library.
                    </p>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-500" /> Offline Reading Vault
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Going on a trip with no internet? Simply click "Save for Offline" on any book. You can then access it from your Offline Vault anytime, anywhere! <em>Note: Pro Readers get unlimited offline storage!</em>
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
                    Writing & Publishing
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    Ready to share your imagination with the world? The Author Studio has everything you need to publish your masterpiece.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-lg text-white">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-4 text-rose-400">Organizing Your Books</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                      BookVerse helps you organize massive epic stories easily using three simple levels:
                    </p>
                    <div className="space-y-4">
                      <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800">
                        <strong className="uppercase tracking-widest block mb-2 text-rose-300 text-[11px] flex items-center gap-2"><Globe className="w-4 h-4" /> 1. Universes</strong>
                        <span className="text-zinc-400 text-xs">The biggest category. Think of it like "The Marvel Universe" where many different stories take place.</span>
                      </div>
                      <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800">
                        <strong className="uppercase tracking-widest block mb-2 text-amber-300 text-[11px] flex items-center gap-2"><Layers className="w-4 h-4" /> 2. Series</strong>
                        <span className="text-zinc-400 text-xs">Books that must be read in order, like "Harry Potter". We'll automatically suggest the next book in the series to your readers!</span>
                      </div>
                      <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800">
                        <strong className="uppercase tracking-widest block mb-2 text-emerald-300 text-[11px] flex items-center gap-2"><BookOpen className="w-4 h-4" /> 3. Stories & Chapters</strong>
                        <span className="text-zinc-400 text-xs">The actual book! You can either write chapters directly in our beautiful text editor, or upload a finished PDF.</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                      <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-500" /> Beta Readers
                      </h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Want some feedback before you officially publish a chapter? You can invite specific friends as "Beta Readers." They get early access to read your drafts and help you improve the story before everyone else sees it!
                      </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                      <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-pink-500" /> Interactive Chapters
                      </h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        At the end of your chapters, you can add fun Polls (e.g., "Who do you think the killer is?"). Also, readers can comment on specific paragraphs to react to big plot twists as they happen!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Promotions */}
            {activeTab === "promotions" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                    <Megaphone className="w-6 h-6 text-amber-500" />
                    Marketing & Getting Readers
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    Writing the book is only half the fun. Here is how you get your story in front of thousands of readers!
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">How to Get on the Trending Page</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                      The homepage features "Trending" stories. BookVerse picks these automatically based on how much readers love your book! Here is what helps you trend:
                    </p>
                    <ul className="space-y-3 text-xs text-zinc-500">
                      <li><strong>Consistent Updates:</strong> Uploading chapters regularly keeps readers coming back, which boosts your rank.</li>
                      <li><strong>Comments & Likes:</strong> Encourage your readers to leave comments and likes! The more they interact, the higher you climb.</li>
                      <li><strong>Tips & Gifts:</strong> When a reader loves your work enough to send a tip or a virtual gift, it gives your story a massive boost on the charts!</li>
                      <li><strong>Sharing:</strong> When your readers share your book link to Facebook or WhatsApp, it tells our system your book is going viral!</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-indigo-500">
                      <CalendarClock className="w-5 h-5" /> Scheduling Chapters
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Don't want to wake up at 3 AM to post a chapter? Use the Scheduler! Write 5 chapters on Sunday, and set them to automatically publish one-by-one every day of the week. When they go live, all your followers instantly get a notification!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Social & Community */}
            {activeTab === "community" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                    <Users className="w-6 h-6 text-blue-500" />
                    Community & Social
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    BookVerse isn't just a library; it's a massive book club. Connect with readers and authors who love what you love!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">Following & The Feed</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Click the "Follow" button on your favorite authors. Whenever they publish a new book, hit a milestone, or post an update, it will appear right on your personalized Activity Feed!
                    </p>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">Book Clubs</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Join a Book Club to discuss your favorite genres! Club admins pick a "Book of the Month", and members can chat in dedicated discussion threads without worrying about spoiling the book for outsiders.
                    </p>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm md:col-span-2">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2">Book Requests</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Are you dying for a sequel? You can submit a "Book Request" to an author! If enough readers request a spin-off, the author might just write it. When they do, you'll be the first to know!
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
                    <Coins className="w-6 h-6 text-amber-500" />
                    Earning & Wallets
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    BookVerse empowers authors to earn a living doing what they love. Here is how our Creator Economy works.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-lg text-white">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-4 text-amber-400 flex items-center gap-2">
                      <Wallet className="w-5 h-5" /> Getting Paid (Tips & Gifts)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <strong className="text-emerald-400 block mb-2 text-sm">Receiving Tips</strong>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Readers can send you money directly using the "Tip Author" button on your story. We support fast, secure payments via <strong>bKash</strong>, <strong>Nagad</strong>, and <strong>Upay</strong>!
                        </p>
                      </div>
                      <div>
                        <strong className="text-pink-400 block mb-2 text-sm">Withdrawing Your Money</strong>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          To get paid, go to your <strong>Wallet</strong> page and add your bKash or Nagad number. Once your earnings reach the minimum amount, we send the money straight to your phone account!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                      <h3 className="text-sm font-black uppercase tracking-wider mb-2 text-zinc-500">Free Tier</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Read infinite stories, publish your own books, and receive tips from readers completely for free!
                      </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-blue-200 dark:border-blue-900 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-blue-500 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-widest rounded-bl-lg">Pro</div>
                      <h3 className="text-sm font-black uppercase tracking-wider mb-2 text-blue-500">Pro Reader</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Perfect for super-readers! Get unlimited offline vault storage so you can read on airplanes, enjoy a 100% ad-free experience, and view your basic wallet balances!
                      </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-amber-200 dark:border-amber-900 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-widest rounded-bl-lg">Creator</div>
                      <h3 className="text-sm font-black uppercase tracking-wider mb-2 text-amber-500">Creator</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        For serious authors. Unlocks the full wallet ledger history, advanced audience analytics, and the ability to send email newsletters to your followers!
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Gift className="w-4 h-4 text-pink-500" /> Gift Memberships
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Want to treat a friend? You can buy them a month of Pro or Creator! You'll receive a special "Gift Code". Tell your friend to go to the "Redeem Gift" page and enter the code to unlock their premium features instantly!
                    </p>
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
                    Author Analytics
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    If you are on the <strong>Creator Tier</strong>, you get access to our powerful Author Dashboard. Learn exactly what your readers love!
                  </p>
                </div>

                <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm mb-6">
                  <h3 className="text-sm font-black uppercase tracking-wider mb-4">Understanding Your Dashboard</h3>

                  <div className="space-y-4">
                    <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-xl border-l-2 border-rose-500">
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Reader Drop-off</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        This tells you exactly where readers stop reading. If 1,000 people read Chapter 1, but only 200 people read Chapter 2, you know exactly where to improve your hook to keep them reading!
                      </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-xl border-l-2 border-indigo-500">
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Reading Time (Focus Index)</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Are people just skimming your chapters, or are they glued to the screen for an hour? This metric tells you how long the average reader spends reading your book in one sitting!
                      </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900 p-5 rounded-xl border-l-2 border-emerald-500">
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2 flex items-center gap-2"><Heart className="w-3 h-3" /> Highlight Heatmaps</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        See exactly which sentences or jokes your readers highlighted the most! This is a great way to figure out which characters or dialogue your fans love the best.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trust, Safety & Admin */}
            {activeTab === "safety-admin" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6 text-rose-600" />
                    Trust & Safety
                  </h2>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                    We want BookVerse to be a safe, welcoming, and fair environment for every reader and writer.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-amber-500">
                      <AlertTriangle className="w-5 h-5" /> Reporting Inappropriate Content
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      If you see a story or a comment that contains hate speech, bullying, or highly inappropriate content without warnings, please click the "Report" flag! Our moderation team reviews these reports daily. If a story gets enough reports, it will be temporarily hidden until we can check it to keep the community safe.
                    </p>
                  </div>

                  <div className="p-6 bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/50 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider mb-2 flex items-center gap-2 text-rose-600 dark:text-rose-400">
                      <Shield className="w-5 h-5" /> Copyright Protection (DMCA)
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                      Authors work incredibly hard on their stories. We take plagiarism and story-theft very seriously.
                    </p>
                    <ul className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400 list-disc pl-5">
                      <li><strong>Filing a Claim:</strong> If you find someone on BookVerse who has uploaded a story that you wrote on another website, you can file a Copyright Claim (DMCA Notice).</li>
                      <li><strong>Our Action:</strong> We review claims incredibly fast. If someone is caught stealing work, the book is permanently deleted, and the user's account may be banned.</li>
                    </ul>
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
