import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 60; // DALL-E generation can take a bit of time

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Enhance the prompt to ensure it generates a good book cover
    const enhancedPrompt = `A professional, high-quality book cover design without any text. Style: ${prompt}. Cinematic lighting, highly detailed, centered composition, suitable for a novel cover.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("No image URL returned by OpenAI");
    }

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Failed to generate cover:", error);
    return NextResponse.json(
      { error: "Failed to generate cover art" },
      { status: 500 }
    );
  }
}
