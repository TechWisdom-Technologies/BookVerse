import type { DecodedIdToken } from "firebase-admin/auth";
import { cookies, headers } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

import { User } from "@prisma/client";

/**
 * Helper to get the authenticated database user.
 * Renamed to getCurrentUser to avoid conflicts.
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { dbUser } = await verifyToken();
    return dbUser;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

export async function verifyToken(): Promise<{
  firebaseUser: DecodedIdToken;
  dbUser: User;
}> {
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get("firebase-token")?.value;

  const h = await headers();
  const authHeader = h.get("authorization");
  const tokenFromHeader = authHeader?.toLowerCase().startsWith("bearer ")
    ? authHeader.slice("bearer ".length).trim()
    : undefined;

  const token = tokenFromHeader || tokenFromCookie;
  if (!token) throw new Error("UNAUTHORIZED");

  const firebaseUser = await adminAuth.verifyIdToken(token);
  const dbUser = await prisma.user.findUnique({
    where: { firebaseUid: firebaseUser.uid },
  });

  if (!dbUser) throw new Error("USER_NOT_FOUND");

  return { firebaseUser, dbUser };
}

// Legacy export for backward compatibility
export { getCurrentUser as getAuth };
