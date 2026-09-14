import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const subscriber = await prisma.platformNewsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email }
    });

    return NextResponse.json({ message: "Successfully subscribed to the platform newsletter!" }, { status: 200 });
  } catch (error) {
    console.error("Error subscribing to platform newsletter:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
