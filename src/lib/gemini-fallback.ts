import { logTokenUsage } from './ai-metrics';

export async function fetchGeminiWithFallback(options: any) {
  const keys = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY 
  ].filter(Boolean) as string[];

  if (keys.length === 0) {
    throw new Error('No Gemini API keys configured');
  }

  let lastError = null;

  // Convert OpenAI messages format to native Gemini multi-turn format
  let systemInstruction = undefined;
  const contents = [];
  
  for (const msg of options.messages) {
    if (msg.role === 'system') {
      systemInstruction = { parts: [{ text: msg.content }] };
    } else {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }
  }

  const payload: any = { contents };
  if (systemInstruction) {
    payload.systemInstruction = systemInstruction;
  }
  
  const generationConfig: any = {};
  if (options.temperature !== undefined) {
    generationConfig.temperature = options.temperature;
  }
  if (options.response_format?.type === 'json_object') {
    generationConfig.responseMimeType = "application/json";
  }
  if (Object.keys(generationConfig).length > 0) {
    payload.generationConfig = generationConfig;
  }

  for (const key of keys) {
    const startTime = performance.now();
    try {
      // Using gemini-2.5-flash as it is fully supported by your specific API keys
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Gemini key ${key.substring(0, 8)}... failed:`, errorText);
        lastError = new Error(`Gemini API error: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Log token usage asynchronously
      const tokens = data.usageMetadata?.totalTokenCount || 0;
      const promptTokens = data.usageMetadata?.promptTokenCount || 0;
      const completionTokens = data.usageMetadata?.candidatesTokenCount || 0;
      const durationMs = Math.round(performance.now() - startTime);

      if (tokens > 0) {
        logTokenUsage('GEMINI', 'gemini-2.5-flash', 'TEXT', tokens, undefined, {
          durationMs,
          promptTokens,
          completionTokens
        });
      }

      // Return in OpenAI-like shape so the caller doesn't have to change their parsing logic
      return {
        choices: [
          {
            message: {
              content: text
            }
          }
        ]
      };
    } catch (err: any) {
      console.warn(`Gemini key ${key.substring(0, 8)}... network error:`, err.message);
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error('All Gemini keys failed');
}
