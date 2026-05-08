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
    <main className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          My Shelf
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {savedBooks.length} book{savedBooks.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {savedBooks.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <BookOpen className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700" />
          <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            No saved books yet
          </h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Browse the library and save books to read later.
          </p>
          <Link
            href="/library"
            className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Browse Library
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedBooks.map((save) => (
            <div
              key={save.id}
              className="group relative rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <Link href={`/library/${save.book.id}`} className="flex gap-4">
                <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  {save.book.coverUrl ? (
                    <Image
                      src={save.book.coverUrl}
                      alt={save.book.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-600">
                      <BookOpen className="h-6 w-6 text-white/60" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 line-clamp-2">
                    {save.book.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {save.book.authorName}
                  </p>
                  <span className="mt-2 inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {save.book.genre}
                  </span>
                  <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                    Saved {formatDate(save.createdAt)}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

