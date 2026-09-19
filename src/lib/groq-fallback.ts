export async function fetchGroqWithFallback(body: any) {
  // Collect all Groq API keys available in the environment
  const keys = [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY_4,
    process.env.GROQ_API_KEY_5,
    process.env.GROQ_API_KEY // the original key as a final fallback
  ].filter(Boolean) as string[];

  if (keys.length === 0) {
    throw new Error('No Groq API keys configured');
  }

  let lastError = null;

  // Try each key sequentially
  for (const key of keys) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Groq key ${key.substring(0, 8)}... failed with status ${response.status}:`, errorText);
        lastError = new Error(`Groq API error: ${response.status} - ${errorText}`);
        continue; // Try next key
      }

      return await response.json();
    } catch (err: any) {
      console.warn(`Groq key ${key.substring(0, 8)}... network error:`, err.message);
      lastError = err;
      continue; // Try next key
    }
  }

  throw lastError || new Error('All Groq keys failed');
}
