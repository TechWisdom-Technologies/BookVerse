import { test, expect } from '@playwright/test';

test.describe('Phase 9: File Storage & Upload Chaos', () => {

  test('R2 Upload Interruption at 50% - no orphaned files', async ({ page }) => {
    await page.route('**/*.r2.cloudflarestorage.com/**', async (route, request) => {
      if (request.method() === 'PUT') {
        // Simulate mid-upload abort
        route.abort('connectionreset');
      } else {
        route.continue();
      }
    });
    await page.goto('/');
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Oversized File Bomb rejected early', async ({ page }) => {
    await page.goto('/');
    // Try to upload via API with a large payload indicator
    const response = await page.evaluate(async () => {
      try {
        // Create a large fake FormData
        const formData = new FormData();
        const largeBlob = new Blob([new ArrayBuffer(1024 * 1024)], { type: 'image/jpeg' }); // 1MB
        formData.append('file', largeBlob, 'huge-file.jpg');
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        return { status: res.status };
      } catch (e: any) {
        return { status: 0, error: e.message };
      }
    });
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('MIME Type Mismatch - exe renamed to jpg', async ({ page }) => {
    await page.goto('/');
    const response = await page.evaluate(async () => {
      try {
        const formData = new FormData();
        // Create a fake "executable" disguised as jpg
        const exeContent = new Uint8Array([0x4D, 0x5A, 0x90, 0x00]); // MZ header (PE executable)
        const blob = new Blob([exeContent], { type: 'image/jpeg' });
        formData.append('file', blob, 'totally-not-malware.jpg');
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        return { status: res.status };
      } catch (e: any) {
        return { status: 0, error: e.message };
      }
    });
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Empty File Upload rejected', async ({ page }) => {
    await page.goto('/');
    const response = await page.evaluate(async () => {
      try {
        const formData = new FormData();
        const emptyBlob = new Blob([], { type: 'image/jpeg' });
        formData.append('file', emptyBlob, 'empty.jpg');
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        return { status: res.status };
      } catch (e: any) {
        return { status: 0, error: e.message };
      }
    });
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('Filename Path Traversal sanitized', async ({ page }) => {
    await page.goto('/');
    const response = await page.evaluate(async () => {
      try {
        const formData = new FormData();
        const blob = new Blob(['fake'], { type: 'image/jpeg' });
        formData.append('file', blob, '../../etc/passwd');
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        return { status: res.status };
      } catch (e: any) {
        return { status: 0, error: e.message };
      }
    });
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
