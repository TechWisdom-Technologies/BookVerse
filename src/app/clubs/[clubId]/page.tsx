import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import ClubDetailClient from './ClubDetailClient';

interface ClubDetailPageProps {
  params: Promise<{ clubId: string }>;
}

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { clubId } = await params;
  
  // Fetch user (needed for security checks, though client handles most interactions)
  const user = await getCurrentUser();

  let club = await prisma.club.findUnique({
    where: { id: clubId },
    include: {
      owner: {
        select: { id: true, username: true, displayName: true, avatarUrl: true, bio: true },
      },
      members: {
        take: 20,
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatarUrl: true },
          },
        },
      },
      _count: {
        select: { members: true }
      }
    },
  });

  if (!club) {
    // Fallback: search by name
    club = await prisma.club.findUnique({
      where: { name: decodeURIComponent(clubId) },
      include: {
        owner: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, bio: true },
        },
        members: {
          take: 20,
          include: {
            user: {
              select: { id: true, username: true, displayName: true, avatarUrl: true },
            },
          },
        },
        _count: {
          select: { members: true }
        }
      },
    });
  }

  if (!club) {
    return notFound();
  }

  // Check membership efficiently
  const isOwner = user?.id === club.ownerId;
  let isMember = false;
  if (user) {
    const memberRecord = await prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId: club.id, userId: user.id } }
    });
    if (memberRecord) isMember = true;
  }

  // Security: Hide joinCode for non-members
  if (!isOwner && !isMember) {
    (club as any).joinCode = null;
  }

  // Fetch all discussions in the club (top-level only)
  const discussions = await prisma.clubDiscussion.findMany({
    where: { clubId: club.id, parentId: null },
    include: {
      author: {
        select: { id: true, username: true, displayName: true, avatarUrl: true },
      },
      reactions: true,
      _count: {
        select: { replies: true }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  // Attach discussions to club payload for the client view
  const clubPayload = {
    ...club,
    discussions,
    isMember,
    memberCount: club._count.members,
    members: club.members
  };

  return <ClubDetailClient initialClub={clubPayload as any} clubId={club.id} />;
}
