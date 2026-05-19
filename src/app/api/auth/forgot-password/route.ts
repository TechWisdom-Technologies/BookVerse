import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { sendPasswordResetEmail } from "@/lib/resend";

export async function POST(request: Request) {
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
    } catch (firebaseError: any) {
      console.error("Firebase reset link generation failed:", firebaseError);
      
      // Return a descriptive error if user is not found, otherwise generic
      if (firebaseError?.code === "auth/user-not-found") {
        return NextResponse.json(
          { error: "No account exists with this email address." },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: firebaseError?.message || "Failed to generate reset link." },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("Forgot password API handler failed:", err);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
