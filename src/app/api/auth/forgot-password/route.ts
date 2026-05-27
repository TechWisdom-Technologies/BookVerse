import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { sendPasswordResetEmail } from "@/lib/resend";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limitRes = await checkRateLimit(5, 60000);
  if (limitRes.limited) return limitRes.response;

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    try {
      // 1. Generate the reset password link securely via Firebase Admin SDK
      const resetLink = await adminAuth.generatePasswordResetLink(email);

      // 2. Dispatch the beautifully styled email via Resend
      sendPasswordResetEmail(email, resetLink);

      return NextResponse.json({ success: true });
    } catch (firebaseError: unknown) {
      console.error("Firebase reset link generation failed:", firebaseError);
      
      const fErr = firebaseError as Record<string, unknown>;
      // Return a descriptive error if user is not found, otherwise generic
      if (fErr?.code === "auth/user-not-found") {
        return NextResponse.json(
          { error: "No account exists with this email address." },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: (fErr?.message as string) || "Failed to generate reset link." },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    console.error("Forgot password API handler failed:", err);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
