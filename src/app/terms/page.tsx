import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale, Edit3, ShieldAlert, BadgeDollarSign, Copyright } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | BookVerse",
  description: "Terms of Service and user agreements for BookVerse.",
};

export default function TermsPage() {
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
              <h1 className="text-2xl font-bold tracking-tight mb-2">Terms of Service</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">The rules of engagement for reading, writing, and transacting on BookVerse.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 border border-zinc-100 dark:border-zinc-800 rounded-md">
            <Scale className="w-3.5 h-3.5" />
            Last Updated: June 2026
          </div>
        </header>

        {/* Content */}
        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <Edit3 className="w-4 h-4 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">1. Acceptance of Terms</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-4">
              By registering an account and accessing BookVerse, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our platform.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <ShieldAlert className="w-4 h-4 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">2. User Conduct & Content Guidelines</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-4">
              You are responsible for the content you publish on BookVerse. We maintain a zero-tolerance policy for:
            </p>
            <ul className="space-y-3 text-sm text-zinc-500 leading-relaxed font-medium list-disc pl-5">
              <li>Hate speech, harassment, and targeted abuse.</li>
              <li>Plagiarized content or material for which you do not own the copyright.</li>
              <li>Content that violates international laws.</li>
              <li>Spamming the Activity Feed or manipulating the Algorithmic Trending system via bots.</li>
            </ul>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mt-4">
              Violation of these rules may result in immediate termination of your account and forfeiture of any pending Wallet balance.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <BadgeDollarSign className="w-4 h-4 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">3. Monetization & Subscriptions</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-4">
              BookVerse provides features for authors to monetize their content via the Creator Tier and Tipping mechanisms.
            </p>
            <ul className="space-y-3 text-sm text-zinc-500 leading-relaxed font-medium list-disc pl-5">
              <li><strong>Tips:</strong> Tips sent from readers to authors are non-refundable. The platform takes a small processing fee for each tip.</li>
              <li><strong>Payouts:</strong> Authors must have a valid bKash or Nagad number configured. Payouts are subject to a minimum threshold and processed during specified monthly cycles.</li>
              <li><strong>Premium Subscriptions:</strong> Pro Reader and Creator subscriptions auto-renew unless cancelled at least 24 hours before the end of the billing cycle.</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <Copyright className="w-4 h-4 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">4. Intellectual Property</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-4">
              Authors retain 100% ownership and copyright of the original literary works they publish on BookVerse. By publishing on our platform, you grant BookVerse a worldwide, non-exclusive, royalty-free license to host, display, and distribute your content across our platform and associated promotional channels.
            </p>
          </section>

          <section className="pt-12 border-t border-zinc-100 dark:border-zinc-900 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Secondary Legal Records:{" "}
              <Link href="/privacy" className="text-zinc-900 dark:text-white hover:underline underline-offset-4 ml-2">Privacy</Link>
              <span className="mx-2 opacity-20">/</span>
              <Link href="/dmca" className="text-zinc-900 dark:text-white hover:underline underline-offset-4">DMCA</Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
