import { NextRequest, NextResponse } from "next/server";
import { AnnotationType } from "@prisma/client";
import { getAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasFeatureAccess, paidFeatureError } from "@/lib/entitlements";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id: bookId } = await params;
    const user = await getAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await hasFeatureAccess(user, "PRO"))) {
      return NextResponse.json(paidFeatureError("PRO"), { status: 402 });
    }

    const annotations = await prisma.bookAnnotation.findMany({
      where: { bookId, userId: user.id },
      orderBy: [{ pageNumber: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(annotations);
  } catch (error) {
    console.error("GET /api/books/[id]/annotations error:", error);
    return NextResponse.json({ error: "Failed to fetch annotations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: bookId } = await params;
    const user = await getAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await hasFeatureAccess(user, "PRO"))) {
      return NextResponse.json(paidFeatureError("PRO"), { status: 402 });
    }

    const body = await req.json();
    const type = String(body.type || "NOTE").toUpperCase();
    const pageNumber = Number(body.pageNumber);

    if (!Object.values(AnnotationType).includes(type as AnnotationType)) {
      return NextResponse.json({ error: "Invalid annotation type" }, { status: 400 });
    }

    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      return NextResponse.json({ error: "Page number must be a positive integer" }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const annotation = await prisma.bookAnnotation.create({
      data: {
        bookId,
        userId: user.id,
        type: type as AnnotationType,
        pageNumber,
        content: body.content?.trim() || null,
        highlightedText: body.highlightedText?.trim() || null,
        highlightColor: body.highlightColor?.trim() || null,
      },
    });

    return NextResponse.json(annotation, { status: 201 });
  } catch (error) {
    console.error("POST /api/books/[id]/annotations error:", error);
    return NextResponse.json({ error: "Failed to create annotation" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: bookId } = await params;
    const user = await getAuth();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await hasFeatureAccess(user, "PRO"))) {
      return NextResponse.json(paidFeatureError("PRO"), { status: 402 });
    }

    const { annotationId } = await req.json();
    if (!annotationId) {
      return NextResponse.json({ error: "Annotation ID required" }, { status: 400 });
    }

    const result = await prisma.bookAnnotation.deleteMany({
      where: {
        id: annotationId,
        bookId,
        userId: user.id,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Annotation not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/books/[id]/annotations error:", error);
    return NextResponse.json({ error: "Failed to delete annotation" }, { status: 500 });
  }
}
