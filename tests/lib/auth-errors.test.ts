/**
 * Unit tests for src/lib/auth-errors.ts
 *
 * Covers: getFriendlyAuthErrorMessage() — Firebase Auth error mapping
 */

import { describe, it, expect } from 'vitest';
import { getFriendlyAuthErrorMessage } from '@/lib/auth-errors';

describe('getFriendlyAuthErrorMessage()', () => {
  // ─── Maps known Firebase Auth error codes ─────────────────────
  describe('error code mapping', () => {
    it('maps auth/invalid-credential', () => {
      const result = getFriendlyAuthErrorMessage({ code: 'auth/invalid-credential', message: '' });
      expect(result).toBe('Invalid email address or password. Please try again.');
    });

    it('maps auth/wrong-password', () => {
      const result = getFriendlyAuthErrorMessage({ code: 'auth/wrong-password', message: '' });
      expect(result).toBe('Incorrect password. Please try again.');
    });

    it('maps auth/user-not-found', () => {
      const result = getFriendlyAuthErrorMessage({ code: 'auth/user-not-found', message: '' });
      expect(result).toBe('No account exists with this email address.');
    });

    it('maps auth/email-already-in-use', () => {
      const result = getFriendlyAuthErrorMessage({ code: 'auth/email-already-in-use', message: '' });
      expect(result).toBe('This email address is already registered to another account.');
    });

    it('maps auth/weak-password', () => {
      const result = getFriendlyAuthErrorMessage({ code: 'auth/weak-password', message: '' });
      expect(result).toBe('The password is too weak. Please choose a password with at least 8 characters.');
    });

    it('maps auth/too-many-requests', () => {
      const result = getFriendlyAuthErrorMessage({ code: 'auth/too-many-requests', message: '' });
      expect(result).toContain('Too many unsuccessful attempts');
    });

    it('maps auth/user-disabled', () => {
      const result = getFriendlyAuthErrorMessage({ code: 'auth/user-disabled', message: '' });
      expect(result).toBe('This account has been disabled. Please contact system support.');
    });

    it('maps auth/invalid-email', () => {
      const result = getFriendlyAuthErrorMessage({ code: 'auth/invalid-email', message: '' });
      expect(result).toBe('Please enter a valid email address.');
    });

    it('maps auth/popup-closed-by-user', () => {
      const result = getFriendlyAuthErrorMessage({ code: 'auth/popup-closed-by-user', message: '' });
      expect(result).toBe('Sign in cancelled. Please try again.');
    });
  });

  // ─── Falls back to message if code not recognized ─────────────
  describe('message-based matching', () => {
    it('matches error code in message string', () => {
      const result = getFriendlyAuthErrorMessage({
        code: '',
        message: 'Firebase: Error (auth/invalid-credential).',
      });
      expect(result).toBe('Invalid email address or password. Please try again.');
    });

    it('strips Firebase prefix from unknown errors', () => {
      const result = getFriendlyAuthErrorMessage({
        code: 'auth/unknown-code',
        message: 'Firebase: Error (auth/unknown-code). Something else here',
      });
      // The regex strips "Firebase: Error (" leaving "auth/unknown-code). Something else here"
      expect(result).toBe('auth/unknown-code). Something else here');
    });
  });

  // ─── Edge cases ───────────────────────────────────────────────
  describe('edge cases', () => {
    it('returns default message for null error', () => {
      expect(getFriendlyAuthErrorMessage(null)).toBe('An error occurred.');
    });

    it('returns default message for undefined error', () => {
      expect(getFriendlyAuthErrorMessage(undefined)).toBe('An error occurred.');
    });

    it('returns custom default message', () => {
      expect(getFriendlyAuthErrorMessage(null, 'Login failed')).toBe('Login failed');
    });

    it('returns default for error with empty message and no known code', () => {
      expect(getFriendlyAuthErrorMessage({ code: '', message: '' })).toBe('An error occurred.');
    });
  });
});
