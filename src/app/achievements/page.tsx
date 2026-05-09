import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAuth } from '@/lib/auth';
import { AchievementsDisplay } from '@/components/achievements/AchievementsDisplay';

export const metadata: Metadata = {
  title: 'My Achievements | BookVerse',
  description: 'View your earned achievements and badges on BookVerse',
};

export default async function AchievementsPage() {
  const user = await getAuth();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Achievements</h1>
          <p className="text-lg text-gray-600">
            Unlock badges and earn points by reading, writing, and engaging with the BookVerse community
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <AchievementsDisplay userId={user.id} maxDisplay={12} />
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">How to Earn Achievements</h2>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="mr-3">📖</span>
              <span>Read 5 books to earn the "Avid Reader" badge</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">✍️</span>
              <span>Publish 3 stories to earn the "Author" badge</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">🔥</span>
              <span>Maintain a 7-day reading streak to earn "On Fire"</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">👥</span>
              <span>Join a book club to earn the "Community Member" badge</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3">💬</span>
              <span>Earn 10 reactions to earn the "Social Butterfly" badge</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
