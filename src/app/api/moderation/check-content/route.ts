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

    // Call Groq for content moderation
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'Moderation service unavailable' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: `Analyze this text for potentially problematic content. Check for: hate speech, explicit content, harassment, self-harm, illegal activity. Respond with JSON: {"flagged": boolean, "reason": "string if flagged", "severity": "low|medium|high"}. Text: "${sanitizedText}"`,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      console.error('Groq API error:', await response.text());
      return NextResponse.json(
        { error: 'Moderation failed' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0]?.message?.content || '{"flagged": false}');

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
