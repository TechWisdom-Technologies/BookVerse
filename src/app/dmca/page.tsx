import { Metadata } from "next";
import Link from "next/link";
import { Mail, FileText, Shield, Clock, ArrowLeft, Gavel, Scale, AlertTriangle, AlertCircle } from "lucide-react";

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
              <h1 className="text-2xl font-bold tracking-tight mb-2">Intellectual Property & DMCA</h1>
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
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Copyright Policy Overview</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">
              BookVerse is fundamentally committed to protecting the creative rights of authors. We respect the intellectual property rights of others and expect our users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA) and other applicable international copyright laws, we will respond expeditiously to valid claims of copyright infringement committed using our service. 
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mt-4">
              Upon receiving a valid takedown notice, BookVerse will take whatever action it deems appropriate, including the removal of the challenged material and, in appropriate circumstances, the termination of the infringing user's account.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Infringement Reporting (Takedown Notice)</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-6">
              To execute a takedown protocol, please provide our designated copyright agent with the following data points in a written communication:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "A physical or electronic signature of a person authorized to act on behalf of the owner of the copyright that has been allegedly infringed.",
                "Identification of the copyrighted work claimed to have been infringed, or a representative list of such works.",
                "Precise location (URL) of the infringing material on BookVerse that is to be removed or disabled.",
                "Accurate contact information for the complaining party (Address, Phone number, Email).",
                "A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner.",
                "A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner."
              ].map((item, i) => (
                <div key={i} className="p-4 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-900/50 flex items-start gap-3">
                  <span className="text-[10px] font-mono text-zinc-300 mt-0.5">{(i+1).toString().padStart(2, '0')}</span>
                  <span className="text-xs text-zinc-500 font-medium leading-tight">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 border border-rose-500/20 rounded bg-rose-500/5 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-500/80 font-medium leading-relaxed">
                <strong>Warning:</strong> Under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability for damages, including costs and attorneys' fees.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Counter-Notification Procedure</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-6">
              If you believe that your content was removed (or access to it was disabled) by mistake or misidentification, you may submit a Counter-Notification to our Designated Agent. It must include:
            </p>
            <div className="space-y-4">
              {[
                "Your physical or electronic signature.",
                "Identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or disabled.",
                "A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or a misidentification of the material.",
                "Your name, address, telephone number, and email address.",
                "A statement that you consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located (or New York if outside the US), and that you will accept service of process."
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-xs text-zinc-500 font-medium p-4 bg-zinc-50 dark:bg-zinc-900 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            
            <p className="text-sm text-zinc-500 leading-relaxed font-medium mt-6">
              If a Counter-Notice is received by our Designated Agent, BookVerse may send a copy to the original complaining party informing that person that it may replace the removed content in 10 business days. Unless the copyright owner files an action seeking a court order against the content provider, the removed content may be replaced, or access to it restored, in 10 to 14 business days after receipt of the Counter-Notice.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Repeat Infringer Policy</h2>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed font-medium">
              In accordance with the DMCA and other applicable laws, BookVerse has adopted a policy of terminating, in appropriate circumstances and at BookVerse's sole discretion, users who are deemed to be repeat infringers. BookVerse may also at its sole discretion limit access to the platform and/or terminate the accounts of any users who infringe any intellectual property rights of others, whether or not there is any repeat infringement.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-zinc-50 dark:border-zinc-900">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Designated Agent Contact Info</h2>
            </div>
            <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Transmission Protocol</h3>
                  <a href="mailto:dmca@bookverse.com" className="text-sm font-bold text-indigo-500 hover:underline">dmca@bookverse.com</a>
                  <p className="text-xs text-zinc-500 mt-2 italic">For the fastest resolution, please submit via email.</p>
                </div>
                <div>
                  <h3 className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Physical Repository</h3>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                    BookVerse Legal Department<br />
                    Attention: Copyright Agent<br />
                    123 Book Street, Literary District<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-12 border-t border-zinc-100 dark:border-zinc-900 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center justify-center gap-4">
              <Link href="/terms" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</Link>
              <span className="opacity-20">/</span>
              <Link href="/privacy" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
