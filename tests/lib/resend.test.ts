/**
 * Unit tests for src/lib/resend.tsx
 *
 * Covers: sendBulkNewsletter() — the batching logic for mass emails.
 * Individual email functions (sendWelcomeEmail, etc.) are thin wrappers
 * around sendEmail() and don't have testable logic.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the entire Resend module
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
    batch: {
      send: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
  })),
}));

// Mock the email template components
vi.mock('@/emails/WelcomeEmail', () => ({ WelcomeEmail: () => null }));
vi.mock('@/emails/CommentNotification', () => ({ CommentNotification: () => null }));
vi.mock('@/emails/FollowNotification', () => ({ FollowNotification: () => null }));
vi.mock('@/emails/ResetPasswordEmail', () => ({ ResetPasswordEmail: () => null }));
vi.mock('@/emails/SupportRequestNotification', () => ({ SupportRequestNotification: () => null }));
vi.mock('@/emails/LoginAlertEmail', () => ({ LoginAlertEmail: () => null }));
vi.mock('@/emails/NewsletterEmail', () => ({ NewsletterEmail: () => null }));

describe('resend.tsx', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env.RESEND_API_KEY = 'test-api-key';
    process.env.RESEND_FROM_EMAIL = 'BookVerse <noreply@bookverse.app>';
    process.env.NEXT_PUBLIC_APP_URL = 'https://bookverse.app';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('sendBulkNewsletter()', () => {
    it('returns { success: 0, failed: 0 } for empty email list', async () => {
      const { sendBulkNewsletter } = await import('@/lib/resend');
      const result = await sendBulkNewsletter([], 'Test', 'Content');
      expect(result).toEqual({ success: 0, failed: 0 });
    });

    it('sends emails in batches of 100', async () => {
      const { sendBulkNewsletter, resend } = await import('@/lib/resend');
      if (!resend) throw new Error('Resend not initialized');

      // Generate 250 emails
      const emails = Array.from({ length: 250 }, (_, i) => `user${i}@test.com`);

      const result = await sendBulkNewsletter(emails, 'Newsletter', 'Hello!');

      // Should be called 3 times: 100 + 100 + 50
      expect(resend.batch.send).toHaveBeenCalledTimes(3);
      expect(result.success).toBe(250);
      expect(result.failed).toBe(0);
    });

    it('counts failures when batch.send returns error', async () => {
      const { sendBulkNewsletter, resend } = await import('@/lib/resend');
      if (!resend) throw new Error('Resend not initialized');

      // Make batch.send return an error
      (resend.batch.send as any).mockResolvedValue({
        data: null,
        error: { message: 'Rate limited' },
      });

      const emails = ['a@test.com', 'b@test.com', 'c@test.com'];
      const result = await sendBulkNewsletter(emails, 'Test', 'Content');

      expect(result.failed).toBe(3);
      expect(result.success).toBe(0);
    });

    it('counts failures when batch.send throws', async () => {
      const { sendBulkNewsletter, resend } = await import('@/lib/resend');
      if (!resend) throw new Error('Resend not initialized');

      // Make batch.send throw
      (resend.batch.send as any).mockRejectedValue(new Error('Network error'));

      const emails = ['a@test.com', 'b@test.com'];
      const result = await sendBulkNewsletter(emails, 'Test', 'Content');

      expect(result.failed).toBe(2);
      expect(result.success).toBe(0);
    });

    it('returns early when resend client is not initialized', async () => {
      delete process.env.RESEND_API_KEY;
      vi.resetModules();

      // Re-mock everything after module reset
      vi.doMock('resend', () => ({
        Resend: vi.fn().mockImplementation(() => null),
      }));
      vi.doMock('@/emails/NewsletterEmail', () => ({ NewsletterEmail: () => null }));
      vi.doMock('@/emails/WelcomeEmail', () => ({ WelcomeEmail: () => null }));
      vi.doMock('@/emails/CommentNotification', () => ({ CommentNotification: () => null }));
      vi.doMock('@/emails/FollowNotification', () => ({ FollowNotification: () => null }));
      vi.doMock('@/emails/ResetPasswordEmail', () => ({ ResetPasswordEmail: () => null }));
      vi.doMock('@/emails/SupportRequestNotification', () => ({ SupportRequestNotification: () => null }));
      vi.doMock('@/emails/LoginAlertEmail', () => ({ LoginAlertEmail: () => null }));

      const { sendBulkNewsletter } = await import('@/lib/resend');
      const result = await sendBulkNewsletter(['a@test.com'], 'Test', 'Content');
      expect(result).toEqual({ success: 0, failed: 0 });
    });
  });
});
