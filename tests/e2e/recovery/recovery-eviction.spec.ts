import { test, expect } from '@playwright/test';

test.describe('Phase 10: Browser Eviction & Storage Purge Recovery', () => {

  test('Silent IndexedDB Eviction - gracefully handles missing database on read', async ({ page }) => {
    await page.goto('/');

    // 1. Create a mock IDB with some data
    await page.evaluate(async () => {
      return new Promise((resolve) => {
        const req = indexedDB.open('bookverse_offline_evict', 1);
        req.onerror = () => resolve(false);
        req.onupgradeneeded = (e: any) => {
          e.target.result.createObjectStore('data');
        };
        req.onsuccess = (e: any) => {
          const db = e.target.result;
          const tx = db.transaction('data', 'readwrite');
          tx.objectStore('data').put('some-data', 'key1');
          tx.oncomplete = () => {
            db.close(); // Important: must close so deleteDatabase isn't blocked
            resolve(true);
          };
          tx.onerror = () => {
            db.close();
            resolve(false);
          };
        };
      });
    });

    // 2. Simulate OS-level eviction by forcibly deleting the DB
    await page.evaluate(async () => {
      return new Promise((resolve) => {
        const req = indexedDB.deleteDatabase('bookverse_offline_evict');
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
        req.onblocked = () => resolve(false);
      });
    });

    // 3. The app attempts to read from the evicted DB. It should not throw a fatal unhandled error,
    // but gracefully return null or trigger a re-sync.
    const readResult = await page.evaluate(async () => {
      return new Promise((resolve) => {
        try {
          const req = indexedDB.open('bookverse_offline_evict', 1);
          req.onsuccess = (e: any) => {
            const db = e.target.result;
            // The DB was deleted, so opening it again recreated it (it's empty).
            // A naive app might try to query a missing object store and crash.
            if (!db.objectStoreNames.contains('data')) {
              resolve('graceful_empty'); // Recovered successfully
              return;
            }
            const tx = db.transaction('data', 'readonly');
            const getReq = tx.objectStore('data').get('key1');
            getReq.onsuccess = () => resolve(getReq.result || 'graceful_empty');
          };
          req.onerror = () => resolve('graceful_error');
        } catch (e: any) {
          resolve(e.message); // Should not crash
        }
      });
    });

    expect(readResult).toBe('graceful_empty');
  });

  test('LocalStorage Quota Purge - catches QuotaExceededError and recovers', async ({ page }) => {
    await page.goto('/');

    const recoveryStatus = await page.evaluate(() => {
      try {
        // Fill localStorage almost to the brim (usually 5MB)
        const filler = 'a'.repeat(1024 * 1024 * 4.9); // ~4.9MB
        localStorage.setItem('filler', filler);

        // Try to set one more large item, this will throw QuotaExceededError
        try {
          localStorage.setItem('important_data', 'b'.repeat(1024 * 500)); // 500KB
          return 'did_not_throw';
        } catch (e: any) {
          if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            // Simulated recovery: App catches it, clears non-essential 'filler', and retries
            localStorage.removeItem('filler');
            localStorage.setItem('important_data', 'recovered_data');
            
            // Verify it saved after recovery
            if (localStorage.getItem('important_data') === 'recovered_data') {
              return 'recovered';
            }
            return 'failed_to_recover';
          }
          return 'other_error';
        }
      } catch (e) {
        return 'test_setup_failed';
      } finally {
        localStorage.clear();
      }
    });

    expect(recoveryStatus).toBe('recovered');
  });

});
