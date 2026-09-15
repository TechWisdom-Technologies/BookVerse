"use client";

/**
 * Shared client-side tier checking utilities.
 * These mirror the server-side logic in entitlements.ts for use in page components.
 */

export type PaidTier = "AUTHOR" | "PRO" | "CREATOR";

const TIER_RANK: Record<string, number> = {
  BANNED: -1,
  SUSPENDED: -1,
  FREE: 0,
  AUTHOR: 1,
  PRO: 2,
  CREATOR: 3,
};

/**
 * Check if the user's tier meets the required minimum tier.
 * Returns { allowed: true } or { allowed: false, redirectTo: string }.
 */
export function checkTierAccess(
  dbUser: { role?: string; membershipTier?: string | null } | null | undefined,
  requiredTier: PaidTier,
  currentPath: string
): { allowed: true } | { allowed: false; requiredTier: PaidTier | "ADMIN" | "USER"; redirectTo: string } {
  if (!dbUser) {
    return { allowed: false, requiredTier: "USER", redirectTo: `/login?redirect=${encodeURIComponent(currentPath)}` };
  }

  // Admins bypass all tier checks
  if (dbUser.role === "ADMIN") {
    return { allowed: true };
  }

  const tier = dbUser.membershipTier?.toUpperCase() || "FREE";

  // BANNED or SUSPENDED → redirect to home (not checkout)
  if (tier === "BANNED" || tier === "SUSPENDED") {
    return { allowed: false, requiredTier: requiredTier, redirectTo: "/" };
  }

  const userRank = TIER_RANK[tier] ?? 0;
  const requiredRank = TIER_RANK[requiredTier] ?? 0;

  if (userRank >= requiredRank) {
    return { allowed: true };
  }

  return {
    allowed: false,
    requiredTier,
    redirectTo: `/premium/checkout?plan=${requiredTier.toLowerCase()}&redirect=${encodeURIComponent(currentPath)}`,
  };
}
