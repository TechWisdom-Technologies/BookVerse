/**
 * Unit tests for src/lib/uddoktapay.ts
 *
 * Covers: initiatePayment(), verifyPayment(), refundPayment()
 * All external API calls are mocked with vi.fn().
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initiatePayment, verifyPayment, refundPayment } from '@/lib/uddoktapay';

describe('UddoktaPay Client', () => {
  const originalFetch = global.fetch;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    global.fetch = vi.fn();
    process.env.UDDOKTAPAY_API_URL = 'https://sandbox.uddoktapay.com';
    process.env.UDDOKTAPAY_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  // ─── initiatePayment() ────────────────────────────────────────
  describe('initiatePayment()', () => {
    const validPayload = {
      full_name: 'Test User',
      email: 'test@example.com',
      amount: 500,
      metadata: { plan: 'PRO' },
      redirect_url: 'https://bookverse.com/payment/success',
      cancel_url: 'https://bookverse.com/payment/cancel',
    };

    it('returns payment_url on success', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ payment_url: 'https://pay.uddoktapay.com/checkout/xyz' })),
      });

      const result = await initiatePayment(validPayload);
      expect(result.payment_url).toBe('https://pay.uddoktapay.com/checkout/xyz');
    });

    it('sends correct headers including API key', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ payment_url: 'https://pay.test.com/xyz' })),
      });

      await initiatePayment(validPayload);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://sandbox.uddoktapay.com/api/checkout-v2',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'RT-UDDOKTAPAY-API-KEY': 'test-api-key',
          }),
        })
      );
    });

    it('throws when API returns non-OK response', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: () => Promise.resolve(JSON.stringify({ message: 'Invalid amount' })),
      });

      await expect(initiatePayment(validPayload)).rejects.toThrow('Invalid amount');
    });

    it('throws when API returns non-JSON response', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 502,
        statusText: 'Bad Gateway',
        text: () => Promise.resolve('<html>Bad Gateway</html>'),
      });

      await expect(initiatePayment(validPayload)).rejects.toThrow('UddoktaPay Gateway Error');
    });

    it('throws when API returns OK but no payment_url', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ status: 'pending' })),
      });

      await expect(initiatePayment(validPayload)).rejects.toThrow();
    });

    it('throws when UDDOKTAPAY_API_URL is not set', async () => {
      delete process.env.UDDOKTAPAY_API_URL;
      await expect(initiatePayment(validPayload)).rejects.toThrow('UDDOKTAPAY_API_URL is not set');
    });

    it('throws when UDDOKTAPAY_API_KEY is not set', async () => {
      delete process.env.UDDOKTAPAY_API_KEY;
      await expect(initiatePayment(validPayload)).rejects.toThrow('UDDOKTAPAY_API_KEY is not set');
    });
  });

  // ─── verifyPayment() ──────────────────────────────────────────
  describe('verifyPayment()', () => {
    it('returns verification data on success', async () => {
      const mockResponse = {
        invoice_id: 'INV-123',
        status: 'COMPLETED',
        transaction_id: 'TXN-456',
        amount: '500',
        charged_amount: '510',
        fee: '10',
        payment_method: 'bkash',
        sender_number: '01712345678',
        date: '2024-01-15',
        full_name: 'Test User',
        email: 'test@example.com',
        metadata: { plan: 'PRO' },
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const result = await verifyPayment('INV-123');
      expect(result.status).toBe('COMPLETED');
      expect(result.invoice_id).toBe('INV-123');
      expect(result.transaction_id).toBe('TXN-456');
    });

    it('sends invoice_id in request body', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ invoice_id: 'INV-123', status: 'COMPLETED' })),
      });

      await verifyPayment('INV-123');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://sandbox.uddoktapay.com/api/verify-payment',
        expect.objectContaining({
          body: JSON.stringify({ invoice_id: 'INV-123' }),
        })
      );
    });

    it('throws when verification fails', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: () => Promise.resolve(JSON.stringify({ message: 'Invoice not found' })),
      });

      await expect(verifyPayment('BAD-ID')).rejects.toThrow('Invoice not found');
    });
  });

  // ─── refundPayment() ──────────────────────────────────────────
  describe('refundPayment()', () => {
    it('returns refund response on success', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify({ status: true, message: 'Refund initiated' })),
      });

      const result = await refundPayment('INV-123');
      expect(result.status).toBe(true);
      expect(result.message).toBe('Refund initiated');
    });

    it('throws when refund fails', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: () => Promise.resolve(JSON.stringify({ message: 'Already refunded' })),
      });

      await expect(refundPayment('INV-123')).rejects.toThrow('Already refunded');
    });

    it('throws on non-JSON gateway error', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: () => Promise.resolve('<html>Error</html>'),
      });

      await expect(refundPayment('INV-123')).rejects.toThrow('UddoktaPay Gateway Error');
    });
  });
});
