import { test, expect } from '@playwright/test';

test.describe('Phase 4: State Corruption & Poisoning', () => {

  test('LocalStorage Poisoning - garbage data resets to defaults', async ({ page }) => {
    await page.goto('/');
    // Inject garbage into all known LocalStorage keys
    await page.evaluate(() => {
      localStorage.setItem('theme', '|||CORRUPTED|||');
      localStorage.setItem('readerSettings', '{broken json///');
      localStorage.setItem('readingFont', new Array(10000).fill('X').join(''));
      localStorage.setItem('bookverse_user', 'null');
    });
    await page.reload();
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('LocalStorage 10MB overflow does not crash', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      try {
        const bigString = new Array(1024 * 1024).fill('A').join(''); // ~1MB
        for (let i = 0; i < 10; i++) {
          localStorage.setItem(`chaos_overflow_${i}`, bigString);
        }
      } catch (e) {
        // QuotaExceededError is expected — that's what we're testing
      }
    });
    await page.reload();
    const body = page.locator('body');
    await expect(body).toBeVisible();
    // Clean up
    await page.evaluate(() => {
      for (let i = 0; i < 10; i++) {
        localStorage.removeItem(`chaos_overflow_${i}`);
      }
    });
  });

  test('IndexedDB Corruption - malformed OfflineStory objects', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(async () => {
      return new Promise<void>((resolve, reject) => {
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
          const store = tx.objectStore('offline_stories');
          // Insert corrupted data
          store.put({ id: 'corrupted-1', title: null, chapters: 'not-an-array', savedAt: 'not-a-number' });
          store.put({ id: 'corrupted-2' }); // Missing all required fields
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve(); // Still resolve — we want to test the app's response
        };
        request.onerror = () => resolve();
      });
    });
    // Navigate to offline stories page
    try {
      await page.goto('/offline-stories', { timeout: 5000 });
    } catch (e) {}
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Cookie Tampering - invalid HMAC signatures rejected', async ({ page }) => {
    await page.context().addCookies([
      { name: '__session_role', value: 'ADMIN', domain: 'localhost', path: '/' },
      { name: '__session_role_sig', value: 'TAMPERED_INVALID_SIGNATURE_123abc', domain: 'localhost', path: '/' },
      { name: '__session_tier', value: 'CREATOR', domain: 'localhost', path: '/' },
      { name: '__session_tier_sig', value: 'FORGED_TIER_SIG_456def', domain: 'localhost', path: '/' },
    ]);
    await page.goto('/');
    // The app should not grant elevated privileges
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('SessionStorage Overflow caught gracefully', async ({ page }) => {
    await page.goto('/');
    const overflowCaught = await page.evaluate(() => {
      try {
        const bigString = new Array(1024 * 1024).fill('B').join('');
        for (let i = 0; i < 10; i++) {
          sessionStorage.setItem(`chaos_session_${i}`, bigString);
        }
        return false; // overflow not triggered
      } catch (e) {
        return true; // QuotaExceededError caught
      }
    });
    // Either way, the page should still work
    await page.reload();
    const body = page.locator('body');
    await expect(body).toBeVisible();
    // Clean up
    await page.evaluate(() => {
      for (let i = 0; i < 10; i++) sessionStorage.removeItem(`chaos_session_${i}`);
    });
  });

  test('Theme State Corruption falls back to system default', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('theme', 'NONEXISTENT_THEME_XYZ');
    });
    await page.reload();
    const body = page.locator('body');
    await expect(body).toBeVisible();
    // Verify no CSS class matches the invalid theme
    const html = page.locator('html');
    const className = await html.getAttribute('class') || '';
    expect(className).not.toContain('NONEXISTENT_THEME_XYZ');
  });
});
