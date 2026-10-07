import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ClubsClientView } from '@/components/clubs/ClubsClientView';

export default async function ClubsPage() {
  // Fetch data on the server
  const [clubs, currentUser] = await Promise.all([
    prisma.club.findMany({
      include: {
        owner: {
          select: { username: true, displayName: true, avatarUrl: true },
        },
        members: {
          select: { userId: true },
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    getCurrentUser()
  ]);

  // Map to a lighter payload
  const mappedClubs = clubs.map(club => ({
    id: club.id,
    name: club.name,
    description: club.description,
    genre: club.genre,
    coverUrl: club.coverUrl,
    isPrivate: club.isPrivate,
    owner: club.owner,
    memberCount: club.members.length,
    isMember: currentUser ? club.members.some(m => m.userId === currentUser.id) : false,
  }));

  const myClubs = mappedClubs.filter(c => c.isMember);
  const discoverClubs = mappedClubs.filter(c => !c.isMember);

  // Optionally calculate unread counts if a user is logged in
  const unreadCountsByClub: Record<string, number> = {};
  if (currentUser) {
    const memberships = await prisma.clubMember.findMany({
      where: { userId: currentUser.id },
      select: { clubId: true, lastReadAt: true }
    });

    // Instead of fetching all discussions, we do parallel count queries for much faster DB performance
    await Promise.all(memberships.map(async (member) => {
      const lastRead = member.lastReadAt || new Date(0);
      const unread = await prisma.clubDiscussion.count({
        where: {
          clubId: member.clubId,
          createdAt: { gt: lastRead }
        }
      });
      if (unread > 0) {
        unreadCountsByClub[member.clubId] = unread;
      }
    }));
  }

  const safeCurrentUser = currentUser ? { id: currentUser.id } : null;

  return (
    <ClubsClientView 
      myClubs={myClubs} 
      discoverClubs={discoverClubs}
      initialUnreadCounts={unreadCountsByClub}
      currentUser={safeCurrentUser}
    />
  );
}
