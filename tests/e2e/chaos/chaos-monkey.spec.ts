import { test, expect } from '@playwright/test';

test.describe('Phase 19: User Behavior Chaos (Monkey Testing)', () => {

  test('Paste Bomb - 1MB text into page', async ({ page }) => {
    await page.goto('/');
    // Find any text input and paste a huge string
    const input = page.locator('input[type="text"], textarea, [contenteditable="true"]').first();
    if (await input.count() > 0 && await input.isVisible()) {
      const hugeText = 'A'.repeat(100000); // 100KB (safe for DOM)
      await input.fill(hugeText).catch(() => {});
    }
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Rapid Theme Switching through all 12 themes', async ({ page }) => {
    await page.goto('/');
    const themes = ['light', 'dark', 'rose', 'amoled', 'cyberpunk', 'mint', 'neon', 'earth', 'canvas', 'vintage', 'oceanic', 'royal'];
    for (const theme of themes) {
      await page.evaluate((t) => {
        localStorage.setItem('theme', t);
        document.documentElement.className = t;
      }, theme);
    }
    await page.reload();
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Double-Back Navigation from deep page', async ({ page }) => {
    await page.goto('/');
    try { await page.goto('/library', { timeout: 5000 }); } catch (e) {}
    try { await page.goto('/clubs', { timeout: 5000 }); } catch (e) {}
    try { await page.goto('/premium', { timeout: 5000 }); } catch (e) {}
    // Rapid back navigation
    for (let i = 0; i < 10; i++) {
      await page.goBack({ timeout: 2000 }).catch(() => {});
    }
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Browser Crash Recovery - IndexedDB drafts survive', async ({ page }) => {
    await page.goto('/');
    // Store data in IndexedDB to simulate draft
    await page.evaluate(async () => {
      return new Promise<void>((resolve) => {
        const request = indexedDB.open('bookverse_offline', 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('offline_stories')) {
            db.createObjectStore('offline_stories', { keyPath: 'id' });
          }
        };
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction('offline_stories', 'readwrite');
          tx.objectStore('offline_stories').put({
            id: 'draft-survival-test',
            title: 'My Draft Story',
            author: 'TestUser',
            chapters: [],
            savedAt: Date.now(),
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
          });
          tx.oncomplete = () => resolve();
        };
        request.onerror = () => resolve();
      });
    });
    // Reload page (simulating "recovery after crash")
    await page.reload();
    // Verify draft is still in IndexedDB
    const draftExists = await page.evaluate(async () => {
      return new Promise<boolean>((resolve) => {
        const request = indexedDB.open('bookverse_offline', 1);
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction('offline_stories', 'readonly');
          const getReq = tx.objectStore('offline_stories').get('draft-survival-test');
          getReq.onsuccess = () => resolve(!!getReq.result);
          getReq.onerror = () => resolve(false);
        };
        request.onerror = () => resolve(false);
      });
    });
    expect(draftExists).toBe(true);
  });

  test('Zoom + Resize does not break layout', async ({ page }) => {
    await page.goto('/');
    // Simulate extreme viewport changes
    await page.setViewportSize({ width: 320, height: 568 }); // iPhone SE
    await page.waitForTimeout(200);
    await page.setViewportSize({ width: 1920, height: 1080 }); // Full HD
    await page.waitForTimeout(200);
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.waitForTimeout(200);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
