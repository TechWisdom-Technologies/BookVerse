import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

let stripeInstance: Stripe | null = null;
const getStripe = () => {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || "mock_key", {
      apiVersion: "2024-12-18.acacia" as any,
    });
  }
  return stripeInstance;
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = getStripe().webhooks.constructEvent(body, signature, webhookSecret || "mock_webhook_secret");
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const tipId = session.metadata?.tipId;

      if (tipId) {
        const completedTip = await prisma.tip.update({
          where: { id: tipId },
          data: { status: "COMPLETED" },
          include: { sender: true }
        });
        
        if (completedTip) {
          void createNotification({
            userId: completedTip.receiverId,
            type: "TIP",
            title: "You received a Tip!",
            message: `${completedTip.sender?.displayName || completedTip.sender?.username || 'Someone'} sent you a tip of ${(completedTip.amount / 100).toFixed(2)}!`,
            link: `/profile`,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
