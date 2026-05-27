import { headers } from "next/headers";
import { NextResponse } from "next/server";

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

function rateLimit(ip: string, limit: number, windowMs: number): { success: boolean; limit: number; remaining: number } {
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

/**
 * Helper to check rate limits for incoming Next.js App Router requests.
 */
export async function checkRateLimit(limit = 60, windowMs = 60000) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "127.0.0.1";
  
  const result = rateLimit(ip, limit, windowMs);
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
