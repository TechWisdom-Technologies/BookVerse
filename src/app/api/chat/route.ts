import { createGroq } from '@ai-sdk/groq';
import { streamText, generateText } from 'ai';

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

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `You are the BookVerse AI Librarian, a helpful, enthusiastic, and knowledgeable assistant for a digital library platform. 
      Your job is to recommend books, genres, and community stories based on the user's mood or interests.
      Keep your answers concise, engaging, and friendly. If a user asks for something dark and twisty, recommend thrillers or dark fantasy.
      Always encourage users to read more!`,
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
