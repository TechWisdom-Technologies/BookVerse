/**
 * Unit tests for src/lib/validators.ts
 *
 * Covers: bookSchema, storySchema, chapterSchema, reviewSchema,
 *         commentSchema, profileSchema (Zod validation schemas)
 */

import { describe, it, expect } from 'vitest';
import {
  bookSchema,
  storySchema,
  chapterSchema,
  reviewSchema,
  commentSchema,
  profileSchema,
} from '@/lib/validators';

// ─── bookSchema ─────────────────────────────────────────────────
describe('bookSchema', () => {
  const validBook = {
    title: 'Test Book',
    authorName: 'Author Name',
    fileUrl: 'https://example.com/book.pdf',
    fileType: 'PDF' as const,
    genre: 'Fiction',
    language: 'English',
  };

  it('validates a correct book object', () => {
    const result = bookSchema.safeParse(validBook);
    expect(result.success).toBe(true);
  });

  it('rejects missing title', () => {
    const result = bookSchema.safeParse({ ...validBook, title: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing authorName', () => {
    const result = bookSchema.safeParse({ ...validBook, authorName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing fileUrl', () => {
    const result = bookSchema.safeParse({ ...validBook, fileUrl: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid fileType', () => {
    const result = bookSchema.safeParse({ ...validBook, fileType: 'DOCX' });
    expect(result.success).toBe(false);
  });

  it('accepts EPUB fileType', () => {
    const result = bookSchema.safeParse({ ...validBook, fileType: 'EPUB' });
    expect(result.success).toBe(true);
  });

  it('accepts optional nullable coverUrl', () => {
    const result = bookSchema.safeParse({ ...validBook, coverUrl: null });
    expect(result.success).toBe(true);
  });

  it('accepts optional nullable description', () => {
    const result = bookSchema.safeParse({ ...validBook, description: null });
    expect(result.success).toBe(true);
  });

  it('defaults language to English', () => {
    const { language, ...rest } = validBook;
    const result = bookSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.language).toBe('English');
    }
  });
});

// ─── storySchema ────────────────────────────────────────────────
describe('storySchema', () => {
  it('validates a minimal story (title only)', () => {
    const result = storySchema.safeParse({ title: 'My Story' });
    expect(result.success).toBe(true);
  });

  it('rejects empty title', () => {
    const result = storySchema.safeParse({ title: '' });
    expect(result.success).toBe(false);
  });

  it('accepts all optional fields', () => {
    const fullStory = {
      title: 'Epic Tale',
      coverUrl: 'https://img.com/cover.jpg',
      summary: 'A great story',
      genre: 'Fantasy',
      published: true,
      universeId: 'uni-123',
      seriesId: 'ser-456',
      sequenceNumber: 1,
      subGenres: ['Dark Fantasy', 'Adventure'],
      mood: 'Epic',
      contentWarnings: ['Violence'],
      ageRating: 16,
      tags: ['dragons', 'magic'],
      description: 'Full description here',
    };
    const result = storySchema.safeParse(fullStory);
    expect(result.success).toBe(true);
  });

  it('rejects non-integer sequenceNumber', () => {
    const result = storySchema.safeParse({ title: 'Test', sequenceNumber: 1.5 });
    expect(result.success).toBe(false);
  });

  it('rejects sequenceNumber less than 1', () => {
    const result = storySchema.safeParse({ title: 'Test', sequenceNumber: 0 });
    expect(result.success).toBe(false);
  });
});

// ─── chapterSchema ──────────────────────────────────────────────
describe('chapterSchema', () => {
  it('validates a correct chapter', () => {
    const result = chapterSchema.safeParse({
      title: 'Chapter 1',
      chapterOrder: 1,
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty title', () => {
    const result = chapterSchema.safeParse({ title: '', chapterOrder: 1 });
    expect(result.success).toBe(false);
  });

  it('rejects chapterOrder less than 1', () => {
    const result = chapterSchema.safeParse({ title: 'Ch', chapterOrder: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects non-integer chapterOrder', () => {
    const result = chapterSchema.safeParse({ title: 'Ch', chapterOrder: 1.5 });
    expect(result.success).toBe(false);
  });

  it('accepts null content', () => {
    const result = chapterSchema.safeParse({ title: 'Ch', chapterOrder: 1, content: null });
    expect(result.success).toBe(true);
  });
});

// ─── reviewSchema ───────────────────────────────────────────────
describe('reviewSchema', () => {
  it('validates rating 1-5', () => {
    for (let i = 1; i <= 5; i++) {
      const result = reviewSchema.safeParse({ rating: i });
      expect(result.success).toBe(true);
    }
  });

  it('rejects rating 0', () => {
    const result = reviewSchema.safeParse({ rating: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects rating 6', () => {
    const result = reviewSchema.safeParse({ rating: 6 });
    expect(result.success).toBe(false);
  });

  it('rejects non-integer rating', () => {
    const result = reviewSchema.safeParse({ rating: 3.5 });
    expect(result.success).toBe(false);
  });

  it('accepts optional comment', () => {
    const result = reviewSchema.safeParse({ rating: 5, comment: 'Great!' });
    expect(result.success).toBe(true);
  });

  it('accepts null comment', () => {
    const result = reviewSchema.safeParse({ rating: 5, comment: null });
    expect(result.success).toBe(true);
  });
});

// ─── commentSchema ──────────────────────────────────────────────
describe('commentSchema', () => {
  it('validates a simple comment', () => {
    const result = commentSchema.safeParse({ content: 'Nice chapter!' });
    expect(result.success).toBe(true);
  });

  it('rejects empty content', () => {
    const result = commentSchema.safeParse({ content: '' });
    expect(result.success).toBe(false);
  });

  it('accepts optional parentId for replies', () => {
    const result = commentSchema.safeParse({ content: 'Reply', parentId: 'comment-123' });
    expect(result.success).toBe(true);
  });

  it('accepts null parentId', () => {
    const result = commentSchema.safeParse({ content: 'Root comment', parentId: null });
    expect(result.success).toBe(true);
  });
});

// ─── profileSchema ──────────────────────────────────────────────
describe('profileSchema', () => {
  it('validates an empty profile (all fields optional)', () => {
    const result = profileSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('validates a full profile', () => {
    const result = profileSchema.safeParse({
      displayName: 'John Doe',
      username: 'johndoe',
      bio: 'I love reading',
      readingFont: 'serif',
      readerTheme: 'sepia',
    });
    expect(result.success).toBe(true);
  });

  it('rejects username shorter than 3 chars', () => {
    const result = profileSchema.safeParse({ username: 'ab' });
    expect(result.success).toBe(false);
  });

  it('rejects username longer than 30 chars', () => {
    const result = profileSchema.safeParse({ username: 'a'.repeat(31) });
    expect(result.success).toBe(false);
  });

  it('rejects username with uppercase letters', () => {
    const result = profileSchema.safeParse({ username: 'JohnDoe' });
    expect(result.success).toBe(false);
  });

  it('rejects username with special characters', () => {
    const result = profileSchema.safeParse({ username: 'john-doe' });
    expect(result.success).toBe(false);
  });

  it('accepts username with underscores', () => {
    const result = profileSchema.safeParse({ username: 'john_doe' });
    expect(result.success).toBe(true);
  });

  it('rejects displayName longer than 50 chars', () => {
    const result = profileSchema.safeParse({ displayName: 'a'.repeat(51) });
    expect(result.success).toBe(false);
  });

  it('rejects bio longer than 500 chars', () => {
    const result = profileSchema.safeParse({ bio: 'a'.repeat(501) });
    expect(result.success).toBe(false);
  });

  it('validates valid bkash number', () => {
    const result = profileSchema.safeParse({ bkashNumber: '01712345678' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid bkash number', () => {
    const result = profileSchema.safeParse({ bkashNumber: '12345' });
    expect(result.success).toBe(false);
  });

  it('accepts empty bkash number', () => {
    const result = profileSchema.safeParse({ bkashNumber: '' });
    expect(result.success).toBe(true);
  });

  it('validates valid nagad number', () => {
    const result = profileSchema.safeParse({ nagadNumber: '01812345678' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid nagad number', () => {
    const result = profileSchema.safeParse({ nagadNumber: '02012345678' });
    expect(result.success).toBe(false);
  });

  it('validates valid readingFont enum', () => {
    for (const font of ['sans', 'serif', 'dyslexic']) {
      const result = profileSchema.safeParse({ readingFont: font });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid readingFont', () => {
    const result = profileSchema.safeParse({ readingFont: 'comic-sans' });
    expect(result.success).toBe(false);
  });

  it('validates all readerTheme options', () => {
    for (const theme of ['white', 'sepia', 'cream', 'charcoal', 'black']) {
      const result = profileSchema.safeParse({ readerTheme: theme });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid readerTheme', () => {
    const result = profileSchema.safeParse({ readerTheme: 'rainbow' });
    expect(result.success).toBe(false);
  });

  it('validates socialLinks structure', () => {
    const result = profileSchema.safeParse({
      socialLinks: [{ platform: 'twitter', url: 'https://twitter.com/user' }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects socialLinks with invalid URL', () => {
    const result = profileSchema.safeParse({
      socialLinks: [{ platform: 'twitter', url: 'not-a-url' }],
    });
    expect(result.success).toBe(false);
  });
});
