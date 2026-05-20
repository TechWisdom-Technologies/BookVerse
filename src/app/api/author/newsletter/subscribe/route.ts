import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function POST(req: Request) {
  try {
    const { dbUser } = await verifyToken();
    const { authorId, action } = await req.json();

    if (!authorId) {
      return NextResponse.json({ error: "authorId is required" }, { status: 400 });
    }

    if (authorId === dbUser.id) {
      return NextResponse.json({ error: "Cannot subscribe to your own newsletter" }, { status: 400 });
    }

    const author = await prisma.user.findUnique({
      where: { id: authorId },
      select: { id: true },
    });

    if (!author) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    if (action === "subscribe") {
      await prisma.newsletterSubscriber.upsert({
        where: {
          authorId_subscriberId: {
            authorId,
            subscriberId: dbUser.id,
          },
        },
        create: {
          authorId,
          subscriberId: dbUser.id,
        },
        update: {},
      });

      // Notify the author
      void createNotification({
        userId: authorId,
        type: "NEWSLETTER_SUBSCRIBE",
        title: "New Newsletter Subscriber!",
        message: `${dbUser.displayName || dbUser.username} subscribed to your newsletter.`,
        link: `/profile/${dbUser.username}`,
      });

      return NextResponse.json({ success: true, isSubscribed: true });
    } else if (action === "unsubscribe") {
      await prisma.newsletterSubscriber.deleteMany({
        where: {
          authorId,
          subscriberId: dbUser.id,
        },
      });

      return NextResponse.json({ success: true, isSubscribed: false });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/author/newsletter/subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
