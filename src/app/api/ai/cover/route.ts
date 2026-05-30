import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { randomUUID } from "crypto";

export const maxDuration = 60;

/**
 * Generate an AI book cover image.
 * Strategy: Hugging Face (primary) → Pollinations (fallback)
 */
async function generateWithHuggingFace(prompt: string): Promise<Buffer | null> {
  const token = process.env.HF_ACCESS_TOKEN;
  if (!token) {
    console.warn("[AI Cover] No HF_ACCESS_TOKEN set, skipping Hugging Face.");
    return null;
  }

  // Use FLUX.1-schnell — fast, high quality, free-tier friendly
  const model = "black-forest-labs/FLUX.1-schnell";
  const apiUrl = `https://router.huggingface.co/hf-inference/models/${model}`;

  console.log("[AI Cover] Trying Hugging Face:", model);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "image/*",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: 512,
          height: 768,
        },
      }),
    });

    if (!res.ok) {
      const status = res.status;
      const body = await res.text().catch(() => "");
      console.warn(`[AI Cover] Hugging Face returned ${status}: ${body.slice(0, 200)}`);
      return null; // Will trigger fallback
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      console.warn(`[AI Cover] Hugging Face returned non-image content-type: ${contentType}`);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanity check: image should be at least 5KB
    if (buffer.length < 5000) {
      console.warn(`[AI Cover] Hugging Face returned suspiciously small image (${buffer.length} bytes)`);
      return null;
    }

    console.log(`[AI Cover] Hugging Face success! Image size: ${buffer.length} bytes`);
    return buffer;
  } catch (err) {
    console.warn("[AI Cover] Hugging Face fetch error:", err);
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
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Please provide a description for your cover." },
        { status: 400 }
      );
    }

    const enhancedPrompt = `A professional, high-quality book cover design without any text. Style: ${prompt}. Cinematic lighting, highly detailed, centered composition, suitable for a novel cover.`;

    // Strategy: Try Hugging Face first, fallback to Pollinations
    let imageBuffer = await generateWithHuggingFace(enhancedPrompt);

    if (!imageBuffer) {
      console.log("[AI Cover] Hugging Face unavailable, falling back to Pollinations...");
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
