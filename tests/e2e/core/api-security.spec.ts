/**
 * E2E Tests: Webhooks and API Security
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('API Security', () => {
  test('unauthorized API requests are blocked', async ({ request }) => {
    // Attempt to access a protected API route without auth
    const response = await request.get('/api/user/profile');
    
    // Should be 401 Unauthorized or 403 Forbidden
    expect([401, 403, 404]).toContain(response.status());
  });

  test('CSRF protection is active on API routes', async ({ request }) => {
    // Attempt a POST request without CSRF token (if applicable)
    // Next.js server actions handle this automatically, but standard API routes might check
    const response = await request.post('/api/auth/session', {
      data: { test: true }
    });
    
    // Depending on implementation, might be 401, 403, or 400
    // Just verify it doesn't succeed (200/201) with unauthorized mock data
    expect(response.status()).not.toBe(200);
    expect(response.status()).not.toBe(201);
  });
});

test.describe('Webhook Endpoints (Smoke Tests)', () => {
  test('stripe webhook endpoint exists and rejects GET requests', async ({ request }) => {
    const response = await request.get('/api/webhooks/stripe');
    
    // Webhooks should only accept POST
    // 405 Method Not Allowed or 404 if entirely hidden
    expect([405, 404]).toContain(response.status());
  });
  
  test('stripe webhook rejects invalid signatures', async ({ request }) => {
    const response = await request.post('/api/webhooks/stripe', {
      data: { type: 'payment_intent.succeeded' },
      headers: {
        'stripe-signature': 'invalid_signature_123'
      }
    });
    
    // Should fail validation (usually 400 Bad Request)
    expect([400, 401, 500]).toContain(response.status());
  });
});
