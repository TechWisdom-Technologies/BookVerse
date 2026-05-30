import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Eye, Database, Lock, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | BookVerse",
  description: "Privacy Policy and data handling practices for BookVerse.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Archives
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">Privacy Policy</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">How we collect, use, and protect your digital footprint.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 border border-zinc-100 dark:border-zinc-800 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            Last Updated: June 2026
          </div>
        </header>

        {/* Content */}
        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <Eye className="w-4 h-4 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">1. Data Collection</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-4">
              We collect information to provide a better, more personalized reading experience on BookVerse. This includes:
            </p>
            <ul className="space-y-3 text-sm text-zinc-500 leading-relaxed font-medium list-disc pl-5">
              <li><strong>Account Data:</strong> Email address, username, profile picture, and bio.</li>
              <li><strong>Financial Data:</strong> Payout numbers (e.g., bKash, Nagad) provided by Creators. We do not store complete credit card information on our servers; payments are processed securely via third-party gateways.</li>
              <li><strong>Behavioral Data:</strong> Reading progress, highlighted text, annotations, comments, and engagement (likes/tips) to fuel our AI Librarian recommendations and Author Analytics.</li>
              <li><strong>Device Data:</strong> IP address, browser type, and operating system used to optimize the PDF Engine and offline caching mechanisms.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <Database className="w-4 h-4 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">2. Usage of Data</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-4">
              Your data is never sold to external data brokers. It is used strictly for internal platform optimization:
            </p>
            <ul className="space-y-3 text-sm text-zinc-500 leading-relaxed font-medium list-disc pl-5">
              <li>To power the <strong>Trending Algorithm</strong> by analyzing read velocity.</li>
              <li>To construct the <strong>Reader Drop-off Matrix</strong> and <strong>Focus Index</strong> for authors, using anonymized, aggregated reading session data.</li>
              <li>To send push notifications and newsletter emails from authors you subscribe to.</li>
              <li>To securely process Wallet payouts and subscriptions.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <Lock className="w-4 h-4 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">3. Data Security & Retention</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-4">
              BookVerse employs industry-standard encryption protocols (TLS/SSL) for data transmission. Passwords are securely hashed. We retain your account data for as long as your account is active. If you delete your account, your data will be purged within 30 days, except for anonymized aggregated reading statistics which cannot be traced back to you.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <Globe className="w-4 h-4 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">4. Your Rights</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-4">
              Depending on your jurisdiction (e.g., GDPR, CCPA), you have the right to request a copy of your personal data, request corrections, or demand complete deletion. You can execute these requests by contacting our support team at <a href="mailto:privacy@bookverse.com" className="text-indigo-500 hover:underline">privacy@bookverse.com</a>.
            </p>
          </section>

          <section className="pt-12 border-t border-zinc-100 dark:border-zinc-900 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Secondary Legal Records:{" "}
              <Link href="/terms" className="text-zinc-900 dark:text-white hover:underline underline-offset-4 ml-2">Terms</Link>
              <span className="mx-2 opacity-20">/</span>
              <Link href="/cookies" className="text-zinc-900 dark:text-white hover:underline underline-offset-4">Cookies</Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
