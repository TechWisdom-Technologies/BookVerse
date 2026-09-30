/**
 * Unit tests for src/lib/api-logger.ts
 *
 * Covers: withPerformanceLogger() — the higher-order function that
 * wraps API route handlers with performance logging and crash catching.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withPerformanceLogger } from '@/lib/api-logger';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

describe('withPerformanceLogger()', () => {
  // Helper to create a minimal mock NextRequest
  function mockRequest(method = 'GET', url = 'http://localhost/api/test'): NextRequest {
    return { method, url } as unknown as NextRequest;
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the wrapped handler and returns its response', async () => {
    const mockResponse = { status: 200, body: { ok: true } } as unknown as NextResponse;
    const handler = vi.fn().mockResolvedValue(mockResponse);

    const wrapped = withPerformanceLogger(handler, '/api/test');
    const result = await wrapped(mockRequest());

    expect(handler).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockResponse);
  });

  it('passes through the request and extra args to the handler', async () => {
    const handler = vi.fn().mockResolvedValue({} as NextResponse);
    const wrapped = withPerformanceLogger(handler, '/api/test');

    const req = mockRequest('POST');
    const extraArg = { params: { id: '123' } };
    await wrapped(req, extraArg);

    expect(handler).toHaveBeenCalledWith(req, extraArg);
  });

  it('catches unhandled errors and returns a 500 response', async () => {
    const handler = vi.fn().mockRejectedValue(new Error('Database exploded'));
    const wrapped = withPerformanceLogger(handler, '/api/crash-test');

    const result = await wrapped(mockRequest());

    // NextResponse.json is mocked in setup.ts
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  });

  it('logs crashed routes to the CrashReport table', async () => {
    const handler = vi.fn().mockRejectedValue(new Error('Null pointer'));

    // Make prisma.crashReport.create actually resolve (not just return a mock)
    (prisma.crashReport.create as any).mockResolvedValue({});

    const wrapped = withPerformanceLogger(handler, '/api/broken');
    await wrapped(mockRequest());

    expect(prisma.crashReport.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        url: '/api/broken',
        errorMessage: 'Null pointer',
      }),
    });
  });

  it('truncates long error messages to 500 chars', async () => {
    const longError = 'x'.repeat(1000);
    const handler = vi.fn().mockRejectedValue(new Error(longError));
    (prisma.crashReport.create as any).mockResolvedValue({});

    const wrapped = withPerformanceLogger(handler, '/api/test');
    await wrapped(mockRequest());

    const call = (prisma.crashReport.create as any).mock.calls[0][0];
    expect(call.data.errorMessage.length).toBeLessThanOrEqual(500);
  });

  it('truncates stack traces to 2000 chars', async () => {
    const error = new Error('Test');
    error.stack = 'y'.repeat(5000);
    const handler = vi.fn().mockRejectedValue(error);
    (prisma.crashReport.create as any).mockResolvedValue({});

    const wrapped = withPerformanceLogger(handler, '/api/test');
    await wrapped(mockRequest());

    const call = (prisma.crashReport.create as any).mock.calls[0][0];
    expect(call.data.stackTrace.length).toBeLessThanOrEqual(2000);
  });

  it('handles errors without message or stack gracefully', async () => {
    const handler = vi.fn().mockRejectedValue('plain string error');
    (prisma.crashReport.create as any).mockResolvedValue({});

    const wrapped = withPerformanceLogger(handler, '/api/test');

    // Should not throw
    await expect(wrapped(mockRequest())).resolves.toBeDefined();
  });
});
