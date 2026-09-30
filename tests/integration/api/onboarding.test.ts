import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../../../src/app/api/onboarding/quiz/route';
import { getAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limit';

vi.mock('@/lib/auth', () => ({
  getAuth: vi.fn(),
}));

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: vi.fn().mockResolvedValue({ limited: false }),
}));

describe('Onboarding Quiz API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/onboarding/quiz', () => {
    it('returns 401 if unauthenticated', async () => {
      (getAuth as any).mockResolvedValue(null);
      const req = new Request('http://localhost/api/onboarding/quiz');
      const res = await GET(req as any);
      expect(res.status).toBe(401);
    });

    it('returns 200 with completed: false if quiz not found', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (prisma.onboardingQuiz.findFirst as any).mockResolvedValue(null);

      const req = new Request('http://localhost/api/onboarding/quiz');
      const res = await GET(req as any);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.completed).toBe(false);
    });

    it('returns quiz data if found', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (prisma.onboardingQuiz.findFirst as any).mockResolvedValue({
        id: 'q1',
        genrePreferences: ['Sci-Fi']
      });

      const req = new Request('http://localhost/api/onboarding/quiz');
      const res = await GET(req as any);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.genrePreferences).toContain('Sci-Fi');
    });
  });

  describe('POST /api/onboarding/quiz', () => {
    it('returns 401 if unauthenticated', async () => {
      (getAuth as any).mockResolvedValue(null);
      const req = new Request('http://localhost/api/onboarding/quiz', {
        method: 'POST',
        body: JSON.stringify({})
      });
      const res = await POST(req as any);
      expect(res.status).toBe(401);
    });

    it('returns 400 if genrePreferences is missing', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      const req = new Request('http://localhost/api/onboarding/quiz', {
        method: 'POST',
        body: JSON.stringify({ genrePreferences: [] })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toMatch(/genre preference is required/i);
    });

    it('upserts quiz and updates user details', async () => {
      (getAuth as any).mockResolvedValue({ id: 'u1' });
      (prisma.onboardingQuiz.upsert as any).mockResolvedValue({
        id: 'q2',
        completed: true
      });
      (prisma.user.update as any).mockResolvedValue({});

      const req = new Request('http://localhost/api/onboarding/quiz', {
        method: 'POST',
        body: JSON.stringify({
          genrePreferences: ['Fantasy'],
          readingLevel: 'EXPERT',
          phoneNumber: '123456789'
        })
      });
      const res = await POST(req as any);
      expect(res.status).toBe(201);
      
      expect(prisma.onboardingQuiz.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({ genrePreferences: ['Fantasy'] }),
          create: expect.objectContaining({ genrePreferences: ['Fantasy'] })
        })
      );
      
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'u1' },
          data: expect.objectContaining({ phoneNumber: '123456789' })
        })
      );
    });
  });
});
