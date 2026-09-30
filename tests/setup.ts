/**
 * Global test setup file for Vitest.
 * Configures mocks for external dependencies so unit tests
 * can run without real databases, APIs, or browser APIs.
 */

import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// ─── Mock Prisma Client ──────────────────────────────────────────
// All tests that import from @/lib/prisma will get this mock.
vi.mock('@/lib/prisma', () => {
  const mockPrisma = {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      upsert: vi.fn(),
    },
    loginHistory: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    deviceSession: {
      upsert: vi.fn(),
    },
    story: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    storyChapter: {
      findMany: vi.fn(),
      updateMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    storySearchIndex: {
      upsert: vi.fn(),
    },
    notification: {
      create: vi.fn(),
      createMany: vi.fn(),
    },
    follow: {
      findMany: vi.fn(),
      create: vi.fn(),
      deleteMany: vi.fn(),
    },
    cronJobLog: {
      create: vi.fn(),
    },
    subscriptionTransaction: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    failedWebhookLog: {
      create: vi.fn(),
    },
    scheduledChapter: {
      findMany: vi.fn(),
      delete: vi.fn(),
    },
    comment: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    storyReaction: {
      groupBy: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    readingLog: {
      groupBy: vi.fn(),
    },
    readingProgress: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      delete: vi.fn(),
    },
    rateLimitViolation: {
      create: vi.fn().mockReturnValue({ catch: vi.fn() }),
    },
    slowApiLog: {
      create: vi.fn().mockReturnValue({ catch: vi.fn() }),
    },
    crashReport: {
      create: vi.fn().mockReturnValue({ catch: vi.fn() }),
    },
    aITokenUsage: {
      create: vi.fn().mockReturnValue({ catch: vi.fn() }),
    },
    book: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    universe: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
    series: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
    },
    club: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    contentReport: {
      findMany: vi.fn(),
      count: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    userAchievement: {
      findMany: vi.fn(),
    },
    tip: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    poll: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    pollOption: {
      findUnique: vi.fn(),
    },
    pollVote: {
      findFirst: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    giftMembership: {
      findUnique: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
    },
    onboardingQuiz: {
      findFirst: vi.fn(),
      upsert: vi.fn(),
    },
    bookReview: {
      findMany: vi.fn(),
    }
  } as any;

  mockPrisma.$transaction = vi.fn(async (arg) => {
    if (Array.isArray(arg)) {
      return Promise.all(arg);
    }
    return arg(mockPrisma);
  });
  
  mockPrisma.$queryRaw = vi.fn().mockResolvedValue([]);

  return { prisma: mockPrisma };
});

// ─── Mock Firebase ───────────────────────────────────────────────
vi.mock('@/lib/firebase', () => ({
  auth: {},
  googleProvider: {},
}));

vi.mock('@/lib/firebase-admin', () => ({
  adminAuth: {
    verifyIdToken: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

// ─── Mock Next.js server APIs ────────────────────────────────────
let mockCookiesObj = { get: vi.fn(), set: vi.fn() };
let mockHeadersObj = {
  get: vi.fn((key) => {
    if (key === 'authorization') return 'Bearer valid-token';
    return null;
  }),
};

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => mockCookiesObj),
  headers: vi.fn(async () => mockHeadersObj),
  __setMockCookies: (c: any) => mockCookiesObj = c,
  __setMockHeaders: (h: any) => mockHeadersObj = h,
}));

vi.mock('next/server', () => {
  class MockNextResponse {
    body: any;
    status: number;
    headers: any;
    cookies: any;

    constructor(body: any, init?: { status?: number; headers?: any }) {
      this.body = body;
      this.status = init?.status || 200;
      this.headers = init?.headers || { getSetCookie: () => [] };
      
      const setCookiesList: string[] = [];
      this.headers.getSetCookie = () => setCookiesList;
      this.cookies = {
        set: vi.fn((key, value, opts) => {
          let str = `${key}=${value}`;
          if (opts?.httpOnly) str += '; HttpOnly';
          if (opts?.sameSite) str += `; SameSite=${opts.sameSite}`;
          if (opts?.maxAge === 0) str += '; Max-Age=0';
          setCookiesList.push(str);
        }),
      };
    }

    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
    }

    static json = vi.fn((body: any, init?: { status?: number; headers?: any }) => {
      return new MockNextResponse(body, init);
    });

    static redirect = vi.fn((url: string) => {
      return { status: 307, url };
    });

    static next = vi.fn(() => {
      return { status: 200, type: 'next' };
    });
  }

  return { NextResponse: MockNextResponse };
});

// ─── Stub environment variables for tests ────────────────────────
process.env.COOKIE_SIGNING_SECRET = 'test-secret-key-for-unit-tests-only-32chars';
(process.env as any).NODE_ENV = 'test';
