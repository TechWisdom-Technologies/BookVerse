import { NextResponse } from 'next/server';
import { verifyToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Rate limit: 5 moderation requests per minute per IP
  const limitRes = await checkRateLimit(5, 60000);
  if (limitRes.limited) return limitRes.response;

  try {
    // Require authentication to prevent unauthenticated resource abuse
    await verifyToken();

    const body = await req.json();
    const { text, storyId } = body;

    if (!text) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 });
    }

    // Sanitize text to prevent prompt injection by escaping quotes and limiting length
    const sanitizedText = String(text).replace(/"/g, '\\"').slice(0, 5000);
    const promptContent = `Analyze this text for potentially problematic content. Check for: hate speech, explicit content, harassment, self-harm, illegal activity. Respond with JSON: {"flagged": boolean, "reason": "string if flagged", "severity": "low|medium|high"}. Text: "${sanitizedText}"`;

    let responseContent = '{"flagged": false}';

    try {
      // 1. Try Gemini First
      const { fetchGeminiWithFallback } = require('@/lib/gemini-fallback');
      const data = await fetchGeminiWithFallback({
        messages: [{ role: 'user', content: promptContent }],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });
      responseContent = data.choices[0]?.message?.content || '{"flagged": false}';
    } catch (geminiErr: any) {
      console.warn('Gemini moderation failed, falling back to Groq...', geminiErr);
      
      // 2. Fallback to Groq
      try {
        const { fetchGroqWithFallback } = require('@/lib/groq-fallback');
        const data = await fetchGroqWithFallback({
          model: 'openai/gpt-oss-20b',
          messages: [{ role: 'user', content: promptContent }],
          temperature: 0.3,
          max_tokens: 200
        });
        responseContent = data.choices[0]?.message?.content || '{"flagged": false}';
      } catch (groqErr: any) {
        console.error('All AI keys (Gemini, Groq) failed:', groqErr);
        return NextResponse.json({ error: 'Moderation failed' }, { status: 500 });
      }
    }

    // Clean up potential markdown formatting before parsing
    const cleanedContent = responseContent.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();
    
    let result;
    try {
      result = JSON.parse(cleanedContent);
    } catch (e) {
      console.error("Failed to parse JSON:", cleanedContent);
      result = { flagged: false, reason: "Failed to parse", severity: "low" };
    }

    return NextResponse.json({
      flagged: result.flagged,
      reason: result.reason,
      severity: result.severity || 'low',
      storyId,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in moderation:', error);
    return NextResponse.json({ error: 'Moderation error' }, { status: 500 });
  }
}
