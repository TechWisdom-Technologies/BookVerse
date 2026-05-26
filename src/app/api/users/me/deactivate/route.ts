import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { dbUser } = await verifyToken();
    const body = await request.json();
    const { days } = body;

    let deactivatedUntil: Date | null = null;
    if (days && typeof days === "number" && days > 0) {
      deactivatedUntil = new Date();
      deactivatedUntil.setDate(deactivatedUntil.getDate() + days);
    }

    // Update user deactivation states
    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        isDeactivated: true,
        deactivatedUntil,
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "Account successfully deactivated.",
    });

    // Logout: Clear cookies
    response.cookies.set("firebase-token", "", { maxAge: 0, path: "/" });
    response.cookies.set("user-role", "", { maxAge: 0, path: "/" });

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/users/me/deactivate error:", error);
    return NextResponse.json(
      { error: "Failed to deactivate account" },
      { status: 500 }
    );
  }
}
