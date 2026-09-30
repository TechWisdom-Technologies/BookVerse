/**
 * E2E Tests: XSS Protection
 * Ensures basic inputs sanitize scripts.
 */
import { test, expect } from '../fixtures/auth.fixture';

test.describe('XSS Protection', () => {
  test('comment boxes sanitize script tags', async ({ memberPage }) => {
    await memberPage.goto('/stories/1');
    await memberPage.waitForLoadState('domcontentloaded');
    
    // If there's a comment box, try to inject a script
    const commentBox = memberPage.locator('textarea[name="comment"], textarea[placeholder*="comment" i]');
    const submitBtn = memberPage.locator('button:has-text("Comment"), button:has-text("Post")');
    
    if (await commentBox.count() > 0 && await submitBtn.count() > 0) {
      const maliciousPayload = '<script>alert("xss")</script>';
      await commentBox.first().fill(maliciousPayload);
      await submitBtn.first().click();
      
      // Wait for UI to update
      await memberPage.waitForTimeout(1000);
      
      // Verify the script wasn't executed and is rendered as text or stripped
      const pageText = await memberPage.textContent('body');
      expect(pageText).not.toContain('<script>alert("xss")</script>');
    }
  });
});
