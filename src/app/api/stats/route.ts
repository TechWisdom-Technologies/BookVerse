import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalBooks, totalAuthors, totalUsers] = await Promise.all([
      prisma.book.count(),
      prisma.user.count({ where: { role: 'AUTHOR' } }),
      prisma.user.count(),
    ]);

    return NextResponse.json({ totalBooks, totalAuthors, totalUsers });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
