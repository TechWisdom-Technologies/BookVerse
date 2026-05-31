"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  HelpCircle,
  Send,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const FAQS = [
  {
    q: "How can I publish my stories on BookVerse?",
    a: "Click on the 'Write' icon in the navigation menu, create a new story archive, and begin writing! You can publish drafts instantly or configure releasing schedules.",
  },
  {
    q: "How do I upgrade to a premium reader/author tier?",
    a: "Navigate to the Premium page, choose between the Pro or Creator tiers, and follow the checkout process. Subscriptions are billed monthly and can be cancelled at any time.",
  },
  {
    q: "Can I monetize my writing?",
    a: "Absolutely! Authors on the Creator tier have access to direct fan tipping, monthly author subscription plans, and premium chapter access to build a sustainable writing career.",
  },
  {
    q: "How do I report copyright infringement (DMCA)?",
    a: "We take copyright very seriously. You can easily submit a DMCA takedown notice by clicking the 'DMCA' link in the footer or contacting us directly with legal details at twtech.contact@gmail.com.",
  },
  {
    q: "Can I read stories offline?",
    a: "Yes! You can download chapters to your local device by clicking the download icon. They will be available in the Offline Stories section even without an internet connection.",
  },
  {
    q: "What are Universes?",
    a: "Universes are collaborative fiction worlds where multiple authors can contribute stories set in the exact same lore and setting. You can create your own Universe or request to join existing ones!",
  },
  {
    q: "How do I send a tip to my favorite author?",
    a: "While reading a published story, you can click the 'Send Tip' button to directly support the author financially using a secure Stripe transaction.",
  },
  {
    q: "Are my draft chapters public?",
    a: "No, any story or chapter marked as a 'Draft' is completely private to you. Only chapters you explicitly set to 'Published' will be visible to your readers.",
  },
  {
    q: "Can I change my username?",
    a: "Yes, you can update your username and display name at any time from your Profile Settings. Keep in mind that your username must be unique across the platform.",
  },
  {
    q: "How do I delete my account?",
    a: "You can permanently delete your account and all associated data from the Settings page. Please note that this action is irreversible and will remove all your stories.",
  }
];

export default function SupportPage() {
  const { dbUser, user } = useAuth();

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // UI interaction states
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Auto-prefill logged-in user credentials
  useEffect(() => {
    if (dbUser) {
      setName(dbUser.displayName || dbUser.username || "");
      setEmail(dbUser.email || "");
    } else if (user) {
      setName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [dbUser, user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError("Please fill in all the required form fields.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, category, subject, message }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit your support inquiry.");
      }

      setSuccess(true);
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Portal Header */}
        <header className="mb-16 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Support Desk.</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">
                Get in touch with the BookVerse archival & assistance teams for technical or content support.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-300" />
            Information Center
          </div>
        </header>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Contact cards and FAQs */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600 mb-6 italic">
                Direct Contact Details
              </h2>

              {/* Email Card */}
              <a
                href="mailto:twtech.contact@gmail.com"
                className="group flex items-start gap-4 p-5 border border-zinc-100 dark:border-zinc-900 rounded hover:bg-zinc-50 dark:hover:bg-zinc-900/45 hover:border-zinc-900 dark:hover:border-white transition-all shadow-sm duration-300 block"
              >
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 group-hover:bg-zinc-900 dark:group-hover:bg-white text-zinc-600 dark:text-zinc-300 group-hover:text-white dark:group-hover:text-zinc-900 rounded-lg transition-colors shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Email Desk <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">twtech.contact@gmail.com</div>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">
                    For business inquiries, DMCA notices, or account restorations.
                  </p>
                </div>
              </a>

              {/* Phone Card */}
              <a
                href="tel:+8801799269699"
                className="group flex items-start gap-4 p-5 border border-zinc-100 dark:border-zinc-900 rounded hover:bg-zinc-50 dark:hover:bg-zinc-900/45 hover:border-zinc-900 dark:hover:border-white transition-all shadow-sm duration-300 block"
              >
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 group-hover:bg-zinc-900 dark:group-hover:bg-white text-zinc-600 dark:text-zinc-300 group-hover:text-white dark:group-hover:text-zinc-900 rounded-lg transition-colors shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Voice Assistance <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">+880 1799-269699</div>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">
                    Available during operational hours for direct account triage.
                  </p>
                </div>
              </a>

              {/* WhatsApp Card */}
              <a
                href="https://wa.me/message/XNAQSGDMKN7OD1"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-5 border border-zinc-100 dark:border-zinc-900 rounded hover:bg-zinc-50 dark:hover:bg-zinc-900/45 hover:border-zinc-900 dark:hover:border-white transition-all shadow-sm duration-300 block"
              >
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 group-hover:bg-zinc-900 dark:group-hover:bg-white text-zinc-600 dark:text-zinc-300 group-hover:text-white dark:group-hover:text-zinc-900 rounded-lg transition-colors shadow-sm">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Instant Messaging <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-white">Chat on WhatsApp</div>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">
                    Connect instantly with TechWisdom developers to troubleshoot errors.
                  </p>
                </div>
              </a>

              {/* Address Card */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=158/Cha,+Kuratoli+Rd,+Dhaka+1229,+Bangladesh"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 p-5 border border-zinc-100 dark:border-zinc-900 rounded hover:bg-zinc-50 dark:hover:bg-zinc-900/45 hover:border-zinc-900 dark:hover:border-white transition-all shadow-sm duration-300 block"
              >
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 group-hover:bg-zinc-900 dark:group-hover:bg-white text-zinc-600 dark:text-zinc-300 group-hover:text-white dark:group-hover:text-zinc-900 rounded-lg transition-colors shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Headquarters <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[12px] font-bold leading-relaxed text-zinc-900 dark:text-white">
                    158/Cha, Kuratoli Rd, Dhaka 1229, Bangladesh
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">
                    Visit us in person or send legal notices directly to our administrative office.
                  </p>
                </div>
              </a>
            </div>

            {/* Quick FAQs */}
            <div className="space-y-6">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600 mb-6 italic">
                Frequently Answered
              </h2>
              <div className="space-y-3">
                {FAQS.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {expandedFaq === idx ? (
                        <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                    </button>
                    {expandedFaq === idx && (
                      <div className="p-4 pt-0 border-t border-zinc-50 dark:border-zinc-900 text-[11px] font-medium text-zinc-500 leading-relaxed italic bg-zinc-50/10 dark:bg-zinc-900/5">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Information Desk request form */}
          <div className="lg:col-span-7">
            <div className="border border-zinc-100 dark:border-zinc-900 rounded-xl p-8 bg-white dark:bg-zinc-950 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-zinc-900 dark:bg-white" />

              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-white mb-2">
                Information Desk
              </h2>
              <p className="text-[11px] text-zinc-400 mb-8 italic">
                Fill in the details below to log a direct ticket. TechWisdom support aims to respond within 24 hours.
              </p>

              {success ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-base font-bold uppercase tracking-widest text-zinc-900 dark:text-white">
                    Ticket Logged Successfully.
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-sm leading-relaxed italic">
                    Thank you! Your inquiry has been forwarded to twtech.contact@gmail.com. One of our support staff will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-6 px-6 py-2 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors rounded"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 border border-rose-500/10 bg-rose-500/5 text-[10px] font-bold text-rose-500 rounded uppercase tracking-widest">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded outline-none focus:border-zinc-900 dark:focus:border-white transition-all text-xs"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded outline-none focus:border-zinc-900 dark:focus:border-white transition-all text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Category */}
                    <div className="md:col-span-1 space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded outline-none focus:border-zinc-900 dark:focus:border-white transition-all text-[11px] font-bold uppercase tracking-widest text-zinc-500"
                      >
                        <option value="general">General</option>
                        <option value="account">Account Issues</option>
                        <option value="bug">Report Bug</option>
                        <option value="billing">Billing & Premium</option>
                        <option value="creator">Creator Tools</option>
                      </select>
                    </div>

                    {/* Subject */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                        Subject <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Summary of the issue"
                        className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded outline-none focus:border-zinc-900 dark:focus:border-white transition-all text-xs"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                      Detailed Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Explain your request or issue in detail..."
                      className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded outline-none focus:border-zinc-900 dark:focus:border-white transition-all text-xs resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 rounded shadow-sm"
                    >
                      {submitting ? (
                        "Transmitting..."
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" /> Submit Support Ticket
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
