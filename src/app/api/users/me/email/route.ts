import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Note: The client must first re-authenticate the user with their password
    // and successfully update their email via the Firebase Client SDK.
    // This endpoint exists solely to sync that change down to PostgreSQL.
    // The new token issued after the email change will contain the updated email.

    const decoded = await adminAuth.verifyIdToken(token, true); // force refresh verification
    
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!decoded.email) {
      return NextResponse.json({ error: "No email in token" }, { status: 400 });
    }

    // Verify the requested newEmail matches what Firebase claims is now the verified email
    const { newEmail } = await req.json();

    if (decoded.email.toLowerCase() !== newEmail.toLowerCase()) {
      return NextResponse.json({ 
        error: "Email change not verified by Firebase. Please update in Firebase first." 
      }, { status: 400 });
    }

    // Update in Prisma
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { email: newEmail.toLowerCase() },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Email update sync error:", error);
    return NextResponse.json({ error: "Failed to update email" }, { status: 500 });
  }
}
