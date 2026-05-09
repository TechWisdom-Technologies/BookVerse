import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuth } from '@/lib/auth';
import { ReadingStreakDisplay } from '@/components/reading/ReadingStreakDisplay';
import { ReadingLogForm } from '@/components/reading/ReadingLogForm';

export const metadata: Metadata = {
  title: 'Reading Stats | BookVerse',
  description: 'Track your reading streaks and statistics on BookVerse',
};

export default async function ReadingStatsPage() {
  const user = await getAuth();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reading Stats</h1>
          <p className="text-lg text-gray-600">
            Track your reading streaks, pages read, and reading goals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ReadingStreakDisplay userId={user.id} />
          </div>

          <div>
            <ReadingLogForm userId={user.id} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for Building Your Reading Habit</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="mr-3 text-blue-600 font-bold">1.</span>
              <span>Set a daily reading goal - even 15-30 minutes a day builds momentum</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-blue-600 font-bold">2.</span>
              <span>Log your reading every day to track your streak</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-blue-600 font-bold">3.</span>
              <span>Join book clubs to stay motivated and discuss great reads</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-blue-600 font-bold">4.</span>
              <span>Earn achievements and badges as you reach milestones</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 text-blue-600 font-bold">5.</span>
              <span>Share your progress with friends and follow their streaks</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
