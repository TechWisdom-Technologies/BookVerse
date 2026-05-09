import { OnboardingQuiz } from '@/components/onboarding/OnboardingQuiz';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome | BookVerse',
  description: 'Set up your profile and reading preferences.',
};

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <OnboardingQuiz />
      </div>
    </main>
  );
}
