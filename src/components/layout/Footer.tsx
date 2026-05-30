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

// Social Icons SVGs
const FacebookIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TwitterIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);
const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const LinkedinIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
const TiktokIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);

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
            <Link href="/" className="flex flex-col items-start gap-4 group">
              <img
                src="/bookverse.png"
                alt="BookVerse Logo"
                className="w-12 h-12 object-contain rounded"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
                  BookVerse
                </span>
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">By TechWisdom Technologies</p>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-20">
          {/* Discover */}
          <div className="space-y-6">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">Discover</h4>
            <ul className="space-y-3">
              <li><FooterLink href="/">Home</FooterLink></li>
              <li><FooterLink href="/library">Browse Library</FooterLink></li>
              <li><FooterLink href="/stories">Stories</FooterLink></li>
              <li><FooterLink href="/universes">Universes</FooterLink></li>
              <li><FooterLink href="/series">Series</FooterLink></li>
              <li><FooterLink href="/search">Search</FooterLink></li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-6">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">Community</h4>
            <ul className="space-y-3">
              <li><FooterLink href="/clubs">Book Clubs</FooterLink></li>
              <li><FooterLink href="/activity-feed">Activity Feed</FooterLink></li>
              <li><FooterLink href="/reading-challenges">Challenges</FooterLink></li>
              <li><FooterLink href="/shelf">My Shelf</FooterLink></li>
              <li><FooterLink href="/offline-stories">Offline Stories</FooterLink></li>
            </ul>
          </div>

          {/* For Authors */}
          <div className="space-y-6">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">For Authors</h4>
            <ul className="space-y-3">
              <li><FooterLink href="/write/dashboard">Author Dashboard</FooterLink></li>
              <li><FooterLink href="/write/new">Write a Story</FooterLink></li>
              <li><FooterLink href="/write/universes">Story Universes</FooterLink></li>
              <li><FooterLink href="/write/series">Story Series</FooterLink></li>
              <li><FooterLink href="/author/analytics">Analytics</FooterLink></li>
              <li><FooterLink href="/wallet">Wallet</FooterLink></li>
              <li><FooterLink href="/author/newsletter">Newsletter & Fans</FooterLink></li>
              <li><FooterLink href="/upload">Upload Book</FooterLink></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-6">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">Support & Legal</h4>
            <ul className="space-y-3">
              <li><FooterLink href="/premium">Premium</FooterLink></li>
              <li><FooterLink href="/gifts">Gifts</FooterLink></li>
              <li><FooterLink href="/settings">Settings</FooterLink></li>
              <li><FooterLink href="/support">Support Desk</FooterLink></li>
              <li><FooterLink href="/docs">Documentation</FooterLink></li>
              <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
              <li><FooterLink href="/cookies">Cookie Policy</FooterLink></li>
              <li><FooterLink href="/dmca">DMCA</FooterLink></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-zinc-300 mt-0.5 flex-shrink-0" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=158/Cha,+Kuratoli+Rd,+Dhaka+1229,+Bangladesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors leading-relaxed"
                >
                  158/Cha, Kuratoli Rd<br />Dhaka 1229, Bangladesh
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-zinc-300 flex-shrink-0" />
                <a href="mailto:twtech.contact@gmail.com" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  twtech.contact@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-zinc-300 flex-shrink-0" />
                <a href="tel:+8801799269699" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  +880 1799-269699
                </a>
              </li>
            </ul>
            
            {/* Social Links Moved Here */}
            <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/50">
              <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 italic mb-4">Follow Us</h4>
              <div className="flex items-center gap-3">
                <SocialLink href="https://facebook.com" icon={FacebookIcon} label="Facebook" />
                <SocialLink href="https://instagram.com" icon={InstagramIcon} label="Instagram" />
                <SocialLink href="https://twitter.com" icon={TwitterIcon} label="Twitter" />
                <SocialLink href="https://linkedin.com" icon={LinkedinIcon} label="LinkedIn" />
                <SocialLink href="https://tiktok.com" icon={TiktokIcon} label="TikTok" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-10 border-t border-zinc-50 dark:border-zinc-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">
                © {new Date().getFullYear()} BookVerse. All rights reserved.
              </div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                Design and Developed by TechWisdom Technologies
              </div>
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
