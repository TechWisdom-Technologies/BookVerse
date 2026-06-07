import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { hasFeatureAccess } from "@/lib/entitlements";
import { uploadToR2 } from "@/lib/r2";
import { checkRateLimit } from "@/lib/rate-limit";
import { randomUUID } from "crypto";

export const maxDuration = 60;

/**
 * Generate an AI chapter illustration.
 * Strategy: Cloudflare Workers AI (primary) → Pollinations (fallback)
 */
async function generateWithCloudflare(prompt: string): Promise<Buffer | null> {
  const token = process.env.CLOUDFLARE_AI_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  
  if (!token || !accountId) {
    console.warn("[AI Illustration] Missing CLOUDFLARE_AI_TOKEN or CLOUDFLARE_ACCOUNT_ID, skipping Cloudflare.");
    return null;
  }

  // Cloudflare's incredibly fast SDXL Lightning model
  const model = "@cf/bytedance/stable-diffusion-xl-lightning";
  const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

  console.log("[AI Illustration] Trying Cloudflare Workers AI:", model);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });

    if (!res.ok) {
      const status = res.status;
      const body = await res.text().catch(() => "");
      console.warn(`[AI Illustration] Cloudflare returned ${status}: ${body.slice(0, 200)}`);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length < 5000) {
      console.warn(`[AI Illustration] Cloudflare returned suspiciously small image (${buffer.length} bytes)`);
      return null;
    }

    console.log(`[AI Illustration] Cloudflare success! Image size: ${buffer.length} bytes`);
    return buffer;
  } catch (err) {
    console.warn(`[AI Illustration] Cloudflare fetch error:`, err);
    return null;
  }
}

async function generateWithPollinations(prompt: string): Promise<Buffer | null> {
  const pollinationUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=600`;

  console.log("[AI Illustration] Trying Pollinations fallback...");

  try {
    const res = await fetch(pollinationUrl);

    if (!res.ok) {
      console.error(`[AI Illustration] Pollinations also failed: ${res.status}`);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log(`[AI Illustration] Pollinations success! Image size: ${buffer.length} bytes`);
    return buffer;
  } catch (err) {
    console.warn("[AI Illustration] Pollinations fetch error:", err);
    return null;
  }
}

export async function POST(request: Request) {
  // Rate limit: 5 AI generations per minute per IP
  const limitRes = await checkRateLimit(5, 60000);
  if (limitRes.limited) return limitRes.response;

  try {
    const { dbUser } = await verifyToken();

    // Check if user is author or admin (basic protection)
    if (dbUser.role !== "AUTHOR" && dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Enforce Pro plan
    if (!(await hasFeatureAccess(dbUser as any, "PRO"))) {
      return NextResponse.json({ error: "Pro plan required" }, { status: 403 });
    }

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 1. Translate Bengali to English automatically (Free Google Translate API)
    let englishPrompt = prompt;
    try {
      const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(prompt)}`;
      const translateRes = await fetch(translateUrl);
      if (translateRes.ok) {
        const data = await translateRes.json();
        englishPrompt = data[0].map((part: any) => part[0]).join('');
      }
    } catch (err) {
      console.warn("Translation failed, falling back to original prompt", err);
    }

    // 2. Enhance prompt for Bangladeshi realistic black and white style
    const enhancedPrompt = `${englishPrompt}, set in Bangladesh, realistic photography, black and white, monochrome, high contrast, highly detailed, photorealistic, cinematic lighting, masterpiece`;

    // Strategy: Try Cloudflare first, fallback to Pollinations
    let imageBuffer = await generateWithCloudflare(enhancedPrompt);

    if (!imageBuffer) {
      console.log("[AI Illustration] Cloudflare unavailable, falling back to Pollinations...");
      imageBuffer = await generateWithPollinations(enhancedPrompt);
    }

    if (!imageBuffer) {
      return NextResponse.json(
        { error: "All AI image providers are currently unavailable. Please try again in a few minutes." },
        { status: 502 }
      );
    }

    // Upload directly to Cloudflare R2
    const fileKey = `illustrations/ai-${randomUUID()}.jpg`;
    const secureUrl = await uploadToR2(fileKey, imageBuffer, "image/jpeg");

    return NextResponse.json({ url: secureUrl }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/ai/generate-illustration error:", error);
    return NextResponse.json(
      { error: "Failed to generate illustration" },
      { status: 500 }
    );
  }
}
