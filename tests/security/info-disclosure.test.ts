/**
 * Phase 9: Error Handling & Information Disclosure
 * Tests that error responses never leak internal server information.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as getUser } from '../../src/app/api/users/me/route';
import { PATCH as updateMetadata } from '../../src/app/api/stories/[id]/metadata/route';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),
  getAuth: vi.fn(),
}));

describe('Phase 9: Error Handling & Information Disclosure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hides Prisma connection/syntax errors behind generic messages (GET user)', async () => {
    const { verifyToken } = await import('@/lib/auth');
    (verifyToken as any).mockResolvedValue({ dbUser: { id: 'u1' } });
    
    // Force a Prisma error that might contain file paths or DB credentials
    (prisma.user.findUnique as any).mockRejectedValue(
      new Error('PrismaClientInitializationError: Error in d:\\Running works\\...')
    );

    const req = new Request('http://localhost/api/users/me');
    const res = await getUser(req as any);
    expect(res.status).toBe(500);
    const data = await res.json();
    
    // Ensure the sensitive path is NOT leaked
    expect(data.error).toBe('Failed to fetch user');
    expect(JSON.stringify(data)).not.toContain('d:\\Running works');
  });

  it('hides JSON parse errors', async () => {
    (getAuth as any).mockResolvedValue({ id: 'u1' });
    (prisma.story.findUnique as any).mockResolvedValue({ authorId: 'u1' });

    // Provide a malformed JSON body
    const req = {
      json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected token < in JSON at position 0')),
    } as any;

    const res = await updateMetadata(req, { params: Promise.resolve({ id: 's1' }) });
    expect(res.status).toBe(500);
    const data = await res.json();
    
    expect(data.error).toBe('Failed to update');
    expect(JSON.stringify(data)).not.toContain('Unexpected token');
  });
});
