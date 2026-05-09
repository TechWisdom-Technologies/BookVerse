import { StoryUniverseBrowser } from '@/components/universe/StoryUniverseBrowser';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Story Universes - BookVerse',
  description: 'Explore interconnected story universes',
};

export default function UniversesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <StoryUniverseBrowser />
    </main>
  );
}
