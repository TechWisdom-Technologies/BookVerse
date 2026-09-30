/**
 * Unit tests for src/lib/offline-storage.ts
 *
 * Covers the pure utility functions:
 * - formatStorageSize()
 * - getExpirationLabel()
 *
 * Note: IndexedDB-dependent functions (saveStoryOffline, getOfflineStory, etc.)
 * are browser-only and require integration/E2E testing.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatStorageSize, getExpirationLabel } from '@/lib/offline-storage';

describe('formatStorageSize()', () => {
  it('formats bytes', () => {
    expect(formatStorageSize(500)).toBe('500 B');
  });

  it('formats kilobytes', () => {
    expect(formatStorageSize(2048)).toBe('2.0 KB');
  });

  it('formats megabytes', () => {
    expect(formatStorageSize(5 * 1024 * 1024)).toBe('5.0 MB');
  });

  it('formats fractional KB', () => {
    expect(formatStorageSize(1536)).toBe('1.5 KB');
  });

  it('formats 0 bytes', () => {
    expect(formatStorageSize(0)).toBe('0 B');
  });

  it('formats 1023 bytes (just under 1 KB)', () => {
    expect(formatStorageSize(1023)).toBe('1023 B');
  });

  it('formats exactly 1 KB', () => {
    expect(formatStorageSize(1024)).toBe('1.0 KB');
  });

  it('formats exactly 1 MB', () => {
    expect(formatStorageSize(1024 * 1024)).toBe('1.0 MB');
  });
});

describe('getExpirationLabel()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Expired" when expiresAt is in the past', () => {
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    const pastTime = new Date('2024-01-14T12:00:00Z').getTime();
    expect(getExpirationLabel(pastTime)).toBe('Expired');
  });

  it('returns "Expired" when expiresAt equals now', () => {
    const now = new Date('2024-01-15T12:00:00Z');
    vi.setSystemTime(now);
    expect(getExpirationLabel(now.getTime())).toBe('Expired');
  });

  it('returns days and hours remaining for multi-day expiry', () => {
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    // Expires in 3 days and 5 hours
    const future = Date.now() + (3 * 24 + 5) * 60 * 60 * 1000;
    const result = getExpirationLabel(future);
    expect(result).toContain('3d');
    expect(result).toContain('5h');
    expect(result).toContain('বাকি');
  });

  it('returns only hours for less than 1 day', () => {
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    const future = Date.now() + 5 * 60 * 60 * 1000; // 5 hours
    const result = getExpirationLabel(future);
    expect(result).toContain('5h');
    expect(result).toContain('বাকি');
    expect(result).not.toContain('d');
  });

  it('returns "Soon" for less than 1 hour remaining', () => {
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
    const future = Date.now() + 30 * 60 * 1000; // 30 minutes
    expect(getExpirationLabel(future)).toBe('Soon');
  });
});
