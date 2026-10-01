# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: core\api-security.spec.ts >> Webhook Endpoints (Smoke Tests) >> stripe webhook rejects invalid signatures
- Location: tests\e2e\core\api-security.spec.ts:38:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 404
Received array: [400, 401, 500]
```

# Test source

```ts
  1  | /**
  2  |  * E2E Tests: Webhooks and API Security
  3  |  */
  4  | import { test, expect } from '../fixtures/auth.fixture';
  5  | 
  6  | test.describe('API Security', () => {
  7  |   test('unauthorized API requests are blocked', async ({ request }) => {
  8  |     // Attempt to access a protected API route without auth
  9  |     const response = await request.get('/api/user/profile');
  10 |     
  11 |     // Should be 401 Unauthorized or 403 Forbidden
  12 |     expect([401, 403, 404]).toContain(response.status());
  13 |   });
  14 | 
  15 |   test('CSRF protection is active on API routes', async ({ request }) => {
  16 |     // Attempt a POST request without CSRF token (if applicable)
  17 |     // Next.js server actions handle this automatically, but standard API routes might check
  18 |     const response = await request.post('/api/auth/session', {
  19 |       data: { test: true }
  20 |     });
  21 |     
  22 |     // Depending on implementation, might be 401, 403, or 400
  23 |     // Just verify it doesn't succeed (200/201) with unauthorized mock data
  24 |     expect(response.status()).not.toBe(200);
  25 |     expect(response.status()).not.toBe(201);
  26 |   });
  27 | });
  28 | 
  29 | test.describe('Webhook Endpoints (Smoke Tests)', () => {
  30 |   test('stripe webhook endpoint exists and rejects GET requests', async ({ request }) => {
  31 |     const response = await request.get('/api/webhooks/stripe');
  32 |     
  33 |     // Webhooks should only accept POST
  34 |     // 405 Method Not Allowed or 404 if entirely hidden
  35 |     expect([405, 404]).toContain(response.status());
  36 |   });
  37 |   
  38 |   test('stripe webhook rejects invalid signatures', async ({ request }) => {
  39 |     const response = await request.post('/api/webhooks/stripe', {
  40 |       data: { type: 'payment_intent.succeeded' },
  41 |       headers: {
  42 |         'stripe-signature': 'invalid_signature_123'
  43 |       }
  44 |     });
  45 |     
  46 |     // Should fail validation (usually 400 Bad Request)
> 47 |     expect([400, 401, 500]).toContain(response.status());
     |                             ^ Error: expect(received).toContain(expected) // indexOf
  48 |   });
  49 | });
  50 | 
```