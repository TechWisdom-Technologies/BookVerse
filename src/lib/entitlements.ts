import { prisma } from "@/lib/prisma";

export type PaidTier = "PRO" | "CREATOR";

type EntitledUser = {
  id: string;
  role?: string | null;
  membershipTier?: string | null;
  membershipExpiry?: Date | string | null;
  createdAt?: Date | string | null;
};

function isActiveMembership(user: EntitledUser) {
  if (!user.membershipTier) return false;
  if (!user.membershipExpiry) return true;
  return new Date(user.membershipExpiry).getTime() > Date.now();
}

function tierRank(tier?: string | null) {
  if (tier === "CREATOR") return 2;
  if (tier === "PRO") return 1;
  return 0;
}

export async function isFoundingUser(user: EntitledUser) {
  const createdAt = user.createdAt
    ? new Date(user.createdAt)
    : (await prisma.user.findUnique({ where: { id: user.id }, select: { createdAt: true } }))?.createdAt;

  if (!createdAt) return false;

  const position = await prisma.user.count({
    where: {
      createdAt: { lte: createdAt },
    },
  });

  return position <= 100;
}

export async function hasFeatureAccess(user: EntitledUser, requiredTier: PaidTier) {
  if (user.role === "ADMIN") return true;
  if (await isFoundingUser(user)) return true;
  if (!isActiveMembership(user)) return false;
  return tierRank(user.membershipTier) >= tierRank(requiredTier);
}

export function paidFeatureError(requiredTier: PaidTier) {
  return {
    error: `${requiredTier === "CREATOR" ? "Creator" : "Pro"} plan required`,
    requiredTier,
    upgradeUrl: `/premium/checkout?plan=${requiredTier.toLowerCase()}`,
  };
}
