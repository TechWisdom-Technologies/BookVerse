import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { prisma } from "@/lib/prisma";
import { adminAuth } from "@/lib/firebase-admin";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username} - BookVerse Profile`,
  };
}

async function getCurrentUserId() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebase-token")?.value;
    if (!token) return null;

    const decoded = await adminAuth.verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      select: { id: true },
    });

    return user?.id ?? null;
  } catch {
    return null;
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  // Query database directly instead of doing an external fetch to self (which fails in Vercel/production)
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      role: true,
      membershipTier: true,
      phoneNumber: true,
      email: true,
      dateOfBirth: true,
      address: true,
      nationality: true,
      subGenres: true,
      createdAt: true,
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
      books: {
        select: {
          id: true,
          title: true,
          authorName: true,
          coverUrl: true,
          genre: true,
          downloadCount: true,
          createdAt: true,
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      stories: {
        where: { published: true },
        select: {
          id: true,
          title: true,
          coverUrl: true,
          summary: true,
          viewCount: true,
          createdAt: true,
          _count: {
            select: {
              chapters: true,
              reactions: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const currentUserId = await getCurrentUserId();

  // Check if current user is following this user
  const isFollowing = currentUserId
    ? await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: user.id,
          },
        },
      })
    : null;

  // Check if current user is subscribed to this user's newsletter
  const isSubscribed = currentUserId
    ? await prisma.newsletterSubscriber.findUnique({
        where: {
          authorId_subscriberId: {
            authorId: user.id,
            subscriberId: currentUserId,
          },
        },
      })
    : null;

  const fullUserData = {
    ...user,
    isFollowing: !!isFollowing,
    isSubscribed: !!isSubscribed,
    isOwnProfile: currentUserId === user.id,
  };

  return (
    <main className="min-h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A] pt-16 pb-32">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <ProfileHeader user={fullUserData} />
        <div className="mt-16">
          <ProfileTabs books={user.books} stories={user.stories} />
        </div>
      </div>
    </main>
  );
}


