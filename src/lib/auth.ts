import type { DecodedIdToken } from "firebase-admin/auth";
import { cookies, headers } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

export async function verifyToken(): Promise<{
  firebaseUser: DecodedIdToken;
  dbUser: Awaited<ReturnType<typeof prisma.user.findUniqueOrThrow>>;
}> {
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get("firebase-token")?.value;

  const h = await headers();
  const authHeader = h.get("authorization");
  const tokenFromHeader = authHeader?.toLowerCase().startsWith("bearer ")
    ? authHeader.slice("bearer ".length).trim()
    : undefined;

  const token = tokenFromCookie || tokenFromHeader;
  if (!token) throw new Error("UNAUTHORIZED");

  const firebaseUser = await adminAuth.verifyIdToken(token);
  const dbUser = await prisma.user.findUniqueOrThrow({
    where: { firebaseUid: firebaseUser.uid },
  });

  return { firebaseUser, dbUser };
}

