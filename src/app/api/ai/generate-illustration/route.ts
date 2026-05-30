import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { uploadToR2 } from "@/lib/r2";
import { randomUUID } from "crypto";

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

    // 3. Call Pollinations AI (Free, No Auth, Fast)
    const pollinationUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1200&height=600&nologo=true`;
    
    const imageResponse = await fetch(pollinationUrl);

    if (!imageResponse.ok) {
      console.error("Pollinations API error:", imageResponse.statusText);
      return NextResponse.json(
        { error: "Failed to generate image from AI provider." },
        { status: 500 }
      );
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

    // Upload directly to Cloudflare R2
    const fileKey = `illustrations/ai-${randomUUID()}.jpg`;
    const secureUrl = await uploadToR2(fileKey, buffer, mimeType);

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
