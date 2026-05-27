import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { dbUser } = await verifyToken();
    if (dbUser.role !== Role.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();
    const { action, until } = body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (action === 'ban') {
      const updated = await prisma.user.update({ where: { id }, data: { role: 'VISITOR', membershipTier: 'BANNED', membershipExpiry: null } });
      return NextResponse.json({ success: true, user: updated });
    }

    if (action === 'suspend') {
      const untilDate = until ? new Date(until) : null;
      const updated = await prisma.user.update({ where: { id }, data: { membershipTier: 'SUSPENDED', membershipExpiry: untilDate } });
      return NextResponse.json({ success: true, user: updated });
    }

    if (action === 'export') {
      const exported = await prisma.user.findUnique({
        where: { id },
        include: {
          books: true,
          stories: true,
          comments: true,
          achievements: { include: { achievement: true } },
          newsletterSubs: { include: { author: true } },
          dmcaNotices: true,
        },
      });
      return NextResponse.json({ exported });
    }

    if (action === 'impersonate') {
      if (!user.firebaseUid) return NextResponse.json({ error: 'No firebaseUid for user' }, { status: 400 });

      // Prevent admin from impersonating themselves
      if (user.id === dbUser.id) {
        return NextResponse.json({ error: 'Cannot impersonate yourself' }, { status: 400 });
      }

      // Prevent impersonating other admins
      if (user.role === Role.ADMIN) {
        return NextResponse.json({ error: 'Cannot impersonate another admin' }, { status: 403 });
      }

      // Full audit trail — log who impersonated whom, from where
      const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || 'unknown';
      console.warn(
        `[SECURITY_AUDIT] IMPERSONATION: Admin "${dbUser.username}" (id=${dbUser.id}) impersonated user "${user.username}" (id=${user.id}) from IP=${clientIp} at ${new Date().toISOString()}`
      );

      const token = await adminAuth.createCustomToken(user.firebaseUid);
      return NextResponse.json({ token });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('POST /api/admin/users/[id]/actions error:', error);
    return NextResponse.json({ error: 'Failed to perform action' }, { status: 500 });
  }
}
