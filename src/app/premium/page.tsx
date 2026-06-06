'use client';

import Link from 'next/link';
import { Check, BookOpen, Heart, Zap, Users, Sparkles, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

const TIERS = [
  {
    name: 'Free',
    price: 0,
    description: 'Get started with BookVerse',
    features: [
      'Read unlimited public books',
      'Join book clubs',
      'Leave reviews and comments',
      'Basic profile page',
      'Community access',
    ],
    popular: false,
    cta: 'Current Plan',
    ctaDisabled: true,
  },
  {
    name: 'Author',
    price: 99,
    period: 'month',
    description: 'For aspiring writers',
    features: [
      'Read unlimited public books',
      'Create & publish stories',
      'Upload custom book covers',
      'Access to Author Dashboard',
      'Join book clubs',
      'Community access',
    ],
    popular: false,
    cta: 'Become an Author',
    ctaHref: '/premium/checkout?plan=author',
  },
  {
    name: 'Pro',
    price: 299,
    period: 'month',
    description: 'Perfect for active readers and authors',
    features: [
      'Everything in Author +',
      'Ad-free reading experience',
      'Priority support',
      'Unlock Achievements & Badges',
      'Access to Wallet Dashboard',
      'Early access to new features',
    ],
    popular: true,
    cta: 'Upgrade to Pro',
    ctaHref: '/premium/checkout?plan=pro',
  },
  {
    name: 'Creator',
    price: 599,
    period: 'month',
    description: 'For serious authors and creators',
    features: [
      'Everything in Pro +',
      'Creator Demographics & Advanced Analytics',
      'Create Story Polls & Voting',
      'Gift Memberships to Readers',
      'Unified Ledger History (Wallet)',
      'Beta Reader Program Access',
      'Newsletter Management',
      'Premium tier support',
    ],
    popular: false,
    cta: 'Upgrade to Creator',
    ctaHref: '/premium/checkout?plan=creator',
  },
];

export default function PremiumPage() {
  const { user, dbUser } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Simple Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Premium Plans.</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">Unlock exclusive features and support your favorite creators.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded">
            <Shield className="w-3.5 h-3.5 text-zinc-300" />
            Pick Your Plan
          </div>
        </header>

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 mb-20 shadow-sm">
          {TIERS.map(tier => {
            const isCurrentPlan = user && tier.name.toUpperCase() === (dbUser?.membershipTier?.toUpperCase() || 'FREE');
            const isDisabled = isCurrentPlan || (tier.name === 'Free');
            const ctaText = isCurrentPlan ? 'Current Plan' : (tier.name === 'Free' ? 'Included' : tier.cta);

            return (
            <div
              key={tier.name}
              className="p-10 bg-white dark:bg-zinc-950 flex flex-col h-full"
            >
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600">{tier.name} Plan</h3>
                  {tier.popular && (
                    <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-zinc-900 dark:border-white text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-900">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold tracking-tighter">
                    {tier.price === 0 ? 'Free' : `৳${tier.price}`}
                  </span>
                  {tier.price > 0 && (
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">/{tier.period}</span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed italic">{tier.description}</p>
              </div>

              <div className="mb-12">
                {user ? (
                  <Link
                    href={isDisabled ? '#' : (tier.ctaHref || '#')}
                    className={`w-full block text-center py-3.5 px-4 rounded text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${
                      isDisabled
                        ? 'bg-zinc-50 text-zinc-300 border-zinc-100 dark:bg-zinc-900 dark:text-zinc-700 dark:border-zinc-800 cursor-not-allowed pointer-events-none'
                        : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white hover:opacity-90 shadow-sm'
                    }`}
                  >
                    {ctaText}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="w-full block text-center py-3.5 px-4 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all border border-zinc-900 dark:border-white"
                  >
                    Login Now
                  </Link>
                )}
              </div>

              <div className="space-y-4 mt-auto">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600 mb-6">Features Included</h4>
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <Check className="w-4 h-4 text-zinc-900 dark:text-white shrink-0 mt-0.5" />
                    <span className="text-[11px] text-zinc-500 font-medium leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        </div>

        {/* Plan Comparison */}
        <div className="mb-24">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-10 pb-4 border-b border-zinc-50 dark:border-zinc-900 italic">Plan Comparison</h2>
          <div className="overflow-x-auto border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900">
                  <th className="py-5 px-8 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 border-b border-zinc-100 dark:border-zinc-800">Feature</th>
                  <th className="py-5 px-8 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 border-b border-zinc-100 dark:border-zinc-800">Free</th>
                  <th className="py-5 px-8 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 border-b border-zinc-100 dark:border-zinc-800">Author</th>
                  <th className="py-5 px-8 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800">Pro</th>
                  <th className="py-5 px-8 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 border-b border-zinc-100 dark:border-zinc-800">Creator</th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-medium text-zinc-500">
                {[
                  ['Reading Library', 'Full', 'Full', 'Full', 'Full'],
                  ['Publishing & Chapters', '-', 'Full', 'Full', 'Full'],
                  ['Ad-Free Experience', '-', '-', 'Yes', 'Yes'],
                  ['Wallet Dashboard', '-', '-', 'Basic', 'Full + Ledger'],
                  ['Achievements & Badges', '-', '-', 'Yes', 'Yes'],
                  ['Advanced Analytics', '-', '-', '-', 'Yes'],
                  ['Story Polls & Voting', '-', '-', '-', 'Yes'],
                  ['Gift Memberships', '-', '-', '-', 'Yes'],
                  ['Beta Reader Program', '-', '-', '-', 'Yes'],
                  ['Priority Support', '-', 'Standard', 'Premium', 'Elite']
                ].map(([name, free, author, pro, creator]) => (
                  <tr key={name as string} className="border-b border-zinc-50 dark:border-zinc-900 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="py-5 px-8 font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">{name}</td>
                    <td className="py-5 px-8 text-center">{free}</td>
                    <td className="py-5 px-8 text-center font-bold text-zinc-900 dark:text-zinc-100">{author}</td>
                    <td className="py-5 px-8 text-center font-bold text-blue-600 dark:text-blue-400">{pro}</td>
                    <td className="py-5 px-8 text-center font-bold text-purple-600 dark:text-purple-400">{creator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simple FAQ */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mb-12 pb-4 border-b border-zinc-50 dark:border-zinc-900 text-center italic">Questions & Answers</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes! You can cancel your plan anytime from your settings. No questions asked.' },
              { q: 'Is there a free trial?', a: 'We offer a 7-day free trial for Pro and Creator plans. Try it out risk-free.' },
              { q: 'What happens if I downgrade?', a: "Your stories are safe. You'll simply lose access to premium features, but all your content stays with you." },
              { q: 'Can I upgrade anytime?', a: 'Absolutely! Switch your plan whenever you like. We\'ll adjust your billing automatically.' }
            ].map((faq) => (
              <div key={faq.q} className="space-y-3">
                <h3 className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-widest">{faq.q}</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
