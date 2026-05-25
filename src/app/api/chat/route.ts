import { createGroq } from '@ai-sdk/groq';
import { streamText, generateText } from 'ai';
import { prisma } from "@/lib/prisma";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
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

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `You are the BookVerse AI Librarian, a helpful, enthusiastic, and knowledgeable assistant for a digital library platform. 

      CRITICAL RULE: You must ONLY recommend books and community stories that exist in our database. Do NOT recommend any books or stories that are not on the lists below. If there are no books or stories matching the user's specific request, politely tell them that and suggest the closest matches from our available lists instead.

      Here is the list of available Books in the BookVerse library:
      ${booksList || 'No books available in the database.'}

      Here is the list of available Community Stories in the BookVerse library:
      ${storiesList || 'No community stories available in the database.'}

      Keep your answers concise, engaging, and friendly. When recommending a book or story, state its title and author, and explain in one exciting sentence why it fits their interest based on its description/summary. Always encourage users to read more!`,
      messages,
    });

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("AI API CRITICAL ERROR:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
