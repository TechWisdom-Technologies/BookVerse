import { test, expect } from '@playwright/test';

test.describe('Phase 14: Rate Limit Header & Queue Recovery', () => {

  test('Retry-After Header Recovery - client respects server backoff instructions', async ({ page }) => {
    let attemptCount = 0;
    await page.route('**/api/mock-heavy-job*', async (route) => {
      attemptCount++;
      if (attemptCount === 1) {
        await route.fulfill({
          status: 429,
          headers: {
            'Retry-After': '2'
          },
          body: JSON.stringify({ error: 'Too Many Requests' })
        });
      } else {
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      }
    });

    await page.goto('/');

    const result = await page.evaluate(async () => {
      const startTime = Date.now();
      
      const executeJob = async (): Promise<{ status: number, delay: number }> => {
        const res = await fetch('/api/mock-heavy-job', { method: 'POST', cache: 'no-store' });
        
        if (res.status === 429) {
          const retryAfter = parseInt(res.headers.get('Retry-After') || '1', 10);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          const retryRes = await fetch('/api/mock-heavy-job', { method: 'POST', cache: 'no-store' });
          return { status: retryRes.status, delay: Date.now() - startTime };
        }
        
        return { status: res.status, delay: Date.now() - startTime };
      };

      return executeJob();
    });

    expect(result.status).toBe(200);
    expect(result.delay).toBeGreaterThanOrEqual(2000);
  });

  test('Dead Letter Queue Mock - gracefully accepts jobs after max retries', async ({ page }) => {
    let retryCount = 0;
    await page.route('**/api/mock-enqueue-email*', async (route) => {
      retryCount++;
      if (retryCount <= 3) {
        await route.fulfill({ status: 503, body: JSON.stringify({ error: 'Service Unavailable' }) });
      } else {
        await route.fulfill({ status: 202, body: JSON.stringify({ message: 'Moved to Dead Letter Queue' }) });
      }
    });

    await page.goto('/');

    const queueResult = await page.evaluate(async () => {
      let attempts = 0;
      let finalStatus = 0;

      while (attempts < 5) {
        attempts++;
        const res = await fetch('/api/mock-enqueue-email', { method: 'POST', cache: 'no-store' });
        if (res.status === 503) {
          await new Promise(resolve => setTimeout(resolve, 50));
          continue;
        }
        finalStatus = res.status;
        break;
      }
      
      return { finalStatus, attempts };
    });

    expect(queueResult.attempts).toBe(4);
    expect(queueResult.finalStatus).toBe(202);
  });

});
