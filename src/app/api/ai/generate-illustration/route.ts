import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { uploadToR2 } from "@/lib/r2";
import { randomUUID } from "crypto";

export const maxDuration = 60;

/**
 * Generate an AI chapter illustration.
 * Strategy: Hugging Face (primary) → Pollinations (fallback)
 */
async function generateWithHuggingFace(prompt: string): Promise<Buffer | null> {
  const token = process.env.HF_ACCESS_TOKEN;
  if (!token) {
    console.warn("[AI Illustration] No HF_ACCESS_TOKEN set, skipping Hugging Face.");
    return null;
  }

  const model = "black-forest-labs/FLUX.1-schnell";
  const apiUrl = `https://router.huggingface.co/hf-inference/models/${model}`;

  console.log("[AI Illustration] Trying Hugging Face:", model);

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
          width: 1024,
          height: 512,
        },
      }),
    });

    if (!res.ok) {
      const status = res.status;
      const body = await res.text().catch(() => "");
      console.warn(`[AI Illustration] Hugging Face returned ${status}: ${body.slice(0, 200)}`);
      return null;
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      console.warn(`[AI Illustration] Hugging Face returned non-image content-type: ${contentType}`);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length < 5000) {
      console.warn(`[AI Illustration] Hugging Face returned suspiciously small image (${buffer.length} bytes)`);
      return null;
    }

    console.log(`[AI Illustration] Hugging Face success! Image size: ${buffer.length} bytes`);
    return buffer;
  } catch (err) {
    console.warn("[AI Illustration] Hugging Face fetch error:", err);
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
  try {
    const { dbUser } = await verifyToken();

    // Check if user is author or admin (basic protection)
    if (dbUser.role !== "AUTHOR" && dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    // Strategy: Try Hugging Face first, fallback to Pollinations
    let imageBuffer = await generateWithHuggingFace(enhancedPrompt);

    if (!imageBuffer) {
      console.log("[AI Illustration] Hugging Face unavailable, falling back to Pollinations...");
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
