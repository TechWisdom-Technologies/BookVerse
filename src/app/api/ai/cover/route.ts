import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { randomUUID } from "crypto";

export const maxDuration = 60;

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

    // Add random seed to force unique generation each time
    const seed = Math.floor(Math.random() * 999999);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      enhancedPrompt
    )}?seed=${seed}&width=512&height=768&nologo=true`;

    // Fetch generated image
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      console.error(`AI image generation failed: ${imageRes.status}`);
      return NextResponse.json(
        { error: `Image generation failed (Status ${imageRes.status}). Please try again.` },
        { status: 502 }
      );
    }

    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = imageRes.headers.get("content-type") || "image/jpeg";

    // Upload to R2 storage
    const fileKey = `covers/ai-${randomUUID()}.jpg`;
    const persistentUrl = await uploadToR2(fileKey, buffer, mimeType);

    return NextResponse.json({ url: persistentUrl });
  } catch (error: any) {
    console.error("AI cover generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover. Please try again." },
      { status: 500 }
    );
  }
}
