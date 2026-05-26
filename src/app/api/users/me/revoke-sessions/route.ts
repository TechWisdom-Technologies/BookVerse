import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { adminAuth } from "@/lib/firebase-admin";

// POST /api/users/me/revoke-sessions — Revoke all Firebase refresh tokens
export async function POST() {
  try {
    const { dbUser } = await verifyToken();

    // Revoke all refresh tokens for this user via Firebase Admin SDK
    await adminAuth.revokeRefreshTokens(dbUser.firebaseUid);

    const response = NextResponse.json({
      success: true,
      message: "All active sessions have been revoked. You will need to sign in again on all devices.",
    });

    // Clear the current session cookie so the user gets logged out here too
    response.cookies.set("firebase-token", "", { maxAge: 0, path: "/" });
    response.cookies.set("user-role", "", { maxAge: 0, path: "/" });

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/users/me/revoke-sessions error:", error);
    return NextResponse.json(
      { error: "Failed to revoke sessions" },
      { status: 500 }
    );
  }
}
