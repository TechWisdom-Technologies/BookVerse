import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { prisma } from "@/lib/prisma";
import { adminAuth } from "@/lib/firebase-admin";
import { hasFeatureAccess, paidFeatureError } from "@/lib/entitlements";
import { checkRateLimit } from "@/lib/rate-limit";

const from = process.env.RESEND_FROM_EMAIL || "BookVerse <onboarding@resend.dev>";

export async function POST(req: Request) {
  // Rate limit: 3 newsletter sends per minute
  const limitRes = await checkRateLimit(3, 60000);
  if (limitRes.limited) return limitRes.response;

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
      include: {
        newsletterSubscribers: {
          include: { subscriber: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!(await hasFeatureAccess(user, "CREATOR"))) {
      return NextResponse.json(paidFeatureError("CREATOR"), { status: 402 });
    }

    const { subject, htmlContent } = await req.json();

    if (!subject || !htmlContent) {
      return NextResponse.json({ error: "Subject and content are required" }, { status: 400 });
    }

    const subscriberEmails = user.newsletterSubscribers
      .map(sub => sub.subscriber.email)
      .filter(Boolean);

    if (subscriberEmails.length === 0) {
      return NextResponse.json({ error: "You have no subscribers yet" }, { status: 400 });
    }

    // Send emails in batches using Resend
    if (!resend) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const { data, error } = await resend.emails.send({
      from,
      to: user.email,
      bcc: subscriberEmails,
      subject: subject,
      html: htmlContent,
      replyTo: user.email,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send emails via Resend" }, { status: 500 });
    }

    return NextResponse.json({ success: true, sentCount: subscriberEmails.length, data });
  } catch (error) {
    console.error("Newsletter send error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
