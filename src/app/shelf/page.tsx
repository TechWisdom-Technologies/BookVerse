import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { BookOpen, ArrowLeft, Loader2, Bookmark } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function ShelfPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebase-token")?.value;

  if (!token) redirect("/login?redirect=/shelf");

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
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Simple Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">My Library.</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">Your personal collection of saved books and community stories.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800">
            <Bookmark className="w-3.5 h-3.5 text-zinc-300" />
            {savedBooks.length} Books Saved
          </div>
        </header>

        {savedBooks.length === 0 ? (
          <div className="py-40 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
            <BookOpen className="mx-auto w-10 h-10 text-zinc-100 dark:text-zinc-800 mb-8" />
            <h3 className="text-sm font-bold uppercase tracking-tight mb-2">Library Empty</h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto mb-10 font-bold uppercase tracking-widest">You haven&apos;t saved any books yet.</p>
            <Link
              href="/library"
              className="px-10 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all"
            >
              Browse Library
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900">
            {savedBooks.map((save) => (
              <Link 
                key={save.id}
                href={`/library/${save.book.id}`}
                className="group flex flex-col p-8 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all"
              >
                <div className="relative aspect-[2/3] w-full rounded overflow-hidden bg-zinc-50 dark:bg-zinc-900 mb-6 border border-zinc-100 dark:border-zinc-800">
                  {save.book.coverUrl ? (
                    <Image
                      src={save.book.coverUrl}
                      alt={save.book.title}
                      fill
                      className="object-cover transition-all duration-700"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-200 dark:text-zinc-800">
                      <BookOpen className="h-10 w-10" />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">
                      {save.book.genre}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors line-clamp-1 uppercase">
                    {save.book.title}
                  </h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    {save.book.authorName}
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
