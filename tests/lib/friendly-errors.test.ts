/**
 * Unit tests for src/lib/friendly-errors.ts
 *
 * Covers: getFriendlyErrorMessage() — the function that converts
 * technical/raw error messages into user-friendly strings.
 * 
 * Key behavior: Messages ≤80 chars without "technical indicators" (brackets,
 * stack traces, prisma, sql, etc.) are treated as already user-friendly and
 * passed through BEFORE the regex ERROR_MAP is checked. This means short
 * messages like "fetch failed" or "UNAUTHORIZED" pass through unchanged.
 */

import { describe, it, expect } from 'vitest';
import { getFriendlyErrorMessage } from '@/lib/friendly-errors';

describe('getFriendlyErrorMessage()', () => {
  // ─── Safe messages pass through unchanged ─────────────────────
  describe('safe messages (pass-through)', () => {
    it('returns known safe messages unchanged', () => {
      expect(getFriendlyErrorMessage('Please log in again.')).toBe('Please log in again.');
    });

    it('matches safe messages case-insensitively', () => {
      expect(getFriendlyErrorMessage('please log in again.')).toBe('please log in again.');
    });

    it('returns "Login required" unchanged', () => {
      expect(getFriendlyErrorMessage('Login required')).toBe('Login required');
    });

    it('returns "Title is required" unchanged', () => {
      expect(getFriendlyErrorMessage('Title is required')).toBe('Title is required');
    });

    it('returns "Minimum tip is $1.00" unchanged', () => {
      expect(getFriendlyErrorMessage('Minimum tip is $1.00')).toBe('Minimum tip is $1.00');
    });
  });

  // ─── Technical errors mapped to friendly messages ─────────────
  // NOTE: The function passes through short (≤80 char) messages without
  // technical indicators BEFORE checking the ERROR_MAP. So only messages
  // that are long OR contain technical indicator chars get mapped.
  describe('technical error mapping', () => {
    it('maps Prisma errors (contains technical indicator "prisma")', () => {
      const result = getFriendlyErrorMessage(new Error('Prisma Client error: some internal thing'));
      expect(result).toBe('Something went wrong on our end. Please try again.');
    });

    it('maps ECONNREFUSED errors (contains technical indicator)', () => {
      const result = getFriendlyErrorMessage(new Error('ECONNREFUSED 127.0.0.1:5432'));
      expect(result).toBe("We're having trouble connecting right now. Please try again in a moment.");
    });

    it('maps ETIMEDOUT errors (contains technical indicator)', () => {
      const result = getFriendlyErrorMessage('ETIMEDOUT connecting to database');
      expect(result).toBe('The request timed out. Please try again.');
    });

    it('maps long connection error messages (matches "connect" pattern first)', () => {
      const result = getFriendlyErrorMessage(
        'Connection timed out while trying to reach the database server at 192.168.1.1:5432 after 30000ms timeout period expired'
      );
      // The "connect(ion)? ...timed? ?out" regex matches before the generic "timeout" regex
      expect(result).toBe("We're having trouble connecting right now. Please try again in a moment.");
    });

    it('maps JSON parsing errors with angle brackets (technical indicator)', () => {
      const result = getFriendlyErrorMessage("Unexpected token '<', \"<!DOCTYPE\" is not valid JSON");
      expect(result).toBe('Something went wrong. Please try again.');
    });

    it('maps ERR_ errors (contains technical indicator)', () => {
      const result = getFriendlyErrorMessage('ERR_CONNECTION_REFUSED');
      expect(result).toBe('Something went wrong. Please try again.');
    });
  });

  // ─── Short messages pass through (≤80 chars, no tech indicators) ──
  describe('short non-technical messages pass through', () => {
    it('passes through "fetch failed" (short, no tech indicators)', () => {
      expect(getFriendlyErrorMessage('fetch failed')).toBe('fetch failed');
    });

    it('passes through "UNAUTHORIZED" (short, no tech indicators)', () => {
      expect(getFriendlyErrorMessage('UNAUTHORIZED')).toBe('UNAUTHORIZED');
    });

    it('passes through "Forbidden: you do not have access"', () => {
      expect(getFriendlyErrorMessage('Forbidden: you do not have access'))
        .toBe('Forbidden: you do not have access');
    });

    it('passes through "503 Service Temporarily Unavailable"', () => {
      expect(getFriendlyErrorMessage('503 Service Temporarily Unavailable'))
        .toBe('503 Service Temporarily Unavailable');
    });

    it('passes through "Internal Server Error 500"', () => {
      expect(getFriendlyErrorMessage('Internal Server Error 500'))
        .toBe('Internal Server Error 500');
    });

    it('passes through short API error messages', () => {
      expect(getFriendlyErrorMessage('Failed to create book')).toBe('Failed to create book');
    });

    it('passes through custom error messages under 80 chars', () => {
      expect(getFriendlyErrorMessage('Book not found')).toBe('Book not found');
    });

    it('passes through "R2 upload failed: access denied"', () => {
      expect(getFriendlyErrorMessage(new Error('R2 upload failed: access denied')))
        .toBe('R2 upload failed: access denied');
    });

    it('passes through "Unique constraint failed on the fields: (email)" — but wait, has brackets', () => {
      // This message has "(email)" which contains parentheses — but () isn't in
      // the tech indicators regex (only {, }, [, ], <, > are). So it passes through.
      const result = getFriendlyErrorMessage('Unique constraint failed on the fields: (email)');
      expect(result).toBe('Unique constraint failed on the fields: (email)');
    });
  });

  // ─── Edge cases ───────────────────────────────────────────────
  describe('edge cases', () => {
    it('returns fallback for null/undefined error', () => {
      expect(getFriendlyErrorMessage(null)).toBe('Something went wrong. Please try again.');
      expect(getFriendlyErrorMessage(undefined)).toBe('Something went wrong. Please try again.');
    });

    it('returns custom fallback', () => {
      expect(getFriendlyErrorMessage(null, 'Custom fallback')).toBe('Custom fallback');
    });

    it('handles Error objects with short message (passes through)', () => {
      expect(getFriendlyErrorMessage(new Error('fetch failed'))).toBe('fetch failed');
    });

    it('handles objects with a message property (short, passes through)', () => {
      expect(getFriendlyErrorMessage({ message: 'fetch failed' })).toBe('fetch failed');
    });

    it('returns fallback for long messages with technical indicators', () => {
      const longTechError = 'Error: at Object.module.exports.ts:123:45 ' + 'x'.repeat(200);
      const result = getFriendlyErrorMessage(longTechError);
      expect(result).toBe('Something went wrong. Please try again.');
    });

    it('returns fallback for empty string error', () => {
      expect(getFriendlyErrorMessage('')).toBe('Something went wrong. Please try again.');
    });

    it('maps long UNAUTHORIZED-style errors with tech indicators', () => {
      // Even with tech indicators, the UNAUTHORIZED regex in ERROR_MAP matches first
      const result = getFriendlyErrorMessage(
        'UNAUTHORIZED: Error at auth.ts:45 — user session expired due to null token'
      );
      expect(result).toBe('You are not logged in. Please log in first.');
    });
  });
});
