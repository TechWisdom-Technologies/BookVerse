# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: middleware\csrf-protection.spec.ts >> CSRF Protection >> Cross-origin POST to API is blocked
- Location: tests\e2e\middleware\csrf-protection.spec.ts:7:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 404
Received array: [400, 401, 403]
```

# Test source

```ts
  1  | /**
  2  |  * E2E Tests: CSRF Protection
  3  |  */
  4  | import { test, expect } from '@playwright/test';
  5  | 
  6  | test.describe('CSRF Protection', () => {
  7  |   test('Cross-origin POST to API is blocked', async ({ request }) => {
  8  |     const response = await request.post('/api/auth/session', {
  9  |       headers: {
  10 |         'Origin': 'https://malicious-site.com'
  11 |       },
  12 |       data: {}
  13 |     });
  14 |     // Expected to fail validation
> 15 |     expect([400, 401, 403]).toContain(response.status());
     |                             ^ Error: expect(received).toContain(expected) // indexOf
  16 |   });
  17 | });
  18 | 
```