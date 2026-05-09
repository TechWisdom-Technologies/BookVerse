import { NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth';

export async function POST(req: Request) {
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

    // Get API key from environment
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    // Define prompts for each action
    const prompts: Record<string, string> = {
      rewrite: `Rewrite the following text to be more engaging and clear, maintaining the original meaning:\n\n${text}`,
      expand: `Expand the following text with more details and examples while maintaining the original tone:\n\n${text}`,
      summarize: `Summarize the following text in 2-3 sentences:\n\n${text}`,
      grammar: `Fix any grammar and spelling errors in the following text without changing the meaning:\n\n${text}`,
      tone: `Rewrite the following text in a more professional and formal tone:\n\n${text}`,
    };

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
            content: prompts[action],
          },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error('Groq API error:', await response.text());
      return NextResponse.json(
        { error: 'Failed to process with AI' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const suggestions = data.choices[0]?.message?.content || '';

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
