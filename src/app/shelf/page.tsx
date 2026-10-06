import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Bookmark } from "lucide-react";
import { ShelfClient } from "./ShelfClient";

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

        <ShelfClient savedBooks={savedBooks} />
      </div>
    </main>
  );
}
