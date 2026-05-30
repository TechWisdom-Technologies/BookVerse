import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { generateUsername } from "@/lib/utils";
import { sendWelcomeEmail } from "@/lib/resend";
import { signRole } from "@/lib/cookie-crypto";
import { checkRateLimit } from "@/lib/rate-limit";
import { Role } from "@prisma/client";

async function readToken() {
  const h = await headers();
  const authHeader = h.get("authorization");
  const tokenFromHeader = authHeader?.toLowerCase().startsWith("bearer ")
    ? authHeader.slice("bearer ".length).trim()
    : undefined;

  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get("firebase-token")?.value;

  return tokenFromHeader || tokenFromCookie;
}

export async function POST() {
  const limitRes = await checkRateLimit(60, 60000);
  if (limitRes.limited) return limitRes.response;

  const token = await readToken();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = await adminAuth.verifyIdToken(token);

    const email = decoded.email;
    if (!email) return NextResponse.json({ error: "Email missing" }, { status: 400 });

    const createUsername = generateUsername(email);

    const existing = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      select: { id: true, isDeactivated: true, displayName: true, avatarUrl: true },
    });

    const updateFields: Record<string, unknown> = { email };
    if (existing?.isDeactivated) {
      updateFields.isDeactivated = false;
      updateFields.deactivatedUntil = null;
    }

    // Sync Firebase Auth name & picture if currently missing/null in our database
    if (existing) {
      if (!existing.displayName && decoded.name) {
        updateFields.displayName = decoded.name;
      }
      if (!existing.avatarUrl && decoded.picture) {
        updateFields.avatarUrl = decoded.picture;
      }
    }

    let isFoundingUser = false;
    if (!existing) {
      const userCount = await prisma.user.count();
      if (userCount < 100) {
        isFoundingUser = true;
      }
    }

    const user = await prisma.user.upsert({
      where: { firebaseUid: decoded.uid },
      create: {
        firebaseUid: decoded.uid,
        email,
        username: createUsername,
        displayName: decoded.name ?? null,
        avatarUrl: decoded.picture ?? null,
        role: isFoundingUser ? Role.AUTHOR : Role.VISITOR,
        membershipTier: isFoundingUser ? "CREATOR" : null,
      },
      update: updateFields,
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        avatarUrl: true,
        bio: true,
        dateOfBirth: true,
        role: true,
        createdAt: true,
        description: true,
        mood: true,
        subGenres: true,
        tags: true,
        adminInstruction: true,
        instructionSeen: true,
        readingFont: true,
        readerTheme: true,
        readingProgressSync: true,
        bkashNumber: true,
        nagadNumber: true,
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
    
    const isProd = process.env.NODE_ENV === "production";
    res.cookies.set("firebase-token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    
    res.cookies.set("user-role", user.role, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    
    const roleSig = await signRole(user.role);
    res.cookies.set("user-role-sig", roleSig, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Send welcome email for new users (fire-and-forget)
    if (!existing) {
      void sendWelcomeEmail(user.email, user.username);
    }

    return res;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

