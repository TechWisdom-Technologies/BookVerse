import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { config } from "dotenv";

config({ path: ".env.local" });

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

async function test() {
  console.log("Testing Groq API Key...");
  try {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: 'Say hello!',
    });
    console.log("Response:", text);
  } catch (e) {
    console.error("GROQ TEST ERROR:", e);
  }
}

test();
