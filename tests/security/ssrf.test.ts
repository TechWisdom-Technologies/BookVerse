/**
 * Phase 12: SSRF (Server-Side Request Forgery)
 * Tests that the pdf-proxy endpoint validates URLs and prevents access to internal networks.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as pdfProxy } from '../../src/app/api/pdf-proxy/route';

describe('Phase 12: SSRF Protection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CLOUDFLARE_R2_PUBLIC_URL = 'https://r2.dev';
  });

  const runProxy = async (urlStr: string) => {
    const req = {
      nextUrl: new URL(`http://localhost/api/pdf-proxy?url=${encodeURIComponent(urlStr)}`),
    } as any;
    return await pdfProxy(req);
  };

  it('blocks localhost (127.0.0.1)', async () => {
    const res = await runProxy('http://127.0.0.1/admin');
    expect(res.status).toBe(403);
  });

  it('blocks local network IPs (e.g. 192.168.x.x)', async () => {
    const res = await runProxy('http://192.168.1.1/config');
    expect(res.status).toBe(403);
  });

  it('blocks AWS/Cloud metadata endpoint (169.254.169.254)', async () => {
    const res = await runProxy('http://169.254.169.254/latest/meta-data/');
    expect(res.status).toBe(403);
  });

  it('blocks non-HTTPS protocols', async () => {
    const res = await runProxy('ftp://pub-666ffca9921d4b79b6738f62abc3af39.r2.dev/file.pdf');
    expect(res.status).toBe(403);
  });

  it('blocks arbitrary domains not in ALLOWED_HOSTS', async () => {
    const res = await runProxy('https://evil-hacker.com/malware.pdf');
    expect(res.status).toBe(403);
  });

  it('allows valid URLs from ALLOWED_HOSTS', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: 'mock-pdf-stream',
      headers: { get: vi.fn().mockReturnValue('application/pdf'), has: vi.fn() },
    });

    const res = await runProxy('https://pub-666ffca9921d4b79b6738f62abc3af39.r2.dev/my-book.pdf');
    expect(res.status).toBe(200);
  });
});

