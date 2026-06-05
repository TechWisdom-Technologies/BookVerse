import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { initiatePayment } from "@/lib/uddoktapay";

/**
 * POST /api/payment/uddokta/initiate
 *
 * Creates an UddoktaPay checkout session and returns the payment URL.
 *
 * Body:
 *   type       — "PREMIUM" | "PROMOTION" | "TIP"
 *   amount     — number (in BDT)
 *   metadata   — object with context-specific data
 *                 For PREMIUM:   { plan, duration }
 *                 For PROMOTION: { storyId, tier, duration, customBudget? }
 *                 For TIP:       { receiverId, storyId?, message? }
 */
export async function POST(req: Request) {
  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, amount, metadata } = body;

    if (!type || !amount || !metadata) {
      return NextResponse.json(
        { error: "Missing required fields: type, amount, metadata" },
        { status: 400 }
      );
    }

    const finalAmount = Math.max(1, Math.round(Number(amount)));

    if (isNaN(finalAmount) || finalAmount < 1) {
      return NextResponse.json(
        { error: "Amount must be at least ৳1 Taka" },
        { status: 400 }
      );
    }

    // Build the redirect/cancel URLs based on the current origin
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get("origin") ||
      req.headers.get("referer")?.replace(/\/[^/]*$/, "") ||
      "http://localhost:3000";

    const redirectUrl = `${origin}/api/payment/uddokta/verify`;
    const cancelUrl = `${origin}/payment/cancel`;

    // Extract IP address and Country from headers (Vercel/Cloudflare standards)
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "Unknown";
      
    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      "Unknown";

    // Attach userId, type, and tracking info to metadata
    const fullMetadata: Record<string, string> = {
      ...metadata,
      userId: user.id,
      paymentType: type,
      amount: String(finalAmount),
      email: user.email,
      ipAddress,
      country,
    };

    const result = await initiatePayment({
      full_name: user.displayName || user.username || "BookVerse User",
      email: user.email,
      amount: finalAmount,
      metadata: fullMetadata,
      redirect_url: redirectUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({
      success: true,
      payment_url: result.payment_url,
    });
  } catch (error: any) {
    console.error("[UddoktaPay Initiate] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
