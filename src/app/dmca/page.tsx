import { Metadata } from "next";
import Link from "next/link";
import { Mail, FileText, Shield, Clock, ArrowLeft, Gavel } from "lucide-react";

export const metadata: Metadata = {
  title: "DMCA Policy | BookVerse",
  description: "Digital Millennium Copyright Act policy and takedown procedures for BookVerse.",
};

export default function DMCAPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Minimal Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Archives
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">Intellectual Property</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">Digital Millennium Copyright Act compliance and takedown protocols.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 border border-zinc-100 dark:border-zinc-800 rounded-md">
            <Gavel className="w-3.5 h-3.5" />
            Legal Protocol
          </div>
        </header>

        {/* Content Registry */}
        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <Shield className="w-3.5 h-3.5 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Copyright Policy</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">
              BookVerse respects the intellectual property rights of others and expects our users to do the same. 
              In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously to 
              claims of copyright infringement committed using our service.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Infringement Reporting</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-6">
              To execute a takedown protocol, please provide our designated copyright agent with the following data points:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Physical or electronic signature of the owner.",
                "Identification of the infringed work.",
                "Precise location (URL) of the infringing material.",
                "Accurate contact information (Address, Phone, Email).",
                "Statement of good faith belief.",
                "Statement of accuracy under penalty of perjury."
              ].map((item, i) => (
                <div key={i} className="p-4 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-900/50 flex items-start gap-3">
                  <span className="text-[10px] font-mono text-zinc-300 mt-0.5">{(i+1).toString().padStart(2, '0')}</span>
                  <span className="text-xs text-zinc-500 font-medium leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Designated Agent</h2>
            </div>
            <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Transmission Protocol</h3>
                  <a href="mailto:dmca@bookverse.com" className="text-sm font-bold text-zinc-900 dark:text-white hover:underline">dmca@bookverse.com</a>
                </div>
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Physical Repository</h3>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                    BookVerse Legal Department<br />
                    123 Book Street, Literary District<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Counter-Notification</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-6">
              If content was removed due to misidentification, submit a counter-notification containing:
            </p>
            <div className="space-y-3">
              {[
                "Your physical or electronic signature.",
                "Identification of the removed material and its location.",
                "Statement under penalty of perjury of good faith belief.",
                "Your full name, address, and consent to jurisdiction."
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="pt-12 border-t border-zinc-100 dark:border-zinc-900 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Secondary Legal Records:{" "}
              <Link href="/terms" className="text-zinc-900 dark:text-white hover:underline underline-offset-4 ml-2">Terms</Link>
              <span className="mx-2 opacity-20">/</span>
              <Link href="/privacy" className="text-zinc-900 dark:text-white hover:underline underline-offset-4">Privacy</Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
