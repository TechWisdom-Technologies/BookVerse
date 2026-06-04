import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { sendPasswordResetEmail } from "@/lib/resend";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: Request) {
  const limitRes = await checkRateLimit(5, 60000);
  if (limitRes.limited) return limitRes.response;

  try {
    const { email, captchaToken } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    // Verify Turnstile CAPTCHA token server-side
    const captchaResult = await verifyTurnstileToken(captchaToken);
    if (!captchaResult.success) {
      return NextResponse.json(
        { error: captchaResult.error || "CAPTCHA verification failed." },
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
      const fErr = firebaseError as Record<string, unknown>;
      // Always return success to prevent user enumeration.
      // Log the real error server-side for debugging.
      if (fErr?.code === "auth/user-not-found") {
        console.info("Password reset requested for non-existent email (suppressed).");
        return NextResponse.json({ success: true });
      }
      
      console.error("Firebase reset link generation failed:", firebaseError);
      return NextResponse.json(
        { error: "Failed to process request. Please try again later." },
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
