import { OnboardingQuiz } from '@/components/onboarding/OnboardingQuiz';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BookVerse - Onboarding Quiz',
  description: 'Customize your reading preferences',
};

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <OnboardingQuiz />
    </main>
  );
}
