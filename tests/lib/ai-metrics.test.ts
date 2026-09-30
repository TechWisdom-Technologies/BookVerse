import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logTokenUsage } from '../../src/lib/ai-metrics';
import { prisma } from '@/lib/prisma';

describe('AI Metrics Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs token usage safely without awaiting', () => {
    // We mock create to return a rejected promise so we can test the catch block, 
    // but the function itself is fire-and-forget.
    const mockCatch = vi.fn();
    (prisma.aITokenUsage.create as any).mockReturnValue({ catch: mockCatch });

    logTokenUsage('GEMINI', 'gemini-1.5', 'TEXT', 150, 'user1', {
      durationMs: 500,
      promptTokens: 50,
      completionTokens: 100
    });

    expect(prisma.aITokenUsage.create).toHaveBeenCalledWith({
      data: {
        provider: 'GEMINI',
        model: 'gemini-1.5',
        type: 'TEXT',
        tokens: 150,
        userId: 'user1',
        durationMs: 500,
        promptTokens: 50,
        completionTokens: 100,
      }
    });

    expect(mockCatch).toHaveBeenCalled();
  });

  it('handles synchronous errors during tracking setup', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Force a synchronous error
    (prisma.aITokenUsage.create as any).mockImplementation(() => {
      throw new Error('Database disconnected');
    });

    // Should not throw
    logTokenUsage('GROQ', 'llama-3', 'TEXT', 50);

    expect(consoleSpy).toHaveBeenCalledWith('[TokenTracker] Error:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
