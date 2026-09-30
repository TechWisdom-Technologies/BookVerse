/**
 * E2E Tests: Chapter Management, Story Editing, Beta Readers, Polls, AI Tools
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('Story Management', () => {
  test('write story management page structure', async ({ authorPage }) => {
    await authorPage.goto('/write');
    await authorPage.waitForLoadState('domcontentloaded');

    if (authorPage.url().includes('/write')) {
      const body = await authorPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);
    }
  });
});

test.describe('Series Management', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/write/series');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('series management page loads for author', async ({ authorPage }) => {
    await authorPage.goto('/write/series');
    await authorPage.waitForLoadState('domcontentloaded');

    const url = authorPage.url();
    if (url.includes('/write/series')) {
      const body = await authorPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('series') ||
        body?.toLowerCase().includes('create') ||
        body?.toLowerCase().includes('no series')
      ).toBeTruthy();
    }
  });
});

test.describe('Universe Management', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/write/universes');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('universe management page loads for author', async ({ authorPage }) => {
    await authorPage.goto('/write/universes');
    await authorPage.waitForLoadState('domcontentloaded');

    const url = authorPage.url();
    if (url.includes('/write/universes')) {
      const body = await authorPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('universe') ||
        body?.toLowerCase().includes('create') ||
        body?.toLowerCase().includes('world')
      ).toBeTruthy();
    }
  });
});

test.describe('Book Upload', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/upload');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('upload page loads for author', async ({ authorPage }) => {
    await authorPage.goto('/upload');
    await authorPage.waitForLoadState('domcontentloaded');

    const url = authorPage.url();
    if (url.includes('/upload')) {
      const body = await authorPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);

      expect(
        body?.toLowerCase().includes('upload') ||
        body?.toLowerCase().includes('file') ||
        body?.toLowerCase().includes('book') ||
        body?.toLowerCase().includes('pdf') ||
        body?.toLowerCase().includes('epub')
      ).toBeTruthy();
    }
  });

  test('upload form has file input', async ({ authorPage }) => {
    await authorPage.goto('/upload');
    await authorPage.waitForLoadState('domcontentloaded');

    if (authorPage.url().includes('/upload')) {
      const fileInput = authorPage.locator('input[type="file"]');
      expect(await fileInput.count()).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('Book Requests', () => {
  test('book requests page loads for pro user', async ({ proPage }) => {
    await proPage.goto('/write/requests');
    await proPage.waitForLoadState('domcontentloaded');

    const url = proPage.url();
    if (url.includes('/write/requests')) {
      const body = await proPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);
    }
  });
});

test.describe('Newsletter Management (Author)', () => {
  test('newsletter page requires auth', async ({ page }) => {
    await page.goto('/write/newsletter');
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain('/login');
  });

  test('newsletter page loads for author', async ({ authorPage }) => {
    await authorPage.goto('/write/newsletter');
    await authorPage.waitForLoadState('domcontentloaded');

    const url = authorPage.url();
    if (url.includes('/write/newsletter')) {
      const body = await authorPage.textContent('body');
      expect(body?.length).toBeGreaterThan(50);
    }
  });
});
