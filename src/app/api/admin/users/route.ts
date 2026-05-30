import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role, Prisma } from "@prisma/client";
import { adminAuth } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};
    if (search) {
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { displayName: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          displayName: true,
          role: true,
          membershipTier: true,
          membershipExpiry: true,
          avatarUrl: true,
          createdAt: true,
          _count: {
            select: { books: true, stories: true, followers: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ users, total, page, totalPages });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role, membershipTier } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid userId" },
        { status: 400 }
      );
    }
    
    if (role && !Object.values(Role).includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const validTiers = ["AUTHOR", "PRO", "CREATOR"];
    if (membershipTier !== undefined && membershipTier !== null && !validTiers.includes(membershipTier)) {
      return NextResponse.json(
        { error: "Invalid membership tier" },
        { status: 400 }
      );
    }

    // Prevent self-demotion
    if (userId === dbUser.id && role !== undefined && role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 }
      );
    }

    const updateData: Prisma.UserUpdateInput = {};
    if (role !== undefined) updateData.role = role;
    if (membershipTier !== undefined) updateData.membershipTier = membershipTier;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        membershipTier: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.error("PATCH /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { dbUser } = await verifyToken();

    if (dbUser.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Prevent self-deletion
    if (userId === dbUser.id) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 400 }
      );
    }

    // 1. Look up the user's firebaseUid before deleting
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { firebaseUid: true },
    });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Delete from Firebase Auth
    if (targetUser.firebaseUid) {
      try {
        await adminAuth.deleteUser(targetUser.firebaseUid);
      } catch (firebaseErr) {
        console.warn("Failed to delete from Firebase Auth:", firebaseErr);
      }
    }

    // 3. Delete from database
    await prisma.user.delete({ where: { id: userId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.error("DELETE /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
