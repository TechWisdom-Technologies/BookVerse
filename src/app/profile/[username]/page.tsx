import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username} - BookVerse Profile`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  // Get cookies for authentication forwarding
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();

  // Fetch user data from API
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/users/${username}`, {
    headers: {
      Cookie: cookieString,
    },
    next: { revalidate: 0 }, // Disable revalidation for live profile status
  });

  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  const { user } = data;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
      <ProfileHeader user={user} />
      <div className="mt-8">
        <ProfileTabs books={user.books} stories={user.stories} />
      </div>
    </main>
  );
}

