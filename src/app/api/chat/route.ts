import { withPerformanceLogger } from "@/lib/api-logger";
import { NextRequest, NextResponse } from "next/server";
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { fetchGeminiWithFallback } from "@/lib/gemini-fallback";
import { fetchGroqWithFallback } from "@/lib/groq-fallback";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const postHandler = async (req: NextRequest) => {
  // Rate limit: 10 AI chat messages per minute per IP
  const limitRes = await checkRateLimit(10, 60000);
  if (limitRes.limited) return limitRes.response;

  try {
    // Require authentication to prevent anonymous API credit abuse
    await verifyToken();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("GROQ_API_KEY is missing from environment variables");
      return new Response(JSON.stringify({ error: 'API Key missing' }), { status: 500 });
    }

    const body = await req.json();
    console.log("AI Librarian received body keys:", Object.keys(body));

    // Handle different possible message formats from various SDK versions
    let messages = body.messages || [];
    if (body.parts && !messages.length) {
      messages = [{ role: 'user', content: body.parts[0]?.text || '' }];
    } else if (body.content && !messages.length) {
      messages = [{ role: 'user', content: body.content }];
    }

    // Fetch a curated subset of books and stories to ground the AI without hitting token limits
    const [books, stories] = await Promise.all([
      prisma.book.findMany({
        take: 12,
        orderBy: { downloadCount: "desc" },
        select: {
          id: true,
          title: true,
          authorName: true,
          genre: true,
          description: true,
        },
      }),
      prisma.story.findMany({
        where: { published: true },
        take: 12,
        orderBy: { viewCount: "desc" },
        select: {
          id: true,
          title: true,
          genre: true,
          summary: true,
          description: true,
          author: {
            select: {
              username: true,
              displayName: true,
            },
          },
        },
      }),
    ]);

    const truncate = (text: string | null, maxLen: number = 100) => {
      if (!text) return "No details provided.";
      return text.length > maxLen ? text.substring(0, maxLen) + "..." : text;
    };

    const booksList = books
      .map((b) => `- "${b.title}" by ${b.authorName} (Genre: ${b.genre}) - ${truncate(b.description)}`)
      .join("\n");

    const storiesList = stories
      .map((s) => `- "${s.title}" by ${s.author.displayName || s.author.username} (Genre: ${s.genre || 'General'}) - ${truncate(s.summary || s.description)}`)
      .join("\n");

    let responseText = '';
    const systemPrompt = `You are the BookVerse AI Librarian, a helpful, enthusiastic, and knowledgeable assistant for a digital library platform. 

      CRITICAL RULE: You must ONLY recommend books and community stories that exist in our database. Do NOT recommend any books or stories that are not on the lists below. If there are no books or stories matching the user's specific request, politely tell them that and suggest the closest matches from our available lists instead.

      Here is the list of available Books in the BookVerse library:
      ${booksList || 'No books available in the database.'}

      Here is the list of available Community Stories in the BookVerse library:
      ${storiesList || 'No community stories available in the database.'}

      Format your response professionally and cleanly. When recommending books or stories:
      - Use bullet points (start the line with a dash) for each recommendation.
      - Make sure there is a blank line between each recommendation for readability.
      - State the title and author clearly.
      - Provide a concise, engaging explanation of why it fits their interest.
      
      Do NOT use Markdown syntax like **asterisks** for bolding. Structure your answer clearly with plain text spacing and always encourage users to read more!`;

    const sanitizedMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      // 1. Try Gemini First
      const data = await fetchGeminiWithFallback({
        messages: [{ role: 'system', content: systemPrompt }, ...sanitizedMessages],
        temperature: 0.7,
      });
      responseText = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    } catch (geminiErr: any) {
      console.warn('Gemini Chat failed, falling back to Groq...', geminiErr);
      
      // 2. Fallback to Groq
      try {
        const data = await fetchGroqWithFallback({
          model: 'openai/gpt-oss-20b',
          messages: [{ role: 'system', content: systemPrompt }, ...sanitizedMessages],
          max_tokens: 1024,
          temperature: 0.7,
        });
        responseText = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
      } catch (groqErr: any) {
        console.error('All AI keys (Gemini, Groq) failed:', groqErr);
        return NextResponse.json({ error: 'Failed to process with AI' }, { status: 500 });
      }
    }

    return new Response(JSON.stringify({ text: responseText }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.error("AI API CRITICAL ERROR:", error);
    return new Response(JSON.stringify({ error: 'The AI assistant is temporarily unavailable. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const POST = withPerformanceLogger(postHandler as any, "/api/chat");
