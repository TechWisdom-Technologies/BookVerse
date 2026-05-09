import { prisma } from "@/lib/prisma";
import { BookDetail } from "@/components/books/BookDetail";
import { BookReviews } from "@/components/books/BookReviews";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });

  if (!book) {
    return { title: "Book not found" };
  }

  return {
    title: book.title,
    description: book.description,
    openGraph: {
      title: book.title,
      description: book.description || "Read this book on BookVerse",
      images: book.coverUrl ? [{ url: book.coverUrl }] : [],
    },
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;

  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        _count: { select: { reviews: true, saves: true } },
      },
    });

    if (!book) {
      notFound();
    }

    // Get reviews
    const reviews = await prisma.bookReview.findMany({
      where: { bookId: id },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    const serializedReviews = reviews.map((review) => ({
      ...review,
      createdAt: review.createdAt.toISOString(),
    }));

    // Calculate average rating
    const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    // Get current user
    let currentUserId: string | null = null;
    let isSaved = false;

    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("firebase-token")?.value;

      if (token) {
        const decoded = await adminAuth.verifyIdToken(token);
        const user = await prisma.user.findUnique({
          where: { firebaseUid: decoded.uid },
          select: { id: true },
        });
        currentUserId = user?.id || null;

        if (currentUserId) {
          const save = await prisma.bookSave.findUnique({
            where: { bookId_userId: { bookId: id, userId: currentUserId } },
          });
          isSaved = !!save;
        }
      }
    } catch {
      // User not authenticated
    }

    return (
      <main className="min-h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A] pt-16 pb-32">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <BookDetail
            book={{ ...book, averageRating }}
            currentUserId={currentUserId}
            isSaved={isSaved}
          />

          {/* Reviews Section */}
          <div className="mt-20 border-t border-zinc-200 pt-16 dark:border-zinc-800">
            <BookReviews
              bookId={id}
              reviews={serializedReviews}
              currentUserId={currentUserId}
            />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("BookPage error:", error);
    return (
      <main>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-600 dark:text-zinc-400">Failed to load book</p>
          </div>
        </div>
      </main>
    );
  }

}
