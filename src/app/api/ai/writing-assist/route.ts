import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  // Rate limit: Max 10 AI writing requests per minute per IP
  const limitRes = await checkRateLimit(10, 60000);
  if (limitRes.limited) return limitRes.response;

  try {
    const user = await getAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { text, action } = body;

    if (!text || !action) {
      return NextResponse.json(
        { error: 'Text and action are required' },
        { status: 400 }
      );
    }

    // Valid actions: rewrite, expand, summarize, grammar, tone
    const validActions = ['rewrite', 'expand', 'summarize', 'grammar', 'tone'];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Define prompts for each action
    const prompts: Record<string, string> = {
      rewrite: `Rewrite the following text to be more engaging and clear, maintaining the original meaning:\n\n${text}`,
      expand: `Expand the following text with more details and examples while maintaining the original tone:\n\n${text}`,
      summarize: `Summarize the following text in 2-3 sentences:\n\n${text}`,
      grammar: `Fix any grammar and spelling errors in the following text without changing the meaning:\n\n${text}`,
      tone: `Rewrite the following text in a more professional and formal tone:\n\n${text}`,
    };

    let suggestions = '';

    try {
      // 1. Try Gemini First
      const { fetchGeminiWithFallback } = require('@/lib/gemini-fallback');
      const data = await fetchGeminiWithFallback({
        messages: [{ role: 'user', content: prompts[action] }],
        temperature: 0.7,
      });
      suggestions = data.choices[0]?.message?.content || '';
    } catch (geminiErr: any) {
      console.warn('Gemini failed, falling back to Groq...', geminiErr);
      
      // 2. Fallback to Groq
      try {
        const { fetchGroqWithFallback } = require('@/lib/groq-fallback');
        const data = await fetchGroqWithFallback({
          model: 'openai/gpt-oss-20b',
          messages: [{ role: 'user', content: prompts[action] }],
          max_tokens: 1024,
          temperature: 0.7,
        });
        suggestions = data.choices[0]?.message?.content || '';
      } catch (groqErr: any) {
        console.error('All AI keys (Gemini, Groq) failed:', groqErr);
        return NextResponse.json({ error: 'Failed to process with AI' }, { status: 500 });
      }
    }

    return NextResponse.json({
      original: text,
      action,
      suggestion: suggestions.trim(),
    });
  } catch (error) {
    console.error('Error in AI writing assistant:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
