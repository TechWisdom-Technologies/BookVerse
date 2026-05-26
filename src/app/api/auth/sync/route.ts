import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { generateUsername } from "@/lib/utils";
import { sendWelcomeEmail } from "@/lib/resend";

async function readToken() {
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get("firebase-token")?.value;

  const h = await headers();
  const authHeader = h.get("authorization");
  const tokenFromHeader = authHeader?.toLowerCase().startsWith("bearer ")
    ? authHeader.slice("bearer ".length).trim()
    : undefined;

  return tokenFromCookie || tokenFromHeader;
}

export async function POST() {
  const token = await readToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = await adminAuth.verifyIdToken(token);

    const email = decoded.email;
    if (!email) return NextResponse.json({ error: "Email missing" }, { status: 400 });

    const createUsername = generateUsername(email);

    const existing = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      select: { id: true, isDeactivated: true },
    });

    const updateFields: any = { email };
    if (existing?.isDeactivated) {
      updateFields.isDeactivated = false;
      updateFields.deactivatedUntil = null;
    }

    const user = await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      create: {
        firebaseUid: decoded.uid,
        email,
        username: createUsername,
        displayName: decoded.name ?? null,
        avatarUrl: decoded.picture ?? null,
      },
      update: updateFields,
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            stories: true,
          },
        },
        onboardingQuiz: {
          select: { completed: true }
        },
      },
    });

    const needsOnboarding = !user.onboardingQuiz || !user.onboardingQuiz.completed;

    const res = NextResponse.json({ user, needsOnboarding });
    res.cookies.set("user-role", user.role, { httpOnly: false, sameSite: "lax", path: "/" });

    // Send welcome email for new users (fire-and-forget)
    if (!existing) {
      void sendWelcomeEmail(user.email, user.username);
    }

    return res;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

