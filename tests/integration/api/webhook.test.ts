import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../../src/app/api/payment/uddokta/webhook/route';
import { verifyPayment } from '@/lib/uddoktapay';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/uddoktapay', () => ({
  verifyPayment: vi.fn(),
}));

describe('UddoktaPay Webhook Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('UDDOKTAPAY_API_KEY', 'secret-key-123');
  });

  it('returns 400 if invoice_id is missing', async () => {
    const req = new Request('http://localhost/api/webhook', {
      method: 'POST',
      body: JSON.stringify({})
    });
    const response = await POST(req as any);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Missing invoice_id');
  });

  it('returns 401 if api key does not match', async () => {
    const req = new Request('http://localhost/api/webhook', {
      method: 'POST',
      headers: {
        'rt-uddoktapay-api-key': 'wrong-key'
      },
      body: JSON.stringify({ invoice_id: 'inv_123' })
    });
    
    // Also test that it attempts to log the failure
    (prisma.failedWebhookLog.create as any).mockResolvedValue({});
    
    const response = await POST(req as any);
    expect(response.status).toBe(401);
  });

  it('returns 200 with ignored message if payment status is not COMPLETED', async () => {
    (verifyPayment as any).mockResolvedValue({ status: 'PENDING' });
    
    const req = new Request('http://localhost/api/webhook', {
      method: 'POST',
      headers: {
        'rt-uddoktapay-api-key': 'secret-key-123'
      },
      body: JSON.stringify({ invoice_id: 'inv_123' })
    });
    
    const response = await POST(req as any);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe('Ignored, not completed');
  });

  it('returns 400 if metadata is missing userId or paymentType', async () => {
    (verifyPayment as any).mockResolvedValue({ 
      status: 'COMPLETED',
      amount: '199.00',
      metadata: { userId: 'user1' } // Missing paymentType
    });
    
    const req = new Request('http://localhost/api/webhook', {
      method: 'POST',
      headers: {
        'rt-uddoktapay-api-key': 'secret-key-123'
      },
      body: JSON.stringify({ invoice_id: 'inv_123' })
    });
    
    const response = await POST(req as any);
    expect(response.status).toBe(400);
  });

  it('returns 200 early if transaction is already processed (Idempotency)', async () => {
    (verifyPayment as any).mockResolvedValue({ 
      status: 'COMPLETED',
      amount: '199.00',
      transaction_id: 'txn_123',
      metadata: { userId: 'user1', paymentType: 'PREMIUM' }
    });
    
    // Simulate transaction already exists in DB
    (prisma.subscriptionTransaction.findFirst as any).mockResolvedValue({ id: 'existing_record' });
    
    const req = new Request('http://localhost/api/webhook', {
      method: 'POST',
      headers: {
        'rt-uddoktapay-api-key': 'secret-key-123'
      },
      body: JSON.stringify({ invoice_id: 'inv_123' })
    });
    
    const response = await POST(req as any);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toBe('Already processed');
  });

  it('processes a PREMIUM upgrade successfully and creates transactions', async () => {
    (verifyPayment as any).mockResolvedValue({ 
      status: 'COMPLETED',
      amount: '199.00', // PRO tier costs 199 for 1 month
      transaction_id: 'txn_123',
      sender_number: '01711111111',
      payment_method: 'bkash',
      metadata: { userId: 'user1', paymentType: 'PREMIUM', plan: 'PRO', duration: '1' }
    });
    
    (prisma.subscriptionTransaction.findFirst as any).mockResolvedValue(null);
    (prisma.user.findUnique as any).mockResolvedValue({ id: 'user1', membershipTier: 'FREE' });
    
    // Mock the $transaction method to just execute the callback
    (prisma.$transaction as any).mockImplementation(async (cb: any) => cb(prisma));
    
    const req = new Request('http://localhost/api/webhook', {
      method: 'POST',
      headers: {
        'rt-uddoktapay-api-key': 'secret-key-123'
      },
      body: JSON.stringify({ invoice_id: 'inv_123' })
    });
    
    const response = await POST(req as any);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    
    // Verify it updated the user to PRO
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user1' },
        data: expect.objectContaining({
          membershipTier: 'PRO'
        })
      })
    );
    
    // Verify it created a subscription transaction log
    expect(prisma.subscriptionTransaction.create).toHaveBeenCalled();
  });
});
