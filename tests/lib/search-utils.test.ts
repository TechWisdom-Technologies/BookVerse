/**
 * Unit tests for src/lib/search-utils.ts
 *
 * Covers: extractTextFromTipTap() — the pure function that extracts
 * plain text from TipTap's JSON document format.
 * 
 * Note: syncStorySearchIndex() is integration-level (hits Prisma)
 * and is not tested here.
 */

import { describe, it, expect } from 'vitest';
import { extractTextFromTipTap } from '@/lib/search-utils';

describe('extractTextFromTipTap()', () => {
  // ─── Null / empty inputs ──────────────────────────────────────
  it('returns empty string for null', () => {
    expect(extractTextFromTipTap(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(extractTextFromTipTap(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(extractTextFromTipTap('')).toBe('');
  });

  it('returns plain string as-is', () => {
    expect(extractTextFromTipTap('Hello World')).toBe('Hello World');
  });

  // ─── Text nodes ───────────────────────────────────────────────
  it('extracts text from a simple text node', () => {
    const node = { type: 'text', text: 'Hello' };
    expect(extractTextFromTipTap(node)).toBe('Hello');
  });

  // ─── Nested document structure ────────────────────────────────
  it('extracts text from a TipTap document', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'First paragraph.' },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Second paragraph.' },
          ],
        },
      ],
    };
    const result = extractTextFromTipTap(doc);
    expect(result).toContain('First paragraph.');
    expect(result).toContain('Second paragraph.');
  });

  it('handles deeply nested content', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Deep quote' },
              ],
            },
          ],
        },
      ],
    };
    expect(extractTextFromTipTap(doc)).toContain('Deep quote');
  });

  // ─── Array input ──────────────────────────────────────────────
  it('handles array of nodes', () => {
    const nodes = [
      { type: 'text', text: 'Item 1' },
      { type: 'text', text: 'Item 2' },
    ];
    const result = extractTextFromTipTap(nodes);
    expect(result).toContain('Item 1');
    expect(result).toContain('Item 2');
  });

  // ─── Mixed content ────────────────────────────────────────────
  it('extracts text from mixed content (bold, italic, plain)', () => {
    const doc = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Normal ' },
            { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
            { type: 'text', text: ' text' },
          ],
        },
      ],
    };
    const result = extractTextFromTipTap(doc);
    expect(result).toContain('Normal');
    expect(result).toContain('bold');
    expect(result).toContain('text');
  });

  // ─── Nodes without text ───────────────────────────────────────
  it('handles nodes without text property gracefully', () => {
    const doc = {
      type: 'doc',
      content: [
        { type: 'horizontalRule' },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'After ruler' }],
        },
      ],
    };
    expect(extractTextFromTipTap(doc)).toContain('After ruler');
  });

  it('returns empty string for object without content or text', () => {
    expect(extractTextFromTipTap({ type: 'image' })).toBe('');
  });
});
