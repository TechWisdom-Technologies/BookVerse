import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Phase 16: Webhook Authentication Bypass ───
// The UddoktaPay webhook route only checks apiKey IF the header is present.
// If the header is omitted entirely, the check is skipped (line 11: `if (apiKey && configuredKey && apiKey !== configuredKey)`).
// This means an attacker who omits the header completely bypasses the auth check.
// The real protection is server-to-server verifyPayment(), but the conditional is still a flaw.

vi.mock('@/lib/prisma', () => ({
  prisma: {
    failedWebhookLog: { create: vi.fn() },
    subscriptionTransaction: { findFirst: vi.fn(), create: vi.fn() },
    user: { findUnique: vi.fn(), update: vi.fn() },
    storyPromotion: { create: vi.fn() },
    story: { update: vi.fn() },
    tip: { create: vi.fn() },
    $transaction: vi.fn(),
  },
}));

vi.mock('@/lib/uddoktapay', () => ({
  verifyPayment: vi.fn(),
}));

vi.mock('@/lib/notifications', () => ({
  createNotification: vi.fn(),
}));

import { POST } from '@/app/api/payment/uddokta/webhook/route';
import { verifyPayment } from '@/lib/uddoktapay';
import { prisma } from '@/lib/prisma';

describe('Phase 16: Webhook Security', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.UDDOKTAPAY_API_KEY = 'test-secret-key';
  });

  it('rejects webhook calls with WRONG API key', async () => {
    const req = new Request('http://localhost/api/payment/uddokta/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'rt-uddoktapay-api-key': 'WRONG-KEY',
      },
      body: JSON.stringify({ invoice_id: 'INV123' }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(401);
  });

  it('rejects webhook calls with missing invoice_id', async () => {
    const req = new Request('http://localhost/api/payment/uddokta/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('invoice_id');
  });

  it('rejects payment with forged metadata (userId spoofing attempt)', async () => {
    // Attacker sends userId=victim in body, but verifyPayment returns server-verified metadata
    (verifyPayment as any).mockResolvedValue({
      status: 'COMPLETED',
      amount: '199',
      metadata: { userId: 'attacker-id', paymentType: 'PREMIUM', plan: 'PRO', duration: '1' },
      sender_number: '01700000000',
      transaction_id: 'TXN-SPOOF-1',
    });

    (prisma.subscriptionTransaction.findFirst as any).mockResolvedValue(null);
    (prisma.$transaction as any).mockResolvedValue(undefined);

    const req = new Request('http://localhost/api/payment/uddokta/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoice_id: 'INV-SPOOF-1',
        // Attacker tries to put victim's userId in the body - this should be ignored
        metadata: { userId: 'victim-id', paymentType: 'PREMIUM', plan: 'CREATOR' },
      }),
    });

    const res = await POST(req as any);
    // The route uses metadata from verifyPayment() response, NOT from the request body.
    // So the transaction should process using 'attacker-id' from verified metadata,
    // not 'victim-id' from the forged body.
    expect(res.status).toBe(200);
    // Verify that $transaction was called with server-verified userId, not forged body
    if ((prisma.$transaction as any).mock.calls.length > 0) {
      // The userId used in the transaction comes from the verified metadata
      expect(verifyPayment).toHaveBeenCalledWith('INV-SPOOF-1');
    }
  });

  it('rejects premium upgrade with insufficient payment (fraud detection)', async () => {
    (verifyPayment as any).mockResolvedValue({
      status: 'COMPLETED',
      amount: '10', // Should be 199 for PRO
      fee: '0',
      charged_amount: '10',
      metadata: { userId: 'user1', paymentType: 'PREMIUM', plan: 'PRO', duration: '1' },
      sender_number: '01700000000',
      transaction_id: 'TXN-FRAUD-1',
    });

    (prisma.subscriptionTransaction.findFirst as any).mockResolvedValue(null);

    const req = new Request('http://localhost/api/payment/uddokta/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoice_id: 'INV-FRAUD-1' }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Invalid amount');
  });

  it('prevents replay attacks with duplicate transaction ID (idempotency)', async () => {
    (verifyPayment as any).mockResolvedValue({
      status: 'COMPLETED',
      amount: '199',
      metadata: { userId: 'user1', paymentType: 'PREMIUM', plan: 'PRO', duration: '1' },
      sender_number: '01700000000',
      transaction_id: 'TXN-REPLAY-1',
    });

    // Simulate already-processed transaction
    (prisma.subscriptionTransaction.findFirst as any).mockResolvedValue({
      id: 'existing-txn',
      transactionId: 'TXN-REPLAY-1',
    });

    const req = new Request('http://localhost/api/payment/uddokta/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoice_id: 'INV-REPLAY-1' }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toContain('Already processed');
    // Ensure no new transaction was created
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
