import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;
  if (!token) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });
    return { user, decoded };
  } catch {
    return null;
  }
}

export async function GET() {
  const authData = await getUser();
  if (!authData || !authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = authData;

  const [activeSessions, loginHistory] = await Promise.all([
    prisma.deviceSession.findMany({
      where: { userId: user.id },
      orderBy: { lastActive: "desc" },
    }),
    prisma.loginHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20, // Only show last 20 logins
    }),
  ]);

  return NextResponse.json({ activeSessions, loginHistory });
}

export async function DELETE(req: Request) {
  const authData = await getUser();
  if (!authData || !authData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user, decoded } = authData;

  try {
    const { deviceId } = await req.json();
    if (!deviceId) {
      return NextResponse.json({ error: "Device ID is required" }, { status: 400 });
    }

    // Delete the specific device session from DB
    await prisma.deviceSession.deleteMany({
      where: {
        userId: user.id,
        deviceIdentifier: deviceId,
      },
    });

    // To ensure ultimate security, we revoke ALL Firebase refresh tokens for this user.
    // They will be logged out globally, including their current session.
    await adminAuth.revokeRefreshTokens(decoded.uid);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session revoke error:", error);
    return NextResponse.json({ error: "Failed to revoke session" }, { status: 500 });
  }
}
