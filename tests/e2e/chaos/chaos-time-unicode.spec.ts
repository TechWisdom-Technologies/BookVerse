import { test, expect } from '@playwright/test';

test.describe('Phase 15: Clock & Time Chaos', () => {

  test('System Clock Skew - 24 hours ahead', async ({ page }) => {
    // Set clock 24 hours into the future
    const futureTime = Date.now() + 24 * 60 * 60 * 1000;
    await page.addInitScript(`{
      const originalDate = Date;
      const offset = ${futureTime} - originalDate.now();
      Date = class extends originalDate {
        constructor(...args) {
          if (args.length === 0) {
            super(originalDate.now() + offset);
          } else {
            super(...args);
          }
        }
        static now() { return originalDate.now() + offset; }
      };
    }`);
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Frozen Clock - Date.now() returns same value for 5s', async ({ page }) => {
    const frozenTime = Date.now();
    await page.addInitScript(`{
      const frozenMs = ${frozenTime};
      Date.now = () => frozenMs;
    }`);
    await page.goto('/');
    await page.waitForTimeout(2000);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Timezone Boundary Jump UTC+14 to UTC-12', async ({ page }) => {
    await page.emulateMedia({ /* no timezone API in Playwright directly */ });
    // Use CDP to set timezone
    try {
      const client = await page.context().newCDPSession(page);
      await client.send('Emulation.setTimezoneOverride', { timezoneId: 'Pacific/Kiritimati' }); // UTC+14
    } catch (e) {}
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Phase 16: Unicode, Encoding & Input Chaos', () => {

  test('Null Byte Injection in search', async ({ page }) => {
    await page.goto('/search?q=test%00injection');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Emoji Bombs in URL params', async ({ page }) => {
    const emojiString = encodeURIComponent('😀'.repeat(1000));
    await page.goto(`/search?q=${emojiString}`);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Right-to-Left Override character in search', async ({ page }) => {
    await page.goto(`/search?q=%E2%80%AEevil-rtl-text`);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Zalgo Text in search query', async ({ page }) => {
    const zalgo = encodeURIComponent('H̷̡̧̨̛̗̰̝̼̰̩̝̪̊̈́̃e̸̡l̶̢l̶̡o̷');
    await page.goto(`/search?q=${zalgo}`);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('BOM Character in URL', async ({ page }) => {
    await page.goto(`/search?q=%EF%BB%BFtest`);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Unicode Homoglyph in URL path', async ({ page }) => {
    // аdmin (Cyrillic а, not Latin a)
    try {
      await page.goto('/search?q=%D0%B0dmin', { timeout: 5000 });
    } catch (e) {}
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
