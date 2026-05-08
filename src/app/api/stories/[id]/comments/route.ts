import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { commentSchema } from "@/lib/validators";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id: storyId } = await params;
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    const where = {
      storyId,
      parentId: null, // Only top-level comments
    };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatarUrl: true,
                },
              },
              replies: {
                include: {
                  author: {
                    select: {
                      id: true,
                      username: true,
                      displayName: true,
                      avatarUrl: true,
                    },
                  },
                },
                orderBy: { createdAt: "asc" as const },
                take: 5,
              },
            },
            orderBy: { createdAt: "asc" as const },
            take: 10,
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ comments, total, page, totalPages });
  } catch (error) {
    console.error("GET /api/stories/[id]/comments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: storyId } = await params;
    const { dbUser } = await verifyToken();

    const body = await request.json();
    const parsed = commentSchema.parse(body);

    // Verify story exists
    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true, authorId: true, title: true },
    });
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    // If replying, verify parent comment exists
    if (parsed.parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: parsed.parentId },
      });
      if (!parent) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content: parsed.content,
        authorId: dbUser.id,
        storyId,
        parentId: parsed.parentId ?? null,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Send notification email to story author (fire-and-forget)
    if (story.authorId !== dbUser.id) {
      import("@/lib/resend").then(async ({ sendEmail }) => {
        try {
          const storyAuthor = await prisma.user.findUnique({
            where: { id: story.authorId },
            select: { email: true, displayName: true },
          });
          if (storyAuthor?.email) {
            await sendEmail(
              storyAuthor.email,
              `New comment on "${story.title}"`,
              `${dbUser.displayName || dbUser.username} commented: "${parsed.content.slice(0, 200)}"`
            );
          }
        } catch (emailError) {
          console.error("Failed to send comment notification:", emailError);
        }
      }).catch(() => { /* ignore email module errors */ });
    }

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/stories/[id]/comments error:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
