import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { adminAuth } from "@/lib/firebase-admin";

let stripeInstance: Stripe | null = null;
const getStripe = () => {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || "mock_key", {
      apiVersion: "2024-12-18.acacia" as any,
    });
  }
  return stripeInstance;
};

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    let senderId: string | null = null;
    
    // Optional Authentication for tipping
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        const user = await prisma.user.findUnique({
          where: { firebaseUid: decodedToken.uid }
        });
        senderId = user?.id || null;
      } catch (e) {
        console.warn("Failed to verify user token for tip", e);
      }
    }

    const { amount, receiverId, storyId, message } = await req.json();

    if (!amount || amount < 100) { // Minimum $1.00 tip
      return NextResponse.json({ error: "Invalid amount. Minimum $1.00 required." }, { status: 400 });
    }

    if (!receiverId) {
      return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 });
    }

    // Verify receiver
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      return NextResponse.json({ error: "Author not found" }, { status: 404 });
    }

    // Create a pending Tip record in our database
    const tip = await prisma.tip.create({
      data: {
        amount,
        currency: "usd",
        senderId,
        receiverId,
        storyId,
        message,
        status: "PENDING",
      }
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    // Create Stripe Checkout Session
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Support ${receiver.displayName || receiver.username}`,
              description: message ? `"${message}"` : `A tip for their amazing work on BookVerse.`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        tipId: tip.id,
      },
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/stories/${storyId || ''}`,
    });

    // Update Tip with Stripe session ID
    if (session.id) {
      await prisma.tip.update({
        where: { id: tip.id },
        data: { stripeSessionId: session.id }
      });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
