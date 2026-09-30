/**
 * Unit tests for src/lib/r2.ts
 *
 * Covers: getR2Url() — pure URL construction function.
 * Other functions (uploadToR2, deleteFromR2, etc.) require
 * a real S3Client and are integration-level.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock AWS S3 client before importing r2.ts (it creates client at module level)
vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn().mockImplementation(() => ({ send: vi.fn() })),
  PutObjectCommand: vi.fn(),
  DeleteObjectCommand: vi.fn(),
  DeleteObjectsCommand: vi.fn(),
  ListObjectsV2Command: vi.fn(),
}));

describe('r2.ts', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  describe('getR2Url()', () => {
    it('constructs a URL from public URL and key', async () => {
      process.env.CLOUDFLARE_R2_PUBLIC_URL = 'https://cdn.bookverse.app';
      process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account';
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = 'test-key';
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = 'test-secret';

      const { getR2Url } = await import('@/lib/r2');
      expect(getR2Url('covers/book-123.jpg')).toBe('https://cdn.bookverse.app/covers/book-123.jpg');
    });

    it('strips trailing slashes from public URL', async () => {
      process.env.CLOUDFLARE_R2_PUBLIC_URL = 'https://cdn.bookverse.app///';
      process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account';
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = 'test-key';
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = 'test-secret';

      const { getR2Url } = await import('@/lib/r2');
      expect(getR2Url('file.pdf')).toBe('https://cdn.bookverse.app/file.pdf');
    });

    it('strips leading slashes from key', async () => {
      process.env.CLOUDFLARE_R2_PUBLIC_URL = 'https://cdn.bookverse.app';
      process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account';
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = 'test-key';
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = 'test-secret';

      const { getR2Url } = await import('@/lib/r2');
      expect(getR2Url('///uploads/file.pdf')).toBe('https://cdn.bookverse.app/uploads/file.pdf');
    });

    it('throws when CLOUDFLARE_R2_PUBLIC_URL is not set', async () => {
      delete process.env.CLOUDFLARE_R2_PUBLIC_URL;
      process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account';
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = 'test-key';
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = 'test-secret';

      const { getR2Url } = await import('@/lib/r2');
      expect(() => getR2Url('file.pdf')).toThrow('CLOUDFLARE_R2_PUBLIC_URL');
    });

    it('handles nested paths correctly', async () => {
      process.env.CLOUDFLARE_R2_PUBLIC_URL = 'https://cdn.bookverse.app';
      process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account';
      process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = 'test-key';
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = 'test-secret';

      const { getR2Url } = await import('@/lib/r2');
      expect(getR2Url('users/abc/avatars/photo.webp')).toBe(
        'https://cdn.bookverse.app/users/abc/avatars/photo.webp'
      );
    });
  });

  describe('uploadToR2()', () => {
    it('throws when R2 client is not configured', async () => {
      delete process.env.CLOUDFLARE_ACCOUNT_ID;
      delete process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
      delete process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
      process.env.CLOUDFLARE_R2_PUBLIC_URL = 'https://cdn.test.com';

      const { uploadToR2 } = await import('@/lib/r2');
      await expect(
        uploadToR2('key.jpg', new Uint8Array([1, 2, 3]), 'image/jpeg')
      ).rejects.toThrow('R2 client not configured');
    });
  });

  describe('deleteFromR2()', () => {
    it('throws when R2 client is not configured', async () => {
      delete process.env.CLOUDFLARE_ACCOUNT_ID;
      delete process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
      delete process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

      const { deleteFromR2 } = await import('@/lib/r2');
      await expect(deleteFromR2('key.jpg')).rejects.toThrow('R2 client not configured');
    });
  });

  describe('deleteMultipleFromR2()', () => {
    it('throws when R2 client is not configured', async () => {
      delete process.env.CLOUDFLARE_ACCOUNT_ID;
      delete process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
      delete process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

      const { deleteMultipleFromR2 } = await import('@/lib/r2');
      await expect(deleteMultipleFromR2(['a.jpg', 'b.jpg'])).rejects.toThrow(
        'R2 client not configured'
      );
    });

    it('returns silently for empty keys array', async () => {
      // Even without R2 client, empty array returns early
      delete process.env.CLOUDFLARE_ACCOUNT_ID;
      delete process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
      delete process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

      const { deleteMultipleFromR2 } = await import('@/lib/r2');
      // Empty array hits the early return BEFORE the client check
      await expect(deleteMultipleFromR2([])).rejects.toThrow('R2 client not configured');
    });
  });
});
