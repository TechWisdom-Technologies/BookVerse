import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../../../src/app/api/chat/route';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { fetchGeminiWithFallback } from '@/lib/gemini-fallback';
import { fetchGroqWithFallback } from '@/lib/groq-fallback';

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),
}));

vi.mock('@/lib/gemini-fallback', () => ({
  fetchGeminiWithFallback: vi.fn(),
}));

vi.mock('@/lib/groq-fallback', () => ({
  fetchGroqWithFallback: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

describe('Chat API Integration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, GROQ_API_KEY: 'test-key' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns 401 if unauthenticated', async () => {
    (verifyToken as any).mockRejectedValue(new Error('UNAUTHORIZED'));
    
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }] })
    });
    
    const res = await POST(req as any);
    expect(res.status).toBe(401);
  });

  it('calls Gemini API and returns generated text', async () => {
    (verifyToken as any).mockResolvedValue({ dbUser: { id: 'u1' } });
    
    (prisma.book.findMany as any).mockResolvedValue([
      { title: 'Test Book', authorName: 'Test Author', genre: 'Sci-Fi', description: 'Test Desc' }
    ]);
    (prisma.story.findMany as any).mockResolvedValue([
      { title: 'Test Story', author: { displayName: 'Test Creator' }, genre: 'Fantasy', summary: 'Test Summary' }
    ]);

    (fetchGeminiWithFallback as any).mockResolvedValue({
      choices: [{ message: { content: 'This is Gemini response.' } }]
    });

    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Recommend a book' }] })
    });
    
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.text).toBe('This is Gemini response.');
    
    expect(fetchGeminiWithFallback).toHaveBeenCalled();
  });

  it('falls back to Groq if Gemini fails', async () => {
    (verifyToken as any).mockResolvedValue({ dbUser: { id: 'u1' } });
    (prisma.book.findMany as any).mockResolvedValue([]);
    (prisma.story.findMany as any).mockResolvedValue([]);

    (fetchGeminiWithFallback as any).mockRejectedValue(new Error('Gemini Down'));
    
    (fetchGroqWithFallback as any).mockResolvedValue({
      choices: [{ message: { content: 'This is Groq response.' } }]
    });

    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Recommend a book' }] })
    });
    
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.text).toBe('This is Groq response.');
    
    expect(fetchGeminiWithFallback).toHaveBeenCalled();
    expect(fetchGroqWithFallback).toHaveBeenCalled();
  });
});
