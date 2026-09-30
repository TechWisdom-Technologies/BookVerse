/**
 * Phase 8: HTTP Security Headers
 * Tests that next.config.js correctly configures all security headers.
 */
import { describe, it, expect, beforeAll } from 'vitest';

// We import and test the next.config.js headers function directly
const nextConfig = require('../../next.config.js');

describe('Phase 8: HTTP Security Headers', () => {
  let headers: { key: string; value: string }[];

  beforeAll(async () => {
    const result = await nextConfig.headers();
    headers = result[0].headers;
  });

  it('sets Content-Security-Policy header', () => {
    const csp = headers.find((h: any) => h.key === 'Content-Security-Policy');
    expect(csp).toBeDefined();
    expect(csp!.value).toContain("default-src 'self'");
    expect(csp!.value).toContain("object-src 'none'");
  });

  it('sets X-Frame-Options to DENY (prevents clickjacking)', () => {
    const xfo = headers.find((h: any) => h.key === 'X-Frame-Options');
    expect(xfo).toBeDefined();
    expect(xfo!.value).toBe('DENY');
  });

  it('sets X-Content-Type-Options to nosniff (prevents MIME sniffing)', () => {
    const xcto = headers.find((h: any) => h.key === 'X-Content-Type-Options');
    expect(xcto).toBeDefined();
    expect(xcto!.value).toBe('nosniff');
  });

  it('sets Strict-Transport-Security (HSTS)', () => {
    const hsts = headers.find((h: any) => h.key === 'Strict-Transport-Security');
    expect(hsts).toBeDefined();
    expect(hsts!.value).toContain('max-age=63072000');
    expect(hsts!.value).toContain('includeSubDomains');
    expect(hsts!.value).toContain('preload');
  });

  it('sets Referrer-Policy to strict-origin-when-cross-origin', () => {
    const rp = headers.find((h: any) => h.key === 'Referrer-Policy');
    expect(rp).toBeDefined();
    expect(rp!.value).toBe('strict-origin-when-cross-origin');
  });

  it('sets Permissions-Policy to restrict camera and geolocation', () => {
    const pp = headers.find((h: any) => h.key === 'Permissions-Policy');
    expect(pp).toBeDefined();
    expect(pp!.value).toContain('camera=()');
    expect(pp!.value).toContain('geolocation=()');
  });

  it('sets X-DNS-Prefetch-Control to on', () => {
    const dns = headers.find((h: any) => h.key === 'X-DNS-Prefetch-Control');
    expect(dns).toBeDefined();
    expect(dns!.value).toBe('on');
  });

  it('CSP restricts script-src in production (no unsafe-eval)', () => {
    // In test env (non-development), the CSP should NOT include unsafe-eval
    const csp = headers.find((h: any) => h.key === 'Content-Security-Policy');
    expect(csp).toBeDefined();
    // process.env.NODE_ENV is 'test', which is not 'development'
    expect(csp!.value).not.toContain("'unsafe-eval'");
  });
});
