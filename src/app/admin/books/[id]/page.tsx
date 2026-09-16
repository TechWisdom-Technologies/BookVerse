import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar, Download, Tag, User, Star, Sparkles, Languages } from "lucide-react";
import type { Metadata } from "next";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

interface AdminBookPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AdminBookPageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  
  if (!book) return { title: "Book Not Found" };
  return { title: `Admin - ${book.title}` };
}

export default async function AdminBookPage({ params }: AdminBookPageProps) {
  const { id } = await params;

  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      uploadedBy: {
        select: { id: true, username: true, displayName: true, email: true },
      },
      _count: { select: { reviews: true, saves: true, annotations: true, comments: true } },
    },
  });

  if (!book) {
    notFound();
  }

  const reviews = await prisma.bookReview.findMany({
    where: { bookId: id },
    select: { rating: true },
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/admin/books" className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-brand dark:hover:text-brand transition-colors w-fit">
              <ArrowLeft className="w-4 h-4" />
              Back to Registry
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Book Details</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Viewing full record for volume ID: <span className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1 rounded">{book.id}</span>
              </p>
            </div>
          </div>
          <a href={book.fileUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-brand hover:opacity-90 text-white text-sm font-semibold rounded-md shadow-sm transition-all flex items-center gap-2 w-fit">
            <Download className="w-4 h-4" />
            View Source File
          </a>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column - Cover & Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-4 shadow-sm flex flex-col items-center">
              <div className="relative w-full aspect-[2/3] bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 overflow-hidden mb-4">
                {book.coverUrl ? (
                  <img src={book.coverUrl} alt="Cover" className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <BookOpen className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
                  </div>
                )}
              </div>
              <div className="w-full space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm text-zinc-500">Downloads</span>
                  <span className="font-mono font-medium">{book.downloadCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm text-zinc-500">Rating</span>
                  <span className="font-mono font-medium flex items-center gap-1">
                    {averageRating.toFixed(1)} <Star className="w-3 h-3 text-amber-400" />
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm text-zinc-500">Reviews</span>
                  <span className="font-mono font-medium">{book._count.reviews}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm text-zinc-500">Saves</span>
                  <span className="font-mono font-medium">{book._count.saves}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Uploader Info
              </h3>
              <div className="space-y-1">
                <p className="text-sm font-semibold">{book.uploadedBy.displayName || book.uploadedBy.username}</p>
                <p className="text-xs text-zinc-500 font-mono">{book.uploadedBy.email}</p>
                <Link href={`/admin/users/${book.uploadedBy.id}`} className="text-xs text-brand hover:underline mt-2 inline-block">
                  View User Profile &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Book Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-6 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{book.title}</h2>
                  <p className="text-zinc-500">by {book.authorName}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {book.isNewArrival && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800/50">
                      <Sparkles className="w-3.5 h-3.5" />
                      New Arrival
                    </span>
                  )}
                  {book.isFeatured && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20 rounded border border-emerald-200 dark:border-emerald-800/50">
                      <Star className="w-3.5 h-3.5" />
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-1"><Tag className="w-3 h-3"/> Genre</h4>
                  <p className="font-medium">{book.genre}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-1"><Languages className="w-3 h-3"/> Language</h4>
                  <p className="font-medium">{book.language}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Added On</h4>
                  <p className="font-medium">{format(new Date(book.createdAt), 'PPP')}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 flex items-center gap-1"><BookOpen className="w-3 h-3"/> File Type</h4>
                  <p className="font-medium">{book.fileType}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Description</h4>
                <div className="prose dark:prose-invert max-w-none text-sm">
                  {book.description ? (
                    <p className="whitespace-pre-wrap">{book.description}</p>
                  ) : (
                    <p className="italic text-zinc-400">No description provided.</p>
                  )}
                </div>
              </div>

            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-6 shadow-sm">
              <h3 className="text-base font-bold mb-4">Metadata & Links</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 mb-1 block">Cover URL</label>
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-2 rounded border border-zinc-200 dark:border-zinc-800 font-mono text-xs overflow-x-auto whitespace-nowrap">
                    {book.coverUrl || "None"}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500 mb-1 block">File URL</label>
                  <div className="bg-zinc-50 dark:bg-zinc-950 p-2 rounded border border-zinc-200 dark:border-zinc-800 font-mono text-xs overflow-x-auto whitespace-nowrap">
                    {book.fileUrl}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
