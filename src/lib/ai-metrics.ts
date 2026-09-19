import { prisma } from "@/lib/prisma";

export async function logTokenUsage(
  provider: "GEMINI" | "GROQ" | "CLOUDFLARE_AI" | "POLLINATIONS" | "OPENAI" | "HUGGINGFACE",
  model: string,
  type: "TEXT" | "IMAGE",
  tokens: number,
  userId?: string,
  options?: {
    durationMs?: number;
    promptTokens?: number;
    completionTokens?: number;
  }
) {
  try {
    prisma.aITokenUsage.create({
      data: {
        provider,
        model,
        type,
        tokens,
        userId,
        durationMs: options?.durationMs,
        promptTokens: options?.promptTokens,
        completionTokens: options?.completionTokens,
      }
    }).catch(err => {
      console.error("[TokenTracker] Failed to insert token usage:", err);
    });
  } catch (error) {
    console.error("[TokenTracker] Error:", error);
  }
}
