/**
 * Unit tests for src/lib/groq-fallback.ts
 *
 * Covers: fetchGroqWithFallback() — multi-key Groq API fallback
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchGroqWithFallback } from '@/lib/groq-fallback';

describe('fetchGroqWithFallback()', () => {
  const originalFetch = global.fetch;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    global.fetch = vi.fn();
    // Clear all Groq keys
    delete process.env.GROQ_API_KEY;
    delete process.env.GROQ_API_KEY_1;
    delete process.env.GROQ_API_KEY_2;
    delete process.env.GROQ_API_KEY_3;
    delete process.env.GROQ_API_KEY_4;
    delete process.env.GROQ_API_KEY_5;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  it('throws when no API keys are configured', async () => {
    await expect(
      fetchGroqWithFallback({ model: 'llama-3.3-70b-versatile', messages: [] })
    ).rejects.toThrow('No Groq API keys configured');
  });

  it('returns data on successful API call', async () => {
    process.env.GROQ_API_KEY_1 = 'test-key';

    const mockResponse = {
      choices: [{ message: { content: 'Hello from Groq!' } }],
      usage: { total_tokens: 15, prompt_tokens: 10, completion_tokens: 5 },
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchGroqWithFallback({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Hello' }],
    });

    expect(result.choices[0].message.content).toBe('Hello from Groq!');
  });

  it('sends correct Authorization header', async () => {
    process.env.GROQ_API_KEY_1 = 'my-secret-key';

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [], usage: {} }),
    });

    await fetchGroqWithFallback({ model: 'test', messages: [] });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.groq.com/openai/v1/chat/completions',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Bearer my-secret-key',
        }),
      })
    );
  });

  it('falls through to next key on 429 (rate limit)', async () => {
    process.env.GROQ_API_KEY_1 = 'rate-limited-key';
    process.env.GROQ_API_KEY_2 = 'working-key';

    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        text: () => Promise.resolve('Rate limit exceeded'),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'Success with key 2' } }],
          usage: { total_tokens: 5 },
        }),
      });

    const result = await fetchGroqWithFallback({ model: 'test', messages: [] });
    expect(result.choices[0].message.content).toBe('Success with key 2');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('throws last error when all keys fail', async () => {
    process.env.GROQ_API_KEY_1 = 'bad-1';
    process.env.GROQ_API_KEY_2 = 'bad-2';

    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve('Unauthorized'),
    });

    await expect(
      fetchGroqWithFallback({ model: 'test', messages: [] })
    ).rejects.toThrow('Groq API error');
  });

  it('recovers from network errors by trying next key', async () => {
    process.env.GROQ_API_KEY_1 = 'network-error-key';
    process.env.GROQ_API_KEY_2 = 'working-key';

    (global.fetch as any)
      .mockRejectedValueOnce(new Error('ECONNREFUSED'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'Recovered!' } }],
          usage: { total_tokens: 3 },
        }),
      });

    const result = await fetchGroqWithFallback({ model: 'test', messages: [] });
    expect(result.choices[0].message.content).toBe('Recovered!');
  });

  it('uses GROQ_API_KEY as final fallback', async () => {
    process.env.GROQ_API_KEY = 'fallback-key';

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        choices: [{ message: { content: 'Fallback success' } }],
        usage: { total_tokens: 2 },
      }),
    });

    const result = await fetchGroqWithFallback({ model: 'test', messages: [] });
    expect(result.choices[0].message.content).toBe('Fallback success');
  });
});
