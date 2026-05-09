'use client';

import Link from 'next/link';
import { Check, BookOpen, Heart, Zap, Users, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const TIERS = [
  {
    name: 'Free',
    price: 0,
    description: 'Get started with BookVerse',
    features: [
      'Read unlimited public books',
      'Create & publish stories',
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
    name: 'Pro',
    price: 9.99,
    period: 'month',
    description: 'Perfect for active readers and authors',
    features: [
      'Everything in Free +',
      'Ad-free reading experience',
      'Advanced analytics dashboard',
      'Priority support',
      'Custom profile badges',
      'Early access to new features',
      'Enhanced author tools',
      'Monthly reading goals tracking',
      'Exclusive community events',
    ],
    popular: true,
    cta: 'Upgrade to Pro',
    ctaHref: '/premium/checkout?plan=pro',
  },
  {
    name: 'Creator',
    price: 19.99,
    period: 'month',
    description: 'For serious authors and creators',
    features: [
      'Everything in Pro +',
      'Advanced monetization tools',
      'Exclusive creator dashboard',
      'Newsletter management',
      'Beta reader program access',
      'Custom landing page',
      'Revenue analytics',
      'Premium tier support',
      'Co-author collaboration',
      'Advanced formatting options',
    ],
    popular: false,
    cta: 'Upgrade to Creator',
    ctaHref: '/premium/checkout?plan=creator',
  },
];

export default function PremiumPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Choose Your BookVerse Plan
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Unlock premium features to enhance your reading and writing experience
        </p>
      </div>

      {/* Pricing Tiers */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TIERS.map(tier => (
            <div
              key={tier.name}
              className={`rounded-lg transition-all ${
                tier.popular
                  ? 'ring-2 ring-blue-600 shadow-2xl md:scale-105'
                  : 'shadow-md border border-gray-200'
              } overflow-hidden bg-white`}
            >
              {tier.popular && (
                <div className="bg-blue-600 text-white py-2 text-center font-semibold text-sm">
                  ⭐ Most Popular
                </div>
              )}

              <div className="p-8">
                {/* Tier Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{tier.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      {tier.price === 0 ? 'Free' : `$${tier.price}`}
                    </span>
                    {tier.price > 0 && (
                      <span className="text-gray-600">/{tier.period}</span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                {user ? (
                  <Link
                    href={tier.ctaHref || '#'}
                    className={`w-full block text-center py-3 px-4 rounded-lg font-semibold mb-8 transition ${
                      tier.ctaDisabled
                        ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                        : tier.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className={`w-full block text-center py-3 px-4 rounded-lg font-semibold mb-8 transition ${
                      tier.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Sign in
                  </Link>
                )}

                {/* Features */}
                <div className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="max-w-6xl mx-auto px-4 py-20 bg-white rounded-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Feature Comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-900">Free</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-900">Pro</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-900">Creator</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 text-gray-700 font-medium">Reading Library</td>
                <td className="text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 text-gray-700 font-medium">Publishing & Chapters</td>
                <td className="text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 text-gray-700 font-medium">Ad-Free Reading</td>
                <td className="text-center">—</td>
                <td className="text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 text-gray-700 font-medium">Analytics Dashboard</td>
                <td className="text-center">Basic</td>
                <td className="text-center">Advanced</td>
                <td className="text-center">
                  <Sparkles className="w-5 h-5 text-yellow-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 text-gray-700 font-medium">Monetization Tools</td>
                <td className="text-center">—</td>
                <td className="text-center">Basic</td>
                <td className="text-center">Advanced</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 text-gray-700 font-medium">Newsletter Management</td>
                <td className="text-center">—</td>
                <td className="text-center">—</td>
                <td className="text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 text-gray-700 font-medium">Priority Support</td>
                <td className="text-center">—</td>
                <td className="text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-600">
              Yes! You can cancel your subscription anytime from your account settings. No questions asked.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
            <p className="text-gray-600">
              We offer a 7-day free trial for Pro and Creator plans. No credit card required to start.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens to my stories if I downgrade?</h3>
            <p className="text-gray-600">
              Your stories remain safe. You'll just lose access to premium features, but all your content stays with you.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I upgrade or downgrade anytime?</h3>
            <p className="text-gray-600">
              Absolutely! Change your plan anytime. We'll prorate any charges or credits based on your usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
