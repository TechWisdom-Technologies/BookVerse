import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Phase 22: Comment HTML Injection & XSS Prevention ───
// Story comments use HTML entity encoding to prevent stored XSS.

vi.mock('@/lib/prisma', () => ({
  prisma: {
    comment: {
      create: vi.fn(),
      count: vi.fn().mockResolvedValue(0),
      findUnique: vi.fn(),
    },
    story: {
      findUnique: vi.fn(),
    },
    user: {
      findUnique: vi.fn().mockResolvedValue(null),
    },
  },
}));

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

vi.mock('@/lib/resend', () => ({
  sendCommentNotification: vi.fn(),
}));

vi.mock('@/lib/notifications', () => ({
  createNotification: vi.fn(),
}));

vi.mock('@/lib/validators', async (importOriginal) => {
  const original = await importOriginal() as any;
  return {
    ...original,
  };
});

import { POST } from '@/app/api/stories/[id]/comments/route';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

describe('Phase 22: Comment XSS Prevention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (verifyToken as any).mockResolvedValue({
      dbUser: { id: 'user1', role: 'MEMBER', username: 'testuser', displayName: 'Test', avatarUrl: null, email: 'test@test.com' },
    });
    (prisma.story.findUnique as any).mockResolvedValue({
      id: 'story1',
      authorId: 'author1',
      title: 'Test Story',
    });
    (prisma.comment.create as any).mockImplementation((args: any) =>
      Promise.resolve({
        id: 'comment1',
        content: args.data.content,
        authorId: args.data.authorId,
        author: { id: 'user1', username: 'testuser', displayName: 'Test', avatarUrl: null },
      })
    );
  });

  it('escapes HTML script tags in comment content to prevent XSS', async () => {
    const xssPayload = '<script>alert("XSS")</script>';

    const req = new Request('http://localhost/api/stories/story1/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: xssPayload }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'story1' }) });
    expect(res.status).toBe(201);

    const createCall = (prisma.comment.create as any).mock.calls[0][0];
    expect(createCall.data.content).not.toContain('<script>');
    expect(createCall.data.content).toContain('&lt;script&gt;');
  });

  it('escapes img onerror XSS payloads', async () => {
    const xssPayload = '<img src=x onerror=alert(1)>';

    const req = new Request('http://localhost/api/stories/story1/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: xssPayload }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'story1' }) });
    expect(res.status).toBe(201);

    const createCall = (prisma.comment.create as any).mock.calls[0][0];
    expect(createCall.data.content).not.toContain('<img');
    expect(createCall.data.content).toContain('&lt;img');
  });

  it('escapes event handler injection in comments', async () => {
    const xssPayload = '<div onmouseover="steal(document.cookie)">hover</div>';

    const req = new Request('http://localhost/api/stories/story1/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: xssPayload }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'story1' }) });
    expect(res.status).toBe(201);

    const createCall = (prisma.comment.create as any).mock.calls[0][0];
    expect(createCall.data.content).not.toContain('<div');
    expect(createCall.data.content).toContain('&lt;div');
  });
});
