import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { profileSchema } from "@/lib/validators";
import { Prisma } from "@prisma/client";

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
        role: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            stories: true,
          },
        },
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
        role: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            stories: true,
          },
        },
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
