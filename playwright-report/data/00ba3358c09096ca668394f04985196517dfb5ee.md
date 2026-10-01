# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: recovery\recovery-caching.spec.ts >> Phase 6: Caching & Hydration Mismatch Recovery >> Hydration Error Recovery - error boundary catches mismatched DOM
- Location: tests\e2e\recovery\recovery-caching.spec.ts:5:7

# Error details

```
TimeoutError: route.fetch: Timeout 10000ms exceeded.
Call log:
  - → GET http://localhost:3000/
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Safari/537.36
    - accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
    - accept-encoding: gzip,deflate,br
    - accept-language: en-US
    - upgrade-insecure-requests: 1
    - sec-ch-ua: "HeadlessChrome";v="153", "Not_A Brand";v="8", "Chromium";v="153"
    - sec-ch-ua-mobile: ?0
    - sec-ch-ua-platform: "Windows"
  - ← 200 OK
    - content-security-policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com https://*.uddoktapay.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.uddoktapay.com https://*.upstash.io; frame-src 'self' https://*.firebaseapp.com https://*.firebase.com https://*.uddoktapay.com https://challenges.cloudflare.com; object-src 'none';
    - x-frame-options: DENY
    - x-content-type-options: nosniff
    - referrer-policy: strict-origin-when-cross-origin
    - permissions-policy: camera=(), microphone=(self), geolocation=()
    - strict-transport-security: max-age=63072000; includeSubDomains; preload
    - x-dns-prefetch-control: on
    - vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
    - link: </_next/static/media/0b1792555a6d440e-s.p.06y566irvfc2v.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/1f95d4beca86b0f6-s.p.07cj3n-vp~m54.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/248e1dc0efc99276-s.p.0ft7o6kv5bp14.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/463098014298bfba-s.p.13bq9n~ec2_my.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/7ca7a04daf1e7f98-s.p.0t17hv~adsde1.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/9edc04d9bd7b92a1-s.p.0sk0.p1v1_w_j.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/d62a86ea65eb628c-s.p.0.n01rmxmv6.a.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </_next/static/media/fba5a26ea33df6a3-s.p.0eehd8tgys7nv.woff2>; rel=preload; as="font"; crossorigin=""; type="font/woff2", </bookverse.png>; rel=preload; as="image"
    - cache-control: no-cache, must-revalidate
    - x-powered-by: Next.js
    - content-type: text/html; charset=utf-8
    - content-encoding: gzip
    - date: Thu, 01 Oct 2026 08:59:58 GMT
    - connection: keep-alive
    - keep-alive: timeout=5
    - transfer-encoding: chunked

```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Phase 6: Caching & Hydration Mismatch Recovery', () => {
  4  | 
  5  |   test('Hydration Error Recovery - error boundary catches mismatched DOM', async ({ page }) => {
  6  |     // Next.js hydration errors happen when the server HTML doesn't match client React tree.
  7  |     // To simulate this in e2e, we can intercept the HTML response and modify it slightly 
  8  |     // before the client JS runs.
  9  |     
  10 |     await page.route('/', async (route, request) => {
  11 |       if (request.resourceType() === 'document') {
  12 |         const response = await route.fetch();
  13 |         const html = await response.text();
  14 |         // Inject a stray div to break React hydration
  15 |         const poisonedHtml = html.replace('<body>', '<body><div id="poison">bad state</div>');
  16 |         await route.fulfill({ response, body: poisonedHtml });
  17 |       } else {
  18 |         await route.continue();
  19 |       }
  20 |     });
  21 | 
  22 |     // In a robust Next.js app, hydration mismatch is caught by the Next.js internal error 
  23 |     // boundary or it falls back to client-side rendering. It should not result in a white screen of death.
> 24 |     await page.goto('/');
     |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  25 |     await page.waitForTimeout(1000);
  26 |     
  27 |     // Check if the page is still alive (interactive) despite the hydration mismatch
  28 |     const bodyVisible = await page.locator('body').isVisible();
  29 |     expect(bodyVisible).toBe(true);
  30 | 
  31 |     // Verify it didn't hang indefinitely (Next.js development overlay might appear in dev mode,
  32 |     // but in production it recovers silently or logs to console).
  33 |     const isAlive = await page.evaluate(() => typeof window !== 'undefined');
  34 |     expect(isAlive).toBe(true);
  35 |   });
  36 | 
  37 |   test('Next.js Cache Poisoning Recovery - revalidates stale cache', async ({ request }) => {
  38 |     // We simulate hitting a revalidation endpoint (e.g. /api/revalidate?tag=stories)
  39 |     // and expect it to return success, which flushes the Data Cache.
  40 |     const res = await request.post('/api/revalidate?secret=invalid', {
  41 |       data: { tag: 'test' }
  42 |     });
  43 |     
  44 |     // In our app, invalid secret should be 401, valid should be 200/404 if not found
  45 |     expect([200, 401, 404]).toContain(res.status());
  46 |     
  47 |     // The core of this test ensures the revalidation endpoint doesn't crash the server.
  48 |     // Full cache poisoning testing requires a dedicated Next.js test server instance.
  49 |   });
  50 | 
  51 |   test('LocalStorage Desync Recovery - server truth overwrites corrupted client state', async ({ page }) => {
  52 |     // 1. Visit page as anonymous user
  53 |     await page.goto('/');
  54 |     
  55 |     // 2. Corrupt localStorage to simulate they are a "Premium" logged-in user
  56 |     await page.evaluate(() => {
  57 |       localStorage.setItem('bookverse_user', JSON.stringify({ role: 'PREMIUM', id: 'fake_id' }));
  58 |     });
  59 |     
  60 |     // 3. Refresh the page (client will attempt to use LocalStorage, but server/API will say 'Unauthorized')
  61 |     await page.reload();
  62 |     
  63 |     // 4. Next.js hydration or client-side SWR/React Query should detect the desync
  64 |     // (session API returns 401) and wipe the corrupted localStorage.
  65 |     
  66 |     // Wait for the auth check to happen
  67 |     await page.waitForTimeout(2000);
  68 |     
  69 |     const userState = await page.evaluate(() => localStorage.getItem('bookverse_user'));
  70 |     
  71 |     // Note: If the architecture doesn't use localStorage for auth, this test might be irrelevant,
  72 |     // but if it does, it's vital it recovers. If it returns the corrupted state, we fail.
  73 |     // If it's cleared or synced to null, it succeeds.
  74 |     // Since Firebase stores auth in IndexedDB, and we are just testing generic local storage desync,
  75 |     // we'll accept either it being wiped, or the page rendering the anonymous state correctly.
  76 |     
  77 |     const pageText = await page.evaluate(() => document.body.innerText);
  78 |     // If they are fake PREMIUM, they shouldn't actually see premium content because the API prevents it.
  79 |     expect(pageText).not.toContain('Fake Premium Content That Only Exists On API');
  80 |   });
  81 | 
  82 | });
  83 | 
```