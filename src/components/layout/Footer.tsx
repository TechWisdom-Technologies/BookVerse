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

// Social Link Component
function SocialLink({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ size?: number; className?: string }>; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100 text-zinc-600 hover:bg-orange-500 hover:text-white transition-all duration-300 hover:scale-110"
      aria-label={label}
    >
      <Icon size={18} className="transition-transform group-hover:scale-110" />
      {/* Tooltip */}
      <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap">
        {label}
      </span>
    </a>
  );
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description }: { icon: typeof Star; title: string; description: string }) {
  return (
    <div className="group flex items-start gap-3 p-4 rounded-2xl bg-zinc-50/50 hover:bg-white hover:shadow-lg hover:shadow-zinc-900/5 transition-all duration-300 cursor-default">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-semibold text-zinc-900 text-sm mb-1">{title}</h4>
        <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Newsletter Form Component
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
    <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={20} className="text-amber-300" />
        <h3 className="font-bold text-lg">Join Our Newsletter</h3>
      </div>
      <p className="text-orange-100 text-sm mb-4 leading-relaxed">
        Get weekly book recommendations, author interviews, and exclusive deals delivered to your inbox.
      </p>
      
      {submitted ? (
        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Heart size={20} className="text-rose-500 fill-rose-500" />
          </div>
          <div>
            <p className="font-semibold">Thank you!</p>
            <p className="text-xs text-orange-100">You&apos;re now subscribed.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 pr-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-orange-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            required
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white text-orange-500 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Send size={16} />
          </button>
        </form>
      )}
    </div>
  );
}

// Footer Link Component
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 text-sm text-zinc-500 hover:text-orange-500 transition-colors duration-200"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 group-hover:bg-orange-500 transition-colors" />
      {children}
    </Link>
  );
}

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-auto relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 to-white -z-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
      
      {/* Wave Separator */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[60px] rotate-180"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-zinc-50"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Top Section - Newsletter */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left - Brand & Description */}
            <div className="space-y-4">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen size={24} />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
                    BookVerse
                  </span>
                  <p className="text-xs text-zinc-500">Your Digital Library</p>
                </div>
              </Link>
              <p className="text-zinc-600 leading-relaxed max-w-md">
                Discover, read, and share your favorite books with a community of passionate readers. 
                Join millions of book lovers on their literary journey.
              </p>
              
              {/* Stats */}
              <div className="flex gap-6 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-zinc-900">10K+</div>
                  <div className="text-xs text-zinc-500">Books</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-zinc-900">500+</div>
                  <div className="text-xs text-zinc-500">Authors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-zinc-900">50K+</div>
                  <div className="text-xs text-zinc-500">Readers</div>
                </div>
              </div>
            </div>

            {/* Right - Newsletter */}
            <NewsletterForm />
          </div>
        </div>

        {/* Middle Section - Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          {/* Discover */}
          <div className="space-y-4">
            <h4 className="font-semibold text-zinc-900 flex items-center gap-2">
              <Star size={16} className="text-orange-500" />
              Discover
            </h4>
            <ul className="space-y-2">
              <li><FooterLink href="/library">Browse Library</FooterLink></li>
              <li><FooterLink href="/stories">Stories</FooterLink></li>
              <li><FooterLink href="/explore">Trending</FooterLink></li>
              <li><FooterLink href="/new">New Releases</FooterLink></li>
              <li><FooterLink href="/genres">Genres</FooterLink></li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="font-semibold text-zinc-900 flex items-center gap-2">
              <Heart size={16} className="text-rose-500" />
              Community
            </h4>
            <ul className="space-y-2">
              <li><FooterLink href="/clubs">Book Clubs</FooterLink></li>
              <li><FooterLink href="/authors">Authors</FooterLink></li>
              <li><FooterLink href="/discussions">Discussions</FooterLink></li>
              <li><FooterLink href="/reviews">Reviews</FooterLink></li>
              <li><FooterLink href="/events">Events</FooterLink></li>
            </ul>
          </div>

          {/* Write */}
          <div className="space-y-4">
            <h4 className="font-semibold text-zinc-900 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              For Writers
            </h4>
            <ul className="space-y-2">
              <li><FooterLink href="/write">Write Story</FooterLink></li>
              <li><FooterLink href="/upload">Upload Book</FooterLink></li>
              <li><FooterLink href="/author-dashboard">Dashboard</FooterLink></li>
              <li><FooterLink href="/analytics">Analytics</FooterLink></li>
              <li><FooterLink href="/earnings">Earnings</FooterLink></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-zinc-900 flex items-center gap-2">
              <Mail size={16} className="text-emerald-500" />
              Support
            </h4>
            <ul className="space-y-2">
              <li><FooterLink href="/help">Help Center</FooterLink></li>
              <li><FooterLink href="/contact">Contact Us</FooterLink></li>
              <li><FooterLink href="/faq">FAQs</FooterLink></li>
              <li><FooterLink href="/feedback">Feedback</FooterLink></li>
              <li><FooterLink href="/report">Report Issue</FooterLink></li>
            </ul>
          </div>

          {/* Contact Info - Desktop Only */}
          <div className="hidden lg:block space-y-4">
            <h4 className="font-semibold text-zinc-900">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-zinc-500">
                <MapPin size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                <span>123 Book Street, Literary District<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-500">
                <Mail size={16} className="text-orange-500 flex-shrink-0" />
                <a href="mailto:hello@bookverse.com" className="hover:text-orange-500 transition-colors">
                  hello@bookverse.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-500">
                <Phone size={16} className="text-orange-500 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-orange-500 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <FeatureCard
            icon={BookOpen}
            title="Vast Library"
            description="Access thousands of books across all genres, from classics to new releases."
          />
          <FeatureCard
            icon={Heart}
            title="Curated Lists"
            description="Personalized recommendations based on your reading preferences."
          />
          <FeatureCard
            icon={Star}
            title="Community"
            description="Connect with fellow readers and share your thoughts on books."
          />
          <FeatureCard
            icon={Sparkles}
            title="Free to Use"
            description="Read, write, and share stories completely free. Premium options available."
          />
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-zinc-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span>Made with</span>
              <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
              <span>by BookVerse Team</span>
              <span className="text-zinc-300">|</span>
              <span> {new Date().getFullYear()}</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <SocialLink href="https://github.com" icon={Globe} label="GitHub" />
              <SocialLink href="https://twitter.com" icon={MessageCircle} label="Twitter" />
              <SocialLink href="https://instagram.com" icon={Share2} label="Instagram" />
              <SocialLink href="https://linkedin.com" icon={ExternalLink} label="LinkedIn" />
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <Link href="/privacy" className="hover:text-orange-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-orange-500 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-orange-500 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-28 right-6 w-12 h-12 rounded-full bg-white shadow-lg shadow-zinc-900/20 border border-zinc-100 flex items-center justify-center text-zinc-600 hover:text-orange-500 hover:scale-110 transition-all duration-300 group z-30"
        aria-label="Back to top"
      >
        <ChevronUp size={24} className="group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </footer>
  );
}
