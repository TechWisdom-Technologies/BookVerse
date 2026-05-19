import { NextResponse } from "next/server";
import { sendSupportRequestEmail } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const { name, email, category, subject, message } = await request.json();

    if (!name || !email || !category || !subject || !message) {
      return NextResponse.json(
        { error: "All support request fields (name, email, category, subject, message) are required." },
        { status: 400 }
      );
    }

    // Send support request email via Resend to twtech.contact@gmail.com
    try {
      sendSupportRequestEmail({ name, email, category, subject, message });
      return NextResponse.json({ success: true });
    } catch (sendError: any) {
      console.error("Failed to send support email via Resend:", sendError);
      return NextResponse.json(
        { error: "Failed to dispatch support request. Please try again later." },
        { status: 502 }
      );
    }
  } catch (err: any) {
    console.error("Support API handler failed:", err);
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
