import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { checkRateLimit } from "@/lib/rate-limit";
import { randomUUID } from "crypto";

export const maxDuration = 60;

/**
 * Generate an AI book cover image.
 * Strategy: Cloudflare Workers AI (primary) → Pollinations (fallback)
 */
async function generateWithCloudflare(prompt: string): Promise<Buffer | null> {
  const token = process.env.CLOUDFLARE_AI_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  
  if (!token || !accountId) {
    console.warn("[AI Cover] Missing CLOUDFLARE_AI_TOKEN or CLOUDFLARE_ACCOUNT_ID, skipping Cloudflare.");
    return null;
  }

  // Cloudflare's incredibly fast SDXL Lightning model
  const model = "@cf/bytedance/stable-diffusion-xl-lightning";
  const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

  console.log("[AI Cover] Trying Cloudflare Workers AI:", model);

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
      console.warn(`[AI Cover] Cloudflare returned ${status}: ${body.slice(0, 200)}`);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length < 5000) {
      console.warn(`[AI Cover] Cloudflare returned suspiciously small image (${buffer.length} bytes)`);
      return null;
    }

    console.log(`[AI Cover] Cloudflare success! Image size: ${buffer.length} bytes`);
    return buffer;
  } catch (err) {
    console.warn(`[AI Cover] Cloudflare fetch error:`, err);
    return null;
  }
}

async function generateWithPollinations(prompt: string): Promise<Buffer | null> {
  const seed = Math.floor(Math.random() * 999999);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&width=512&height=768`;

  console.log("[AI Cover] Trying Pollinations fallback...");

  try {
    const res = await fetch(imageUrl);

    if (!res.ok) {
      console.error(`[AI Cover] Pollinations also failed: ${res.status}`);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log(`[AI Cover] Pollinations success! Image size: ${buffer.length} bytes`);
    return buffer;
  } catch (err) {
    console.warn("[AI Cover] Pollinations fetch error:", err);
    return null;
  }
}

export async function POST(req: Request) {
  // Rate limit: 5 AI cover generations per minute per IP
  const limitRes = await checkRateLimit(5, 60000);
  if (limitRes.limited) return limitRes.response;

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Please provide a description for your cover." },
        { status: 400 }
      );
    }

    const enhancedPrompt = `A professional, high-quality book cover design without any text. Style: ${prompt}. Cinematic lighting, highly detailed, centered composition, suitable for a novel cover.`;

    // Strategy: Try Cloudflare first, fallback to Pollinations
    let imageBuffer = await generateWithCloudflare(enhancedPrompt);

    if (!imageBuffer) {
      console.log("[AI Cover] Cloudflare unavailable, falling back to Pollinations...");
      imageBuffer = await generateWithPollinations(enhancedPrompt);
    }

    if (!imageBuffer) {
      return NextResponse.json(
        { error: "All AI image providers are currently unavailable. Please try again in a few minutes." },
        { status: 502 }
      );
    }

    // Upload to R2 storage
    const fileKey = `covers/ai-${randomUUID()}.jpg`;
    const persistentUrl = await uploadToR2(fileKey, imageBuffer, "image/jpeg");

    return NextResponse.json({ url: persistentUrl });
  } catch (error: any) {
    console.error("AI cover generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover. Please try again." },
      { status: 500 }
    );
  }
}
