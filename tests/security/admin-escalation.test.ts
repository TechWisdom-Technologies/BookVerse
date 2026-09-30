import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Phase 18: Admin Privilege Escalation & Impersonation ───
// Admin action routes allow ban, suspend, export, and IMPERSONATE.
// These are extremely sensitive operations that must enforce strict authorization.

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('@/lib/firebase-admin', () => ({
  adminAuth: {
    createCustomToken: vi.fn().mockResolvedValue('mock-custom-token'),
  },
}));

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(),
}));

import { POST } from '@/app/api/admin/users/[id]/actions/route';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

describe('Phase 18: Admin Privilege Escalation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('blocks non-admin users from performing admin actions', async () => {
    (verifyToken as any).mockResolvedValue({
      dbUser: { id: 'user1', role: 'MEMBER', username: 'regular-user' },
    });

    const req = new Request('http://localhost/api/admin/users/target-user/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ban' }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'target-user' }) });
    expect(res.status).toBe(403);
  });

  it('prevents admin from impersonating another admin', async () => {
    (verifyToken as any).mockResolvedValue({
      dbUser: { id: 'admin1', role: 'ADMIN', username: 'admin-user' },
    });

    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'admin2',
      role: 'ADMIN',
      firebaseUid: 'firebase-admin2',
      username: 'other-admin',
    });

    const req = new Request('http://localhost/api/admin/users/admin2/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'impersonate' }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'admin2' }) });
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain('Cannot impersonate another admin');
  });

  it('prevents admin from impersonating themselves', async () => {
    (verifyToken as any).mockResolvedValue({
      dbUser: { id: 'admin1', role: 'ADMIN', username: 'admin-user' },
    });

    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'admin1',
      role: 'ADMIN',
      firebaseUid: 'firebase-admin1',
      username: 'admin-user',
    });

    const req = new Request('http://localhost/api/admin/users/admin1/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'impersonate' }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'admin1' }) });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Cannot impersonate yourself');
  });

  it('rejects unknown action types', async () => {
    (verifyToken as any).mockResolvedValue({
      dbUser: { id: 'admin1', role: 'ADMIN', username: 'admin-user' },
    });

    (prisma.user.findUnique as any).mockResolvedValue({
      id: 'user1',
      role: 'MEMBER',
      username: 'target-user',
    });

    const req = new Request('http://localhost/api/admin/users/user1/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_all_data_everywhere' }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'user1' }) });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Unknown action');
  });

  it('prevents AUTHOR role from banning users (privilege escalation attempt)', async () => {
    (verifyToken as any).mockResolvedValue({
      dbUser: { id: 'author1', role: 'AUTHOR', username: 'author-user' },
    });

    const req = new Request('http://localhost/api/admin/users/user1/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ban' }),
    });

    const res = await POST(req, { params: Promise.resolve({ id: 'user1' }) });
    expect(res.status).toBe(403);
  });
});
