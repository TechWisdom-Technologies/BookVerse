import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBulkNewsletter } from "@/lib/resend";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    // 1. Verify Authentication & Authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    const dbUser = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid }
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    // 2. Parse Request
    const { subject, content } = await req.json();

    if (!subject || !content) {
      return NextResponse.json({ error: "Subject and content are required" }, { status: 400 });
    }

    // 3. Fetch Subscribers
    const subscribers = await prisma.platformNewsletterSubscriber.findMany({
      where: { isActive: true },
      select: { email: true }
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No active subscribers found", success: 0, failed: 0 }, { status: 200 });
    }

    const emails = subscribers.map(sub => sub.email);

    // 4. Send Emails
    const result = await sendBulkNewsletter(emails, subject, content);

    return NextResponse.json({ 
      message: "Newsletter batch processing complete", 
      ...result 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error sending bulk newsletter:", error);
    return NextResponse.json({ error: error.message || "Failed to send newsletter" }, { status: 500 });
  }
}
