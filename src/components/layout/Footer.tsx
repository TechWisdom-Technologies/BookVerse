"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Heart,
  Globe,
  MessageCircle,
  Share2,
  ExternalLink,
  Sparkles,
  Star,
  Send,
  ChevronUp,
} from "lucide-react";

// Footer Link
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
    >
      {children}
    </Link>
  );
}

// Social Link
function SocialLink({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ size?: number; className?: string }>; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-center w-10 h-10 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-400 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-900 dark:hover:bg-white hover:text-white dark:hover:text-zinc-900 hover:border-zinc-900 dark:hover:border-white transition-all duration-300"
      aria-label={label}
    >
      <Icon size={16} />
    </a>
  );
}

// Newsletter Form
function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="border border-zinc-100 dark:border-zinc-900 rounded p-8 bg-white dark:bg-zinc-950 shadow-sm">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-4 italic">Newsletter</h3>
      <p className="text-[11px] text-zinc-500 mb-6 font-medium leading-relaxed italic">
        Weekly book recommendations and author updates, straight to your inbox.
      </p>
      
      {submitted ? (
        <div className="flex items-center gap-4 border border-zinc-100 dark:border-zinc-900 rounded p-4">
          <Heart size={16} className="text-zinc-900 dark:text-white" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Thank you!</p>
            <p className="text-[9px] text-zinc-400">You&apos;re now subscribed.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="flex-1 px-5 py-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white transition-all shadow-sm"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded transition-all hover:opacity-90 border border-zinc-900 dark:border-white shadow-sm"
          >
            <Send size={14} />
          </button>
        </form>
      )}
    </div>
  );
}

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-auto bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900">
      <div className="mx-auto max-w-7xl px-6 py-20">
        {/* Top Section */}
        <div className="grid lg:grid-cols-2 gap-20 mb-20 pb-20 border-b border-zinc-50 dark:border-zinc-900">
          {/* Left - Brand & Description */}
          <div className="space-y-8">
            <Link href="/" className="inline-flex items-center gap-4 group">
              <div className="w-10 h-10 rounded bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900">
                <BookOpen size={20} />
              </div>
              <div>
                <span className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
                  BookVerse
                </span>
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">Your Digital Library</p>
              </div>
            </Link>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-medium max-w-md italic">
              Discover, read, and share your favorite books with a community of passionate readers. Join millions of book lovers on their literary journey.
            </p>
            
            {/* Stats */}
            <div className="flex gap-12 pt-4">
              {[
                { val: '10K+', label: 'Books' },
                { val: '500+', label: 'Authors' },
                { val: '50K+', label: 'Readers' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tighter">{s.val}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Newsletter */}
          <NewsletterForm />
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          {/* Discover */}
          <div className="space-y-6">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">Discover</h4>
            <ul className="space-y-3">
              <li><FooterLink href="/library">Browse Library</FooterLink></li>
              <li><FooterLink href="/stories">Stories</FooterLink></li>
              <li><FooterLink href="/search">Search</FooterLink></li>
              <li><FooterLink href="/universes">Universes</FooterLink></li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-6">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">Community</h4>
            <ul className="space-y-3">
              <li><FooterLink href="/clubs">Book Clubs</FooterLink></li>
              <li><FooterLink href="/activity-feed">Feed</FooterLink></li>
              <li><FooterLink href="/reading-challenges">Challenges</FooterLink></li>
            </ul>
          </div>

          {/* For Writers */}
          <div className="space-y-6">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">For Writers</h4>
            <ul className="space-y-3">
              <li><FooterLink href="/write">Write Story</FooterLink></li>
              <li><FooterLink href="/upload">Upload Book</FooterLink></li>
              <li><FooterLink href="/write/newsletter">Newsletter</FooterLink></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">Support</h4>
            <ul className="space-y-3">
              <li><FooterLink href="/premium">Premium</FooterLink></li>
              <li><FooterLink href="/gifts">Gifts</FooterLink></li>
              <li><FooterLink href="/settings">Settings</FooterLink></li>
              <li><FooterLink href="/dmca">DMCA</FooterLink></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-zinc-300 mt-0.5 flex-shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 leading-relaxed">
                  123 Book Street, Literary District<br />New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-zinc-300 flex-shrink-0" />
                <a href="mailto:hello@bookverse.com" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  hello@bookverse.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-zinc-300 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-10 border-t border-zinc-50 dark:border-zinc-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">
              © {new Date().getFullYear()} BookVerse. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <SocialLink href="https://github.com" icon={Globe} label="GitHub" />
              <SocialLink href="https://twitter.com" icon={MessageCircle} label="Twitter" />
              <SocialLink href="https://instagram.com" icon={Share2} label="Instagram" />
              <SocialLink href="https://linkedin.com" icon={ExternalLink} label="LinkedIn" />
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-zinc-300">
              <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-28 right-6 w-10 h-10 rounded bg-white dark:bg-zinc-950 shadow-md border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-900 dark:hover:border-white transition-all z-30"
        aria-label="Back to top"
      >
        <ChevronUp size={20} />
      </button>
    </footer>
  );
}
