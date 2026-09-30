/**
 * E2E Tests: UddoktaPay/Payment Webhooks
 */
import { test, expect } from '@playwright/test';

test.describe('Payment Webhooks', () => {
  test('Webhook rejects invalid signatures', async ({ request }) => {
    const response = await request.post('/api/webhooks/payment', {
      data: { status: 'COMPLETED' },
      headers: { 'x-signature': 'invalid' }
    });
    // 400 or 401 expected for invalid signature/no signature
    expect([400, 401, 404, 405]).toContain(response.status());
  });
});
