import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const enhancedPrompt = `A professional, high-quality book cover design without any text. Style: ${prompt}. Cinematic lighting, highly detailed, centered composition, suitable for a novel cover.`;

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      enhancedPrompt
    )}`;

    // Fetch the image on the server to prevent CORS or slow-loading broken images on the frontend.
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      throw new Error(`Pollinations API returned ${imageRes.status}`);
    }

    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const mimeType = imageRes.headers.get("content-type") || "image/jpeg";

    // Return as a Data URL so it loads instantly in the <img> tag
    return NextResponse.json({ url: `data:${mimeType};base64,${base64}` });
  } catch (error) {
    console.error("Failed to generate cover:", error);
    return NextResponse.json(
      { error: "Failed to generate cover art" },
      { status: 500 }
    );
  }
}
