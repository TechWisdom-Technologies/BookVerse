import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { profileSchema } from "@/lib/validators";
import { Prisma } from "@prisma/client";
import { adminAuth } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const { dbUser } = await verifyToken();

    const user = await prisma.user.findUnique({
      where: { id: dbUser.id },
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
        membershipTier: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/users/me error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    const body = await request.json();

    const parsed = profileSchema.partial().parse(body);

    // Check username uniqueness if being updated
    if (parsed.username && parsed.username !== dbUser.username) {
      const existing = await prisma.user.findUnique({
        where: { username: parsed.username },
      });
      if (existing) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
      }
    }

    const updateData: Prisma.UserUpdateInput = {};
    if (parsed.displayName !== undefined) updateData.displayName = parsed.displayName;
    if (parsed.username !== undefined) updateData.username = parsed.username;
    if (parsed.avatarUrl !== undefined) updateData.avatarUrl = parsed.avatarUrl;
    if (parsed.bio !== undefined) updateData.bio = parsed.bio;
    if (parsed.dateOfBirth !== undefined) {
      updateData.dateOfBirth = parsed.dateOfBirth ? new Date(parsed.dateOfBirth) : null;
    }
    if (parsed.description !== undefined) updateData.description = parsed.description;
    if (parsed.mood !== undefined) updateData.mood = parsed.mood;
    if (parsed.subGenres !== undefined) updateData.subGenres = parsed.subGenres;
    if (parsed.tags !== undefined) updateData.tags = parsed.tags;
    if (parsed.instructionSeen !== undefined) updateData.instructionSeen = parsed.instructionSeen;
    if (parsed.readingFont !== undefined) updateData.readingFont = parsed.readingFont;
    if (parsed.readerTheme !== undefined) updateData.readerTheme = parsed.readerTheme;
    if (parsed.readingProgressSync !== undefined) updateData.readingProgressSync = parsed.readingProgressSync;
    if (parsed.bkashNumber !== undefined) updateData.bkashNumber = parsed.bkashNumber;
    if (parsed.nagadNumber !== undefined) updateData.nagadNumber = parsed.nagadNumber;

    const user = await prisma.user.update({
      where: { id: dbUser.id },
      data: updateData,
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
        membershipTier: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 409 }
        );
      }
    }
    console.error("PATCH /api/users/me error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { dbUser } = await verifyToken();

    // 1. Delete from Firebase Auth
    try {
      await adminAuth.deleteUser(dbUser.firebaseUid);
    } catch (firebaseErr) {
      console.warn("Failed to delete user from Firebase Auth, might not exist:", firebaseErr);
    }

    // 2. Delete from database
    await prisma.user.delete({
      where: { id: dbUser.id }
    });

    const response = NextResponse.json({ success: true, message: "Account successfully deleted." });
    
    // Clear cookies/session
    response.cookies.set("firebase-token", "", { maxAge: 0, path: "/" });
    response.cookies.set("user-role", "", { maxAge: 0, path: "/" });
    response.cookies.set("user-role-sig", "", { maxAge: 0, path: "/" });

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/users/me error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
