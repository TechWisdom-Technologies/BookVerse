/**
 * Unit tests for src/lib/utils.ts
 *
 * Covers: cn(), formatDate(), truncate(), generateUsername(), formatBytes()
 */

import { describe, it, expect } from 'vitest';
import { cn, formatDate, truncate, generateUsername, formatBytes } from '@/lib/utils';

// ─── cn() — Tailwind class merging ──────────────────────────────
describe('cn()', () => {
  it('merges simple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes via clsx', () => {
    const result = cn('base', false && 'hidden', 'visible');
    expect(result).toBe('base visible');
  });

  it('deduplicates conflicting Tailwind classes', () => {
    // twMerge should keep only the last conflicting utility
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-2');
  });

  it('returns empty string when called with no args', () => {
    expect(cn()).toBe('');
  });

  it('handles undefined and null values gracefully', () => {
    expect(cn('a', undefined, null, 'b')).toBe('a b');
  });
});

// ─── formatDate() ───────────────────────────────────────────────
describe('formatDate()', () => {
  it('formats a Date object', () => {
    const date = new Date('2024-01-15T00:00:00Z');
    const result = formatDate(date);
    // date-fns "PPP" format produces something like "January 15th, 2024"
    expect(result).toContain('January');
    expect(result).toContain('2024');
  });

  it('formats an ISO date string', () => {
    const result = formatDate('2023-12-25T12:00:00Z');
    expect(result).toContain('December');
    expect(result).toContain('2023');
  });

  it('formats a Unix timestamp (number)', () => {
    // 1704067200000 = Jan 1 2024 UTC
    const result = formatDate(1704067200000);
    expect(result).toContain('2024');
  });
});

// ─── truncate() ─────────────────────────────────────────────────
describe('truncate()', () => {
  it('does not truncate short strings', () => {
    expect(truncate('hello', 140)).toBe('hello');
  });

  it('truncates long strings and adds ellipsis', () => {
    const long = 'a'.repeat(200);
    const result = truncate(long, 140);
    expect(result.length).toBe(140);
    expect(result.endsWith('…')).toBe(true);
  });

  it('uses default length of 140', () => {
    const str = 'x'.repeat(200);
    const result = truncate(str);
    expect(result.length).toBe(140);
  });

  it('returns exact string if length equals limit', () => {
    const str = 'a'.repeat(140);
    expect(truncate(str, 140)).toBe(str);
  });

  it('handles empty string', () => {
    expect(truncate('')).toBe('');
  });

  it('handles very small limit', () => {
    const result = truncate('hello world', 5);
    expect(result.length).toBe(5);
    expect(result.endsWith('…')).toBe(true);
  });
});

// ─── generateUsername() ─────────────────────────────────────────
describe('generateUsername()', () => {
  it('extracts username from email', () => {
    expect(generateUsername('john.doe@gmail.com')).toBe('john_doe');
  });

  it('converts to lowercase', () => {
    expect(generateUsername('JohnDoe@example.com')).toBe('johndoe');
  });

  it('replaces special characters with underscores', () => {
    expect(generateUsername('john+doe@test.com')).toBe('john_doe');
  });

  it('strips leading and trailing underscores', () => {
    expect(generateUsername('__john__@test.com')).toBe('john');
  });

  it('limits to 20 characters', () => {
    const longEmail = 'a'.repeat(30) + '@test.com';
    const result = generateUsername(longEmail);
    expect(result.length).toBeLessThanOrEqual(20);
  });

  it('falls back to "user" for empty local part', () => {
    expect(generateUsername('@test.com')).toBe('user');
  });

  it('handles plain alphanumeric email', () => {
    expect(generateUsername('testuser123@mail.com')).toBe('testuser123');
  });
});

// ─── formatBytes() ──────────────────────────────────────────────
describe('formatBytes()', () => {
  it('returns "0 Bytes" for 0', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('formats bytes correctly', () => {
    expect(formatBytes(500)).toBe('500 Bytes');
  });

  it('formats kilobytes correctly', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('formats megabytes correctly', () => {
    expect(formatBytes(1048576)).toBe('1 MB');
  });

  it('formats gigabytes correctly', () => {
    expect(formatBytes(1073741824)).toBe('1 GB');
  });

  it('respects custom decimal places', () => {
    expect(formatBytes(1536, 1)).toBe('1.5 KB');
  });

  it('handles NaN input gracefully', () => {
    expect(formatBytes(NaN)).toBe('0 Bytes');
  });

  it('formats fractional kilobytes with default 2 decimals', () => {
    // 1536 bytes = 1.5 KB
    expect(formatBytes(1536)).toBe('1.5 KB');
  });

  it('handles negative decimals (clamps to 0)', () => {
    expect(formatBytes(1536, -1)).toBe('2 KB');
  });
});
