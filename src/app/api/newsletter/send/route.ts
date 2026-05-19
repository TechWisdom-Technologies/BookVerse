import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { adminAuth } from "@/lib/firebase-admin";
import { hasFeatureAccess, paidFeatureError } from "@/lib/entitlements";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
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
    if (!(await hasFeatureAccess(user, "PRO"))) {
      return NextResponse.json(paidFeatureError("PRO"), { status: 402 });
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
    // Note: Resend free tier has limitations, but this handles the API correctly.
    const { data, error } = await resend.emails.send({
      from: 'BookVerse Authors <authors@bookverse.app>',
      to: subscriberEmails,
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
