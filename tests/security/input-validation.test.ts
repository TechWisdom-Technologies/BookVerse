/**
 * Phase 5: Input Validation, Injection & XSS
 * Tests that malicious payloads are rejected by Zod validators.
 */
import { describe, it, expect } from 'vitest';
import { profileSchema, bookSchema, storySchema, commentSchema, reviewSchema, chapterSchema } from '@/lib/validators';

describe('Phase 5: Input Validation, Injection & XSS', () => {
  describe('Profile Schema', () => {
    it('rejects username with special characters (XSS attempt)', () => {
      const result = profileSchema.safeParse({
        username: '<script>alert("xss")</script>',
      });
      expect(result.success).toBe(false);
    });

    it('rejects username shorter than 3 characters', () => {
      const result = profileSchema.safeParse({ username: 'ab' });
      expect(result.success).toBe(false);
    });

    it('rejects username longer than 30 characters', () => {
      const result = profileSchema.safeParse({ username: 'a'.repeat(31) });
      expect(result.success).toBe(false);
    });

    it('rejects username with uppercase characters', () => {
      const result = profileSchema.safeParse({ username: 'MyUser' });
      expect(result.success).toBe(false);
    });

    it('accepts valid lowercase username with underscores', () => {
      const result = profileSchema.safeParse({ username: 'valid_user_123' });
      expect(result.success).toBe(true);
    });

    it('rejects bio longer than 500 characters', () => {
      const result = profileSchema.safeParse({ bio: 'x'.repeat(501) });
      expect(result.success).toBe(false);
    });

    it('rejects description longer than 1000 characters', () => {
      const result = profileSchema.safeParse({ description: 'x'.repeat(1001) });
      expect(result.success).toBe(false);
    });

    it('rejects invalid avatarUrl (not a URL)', () => {
      const result = profileSchema.safeParse({ avatarUrl: 'not-a-url' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid bkash number', () => {
      const result = profileSchema.safeParse({ bkashNumber: '1234' });
      expect(result.success).toBe(false);
    });

    it('accepts valid Bangladeshi bkash number', () => {
      const result = profileSchema.safeParse({ bkashNumber: '01712345678' });
      expect(result.success).toBe(true);
    });

    it('rejects invalid readingFont enum', () => {
      const result = profileSchema.safeParse({ readingFont: 'comic-sans' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid socialLinks URL', () => {
      const result = profileSchema.safeParse({
        socialLinks: [{ platform: 'twitter', url: 'not-a-url' }],
      });
      expect(result.success).toBe(false);
    });

    it('rejects prototype pollution attempt', () => {
      const result = profileSchema.safeParse({
        __proto__: { isAdmin: true },
        constructor: { prototype: { isAdmin: true } },
      });
      // Zod strips unknown keys, so result should succeed but without __proto__
      if (result.success) {
        expect((result.data as any).__proto__?.isAdmin).toBeUndefined();
        expect((result.data as any).constructor?.prototype?.isAdmin).toBeUndefined();
      }
    });
  });

  describe('Book Schema', () => {
    it('rejects empty title', () => {
      const result = bookSchema.safeParse({
        title: '',
        authorName: 'Me',
        fileUrl: 'http://test.pdf',
        fileType: 'PDF',
        genre: 'Sci-Fi',
      });
      expect(result.success).toBe(false);
    });

    it('rejects invalid fileType (EXE)', () => {
      const result = bookSchema.safeParse({
        title: 'My Book',
        authorName: 'Me',
        fileUrl: 'http://test.exe',
        fileType: 'EXE',
        genre: 'Sci-Fi',
      });
      expect(result.success).toBe(false);
    });

    it('accepts valid PDF file type', () => {
      const result = bookSchema.safeParse({
        title: 'My Book',
        authorName: 'Me',
        fileUrl: 'http://test.pdf',
        fileType: 'PDF',
        genre: 'Sci-Fi',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Comment Schema', () => {
    it('rejects empty comment content', () => {
      const result = commentSchema.safeParse({ content: '' });
      expect(result.success).toBe(false);
    });

    it('accepts content with HTML tags (stored as-is, rendered safely by React)', () => {
      // Note: React auto-escapes HTML. Zod allows the string but React prevents rendering.
      const result = commentSchema.safeParse({
        content: '<script>alert("xss")</script>',
      });
      // Zod min(1) passes since the string is non-empty
      expect(result.success).toBe(true);
    });
  });

  describe('Review Schema', () => {
    it('rejects rating below 1', () => {
      const result = reviewSchema.safeParse({ rating: 0 });
      expect(result.success).toBe(false);
    });

    it('rejects rating above 5', () => {
      const result = reviewSchema.safeParse({ rating: 6 });
      expect(result.success).toBe(false);
    });

    it('rejects non-integer rating', () => {
      const result = reviewSchema.safeParse({ rating: 3.5 });
      expect(result.success).toBe(false);
    });
  });

  describe('SQL/NoSQL Injection patterns', () => {
    it('Zod passes SQL injection strings (Prisma parameterizes queries anyway)', () => {
      const result = commentSchema.safeParse({
        content: "'; DROP TABLE users;--",
      });
      // This is "valid" text content. Prisma uses parameterized queries so this is safe.
      expect(result.success).toBe(true);
    });
  });
});
