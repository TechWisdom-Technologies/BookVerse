import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ShelfPage() {
  // Verify auth and get current user
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;

  if (!token) {
    redirect("/login?redirect=/shelf");
  }

  let userId: string;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
      select: { id: true },
    });
    if (!user) redirect("/login?redirect=/shelf");
    userId = user.id;
  } catch {
    redirect("/login?redirect=/shelf");
  }

  // Fetch saved books
  const savedBooks = await prisma.bookSave.findMany({
    where: { userId },
    include: {
      book: {
        select: {
          id: true,
          title: true,
          authorName: true,
          coverUrl: true,
          genre: true,
          description: true,
          downloadCount: true,
          _count: { select: { reviews: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A] pt-16 pb-32">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        
        {/* Huge Clean Header */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter mb-6">
                Your Shelf.
              </h1>
              <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                Your personal collection of masterpieces. Read, manage, and curate your favorite books and stories.
              </p>
            </div>
            
            <div className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-full font-bold text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800">
              <BookOpen className="w-5 h-5 text-brand" />
              <span>{savedBooks.length} Books Saved</span>
            </div>
          </div>
        </header>

        {/* Minimal Divider */}
        <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-12" />

        {savedBooks.length === 0 ? (
          <div className="py-32 text-center bg-zinc-50 dark:bg-zinc-900/30 rounded-[3rem] border border-zinc-200 dark:border-zinc-800">
            <BookOpen className="mx-auto w-16 h-16 text-zinc-300 dark:text-zinc-700 mb-6" />
            <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
              Your shelf is empty
            </h3>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed mb-8">
              Start exploring our massive library of books and stories to build your personal collection.
            </p>
            <Link
              href="/library"
              className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              Browse Library
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {savedBooks.map((save) => (
              <Link 
                key={save.id}
                href={`/library/${save.book.id}`}
                className="group flex flex-col relative"
              >
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-5 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 ring-1 ring-black/5 dark:ring-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  
                  {save.book.coverUrl ? (
                    <Image
                      src={save.book.coverUrl}
                      alt={save.book.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 transition-transform duration-700 group-hover:scale-105">
                      <BookOpen className="h-12 w-12 text-zinc-400 dark:text-zinc-600" />
                    </div>
                  )}
                  
                  {/* Decorative read button on hover */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    <div className="px-8 py-3 bg-white text-zinc-900 font-bold rounded-full text-sm shadow-xl whitespace-nowrap">
                      Read Now
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand">
                      {save.book.genre}
                    </span>
                    <span className="text-xs font-medium text-zinc-400">
                      Saved {formatDate(save.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight mb-1 group-hover:text-brand transition-colors line-clamp-1">
                    {save.book.title}
                  </h3>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    by {save.book.authorName}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

