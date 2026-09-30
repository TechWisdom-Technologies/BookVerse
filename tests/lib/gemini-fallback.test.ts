/**
 * Unit tests for src/lib/gemini-fallback.ts
 *
 * Covers: fetchGeminiWithFallback() — multi-key Gemini API fallback
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchGeminiWithFallback } from '@/lib/gemini-fallback';

describe('fetchGeminiWithFallback()', () => {
  const originalFetch = global.fetch;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    global.fetch = vi.fn();
    // Clear all Gemini keys
    delete process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY_1;
    delete process.env.GEMINI_API_KEY_2;
    delete process.env.GEMINI_API_KEY_3;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  it('throws when no API keys are configured', async () => {
    await expect(
      fetchGeminiWithFallback({ messages: [{ role: 'user', content: 'hello' }] })
    ).rejects.toThrow('No Gemini API keys configured');
  });

  it('returns OpenAI-shaped response on success', async () => {
    process.env.GEMINI_API_KEY_1 = 'test-key-1';

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        candidates: [{ content: { parts: [{ text: 'Hello from Gemini!' }] } }],
        usageMetadata: { totalTokenCount: 10, promptTokenCount: 5, candidatesTokenCount: 5 },
      }),
    });

    const result = await fetchGeminiWithFallback({
      messages: [{ role: 'user', content: 'hello' }],
    });

    expect(result.choices[0].message.content).toBe('Hello from Gemini!');
  });

  it('falls through to next key when first key fails', async () => {
    process.env.GEMINI_API_KEY_1 = 'bad-key';
    process.env.GEMINI_API_KEY_2 = 'good-key';

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: false,
        text: () => Promise.resolve('API key invalid'),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          candidates: [{ content: { parts: [{ text: 'Success with key 2' }] } }],
          usageMetadata: { totalTokenCount: 10 },
        }),
      });

    const result = await fetchGeminiWithFallback({
      messages: [{ role: 'user', content: 'test' }],
    });

    expect(result.choices[0].message.content).toBe('Success with key 2');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('throws when all keys fail', async () => {
    process.env.GEMINI_API_KEY_1 = 'bad-1';
    process.env.GEMINI_API_KEY_2 = 'bad-2';

    (global.fetch as any).mockResolvedValue({
      ok: false,
      text: () => Promise.resolve('Rate limited'),
    });

    await expect(
      fetchGeminiWithFallback({ messages: [{ role: 'user', content: 'test' }] })
    ).rejects.toThrow();
  });

  it('converts system message to systemInstruction', async () => {
    process.env.GEMINI_API_KEY = 'test-key';

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        candidates: [{ content: { parts: [{ text: 'response' }] } }],
        usageMetadata: { totalTokenCount: 5 },
      }),
    });

    await fetchGeminiWithFallback({
      messages: [
        { role: 'system', content: 'You are a book assistant' },
        { role: 'user', content: 'Recommend a book' },
      ],
    });

    const fetchCall = (global.fetch as any).mock.calls[0];
    const body = JSON.parse(fetchCall[1].body);
    expect(body.systemInstruction).toBeDefined();
    expect(body.systemInstruction.parts[0].text).toBe('You are a book assistant');
    // System message should NOT appear in contents
    expect(body.contents.every((c: any) => c.role !== 'system')).toBe(true);
  });

  it('handles network errors gracefully (falls to next key)', async () => {
    process.env.GEMINI_API_KEY_1 = 'key-1';
    process.env.GEMINI_API_KEY_2 = 'key-2';

    (global.fetch as any)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          candidates: [{ content: { parts: [{ text: 'Recovered!' }] } }],
          usageMetadata: { totalTokenCount: 3 },
        }),
      });

    const result = await fetchGeminiWithFallback({
      messages: [{ role: 'user', content: 'test' }],
    });

    expect(result.choices[0].message.content).toBe('Recovered!');
  });
});
