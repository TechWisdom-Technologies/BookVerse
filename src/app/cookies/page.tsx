import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cookie, Info, ToggleLeft, Laptop } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy | BookVerse",
  description: "Cookie Policy and tracking technologies used by BookVerse.",
};

export default function CookiesPage() {
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
              <h1 className="text-2xl font-bold tracking-tight mb-2">Cookie Policy</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">Understanding how we use cookies to improve your reading experience.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 border border-zinc-100 dark:border-zinc-800 rounded-md">
            <Cookie className="w-3.5 h-3.5" />
            Last Updated: June 2026
          </div>
        </header>

        {/* Content */}
        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <Info className="w-4 h-4 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">1. What Are Cookies?</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-4">
              Cookies are small text files stored on your device by your web browser when you visit a website. They are widely used to make websites work more efficiently and to provide a customized experience by remembering your preferences (like staying logged in or your dark mode settings).
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <Laptop className="w-4 h-4 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">2. How BookVerse Uses Cookies</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-4">
              We classify our cookies into the following categories:
            </p>
            <div className="space-y-4">
              <div className="p-4 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-900/50">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-2">Essential Cookies</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">Required for the platform to function. These include authentication tokens that keep you logged in and security mechanisms that prevent CSRF attacks.</p>
              </div>
              <div className="p-4 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-900/50">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-2">Functional Cookies</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">Used to remember your preferences, such as the PDF Engine zoom level, your UI theme (Light/Dark), and your reading progress for specific books.</p>
              </div>
              <div className="p-4 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-900/50">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-2">Performance & Analytics</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">Used to collect aggregated data on how users interact with the platform, allowing us to generate the <strong>Author Analytics</strong> data (like Focus Index and Reader Drop-off) for our creators.</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <ToggleLeft className="w-4 h-4 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">3. Managing Your Cookies</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-4">
              Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer. However, please note that disabling Essential or Functional cookies will prevent you from logging in or saving your reading progress on BookVerse.
            </p>
          </section>

          <section className="pt-12 border-t border-zinc-100 dark:border-zinc-900 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Secondary Legal Records:{" "}
              <Link href="/privacy" className="text-zinc-900 dark:text-white hover:underline underline-offset-4 ml-2">Privacy</Link>
              <span className="mx-2 opacity-20">/</span>
              <Link href="/terms" className="text-zinc-900 dark:text-white hover:underline underline-offset-4">Terms</Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
