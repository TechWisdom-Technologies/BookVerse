import { headers } from "next/headers";
import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Upstash Redis-backed rate limiter (works across serverless invocations)
// Falls back to an in-memory Map when UPSTASH env vars are not set (local dev).
// ---------------------------------------------------------------------------

let _ratelimit: import("@upstash/ratelimit").Ratelimit | null = null;
let _useUpstash = false;
let _initialized = false;

async function getUpstashRatelimit(limit: number, windowMs: number) {
  if (!_initialized) {
    _initialized = true;
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (url && token) {
      try {
        const { Redis } = await import("@upstash/redis");
        const { Ratelimit } = await import("@upstash/ratelimit");
        // We don't cache the instance because limit/window can vary per call.
        // Instead we mark Upstash as available and build per-call below.
        _useUpstash = true;
      } catch {
        _useUpstash = false;
      }
    }
  }

  if (!_useUpstash) return null;

  const { Redis } = await import("@upstash/redis");
  const { Ratelimit } = await import("@upstash/ratelimit");

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const windowSec = Math.max(1, Math.ceil(windowMs / 1000));

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
    analytics: false,
    prefix: "rl",
  });
}

// ---------------------------------------------------------------------------
// In-memory fallback (local development only)
// ---------------------------------------------------------------------------
type RateLimitStore = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitStore>();

// Background interval to garbage collect expired keys and prevent memory leaks
if (typeof global !== "undefined") {
  const g = global as typeof globalThis & { __rateLimitCleanupInterval?: NodeJS.Timeout };
  if (!g.__rateLimitCleanupInterval) {
    g.__rateLimitCleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of store.entries()) {
        if (now > value.resetTime) {
          store.delete(key);
        }
      }
    }, 60000);
  }
}

function rateLimitInMemory(ip: string, limit: number, windowMs: number): { success: boolean; limit: number; remaining: number } {
  const now = Date.now();
  const record = store.get(ip);

  if (!record) {
    store.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, limit, remaining: limit - 1 };
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return { success: true, limit, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, limit, remaining: 0 };
  }

  record.count += 1;
  return { success: true, limit, remaining: limit - record.count };
}

// ---------------------------------------------------------------------------
// Public API — drop-in replacement. Same signature as before.
// ---------------------------------------------------------------------------

/**
 * Helper to check rate limits for incoming Next.js App Router requests.
 * Uses Upstash Redis in production, in-memory Map in development.
 */
export async function checkRateLimit(limit = 60, windowMs = 60000) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "127.0.0.1";

  // Try Upstash first
  try {
    const rl = await getUpstashRatelimit(limit, windowMs);
    if (rl) {
      const result = await rl.limit(ip);
      if (!result.success) {
        return {
          limited: true,
          response: NextResponse.json(
            { error: "Too many requests. Please try again later." },
            {
              status: 429,
              headers: {
                "Retry-After": Math.ceil(windowMs / 1000).toString(),
                "X-RateLimit-Limit": limit.toString(),
                "X-RateLimit-Remaining": "0",
              },
            }
          ),
        };
      }
      return { limited: false, remaining: result.remaining };
    }
  } catch (err) {
    // Upstash unavailable — fall through to in-memory
    console.warn("[rate-limit] Upstash error, falling back to in-memory:", err);
  }

  // In-memory fallback (local dev / Upstash unavailable)
  const result = rateLimitInMemory(ip, limit, windowMs);
  if (!result.success) {
    return {
      limited: true,
      response: NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(windowMs / 1000).toString(),
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      ),
    };
  }
  
  return { limited: false, remaining: result.remaining };
}
