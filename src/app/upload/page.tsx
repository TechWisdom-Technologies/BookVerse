import { BookUploadForm } from "@/components/books/BookUploadForm";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Upload, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function UploadPage() {
  let role: string;

  try {
    const { dbUser } = await verifyToken();
    role = dbUser.role;
  } catch {
    redirect("/login?redirect=/upload");
  }

  if (role !== "AUTHOR" && role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="w-3 h-3" />
                Dashboard
              </Link>
              <h1 className="text-2xl font-bold tracking-tight">Manuscript Protocol</h1>
            </div>
          </header>
          
          <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30 flex items-start gap-4">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-2">Access Restricted</h3>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Your account requires Author-level authorization before original manuscripts can be registered in the BookVerse collective.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Archives
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">Publish Manuscript</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">Upload original scholarly volumes or world-records to the BookVerse collective.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 border border-zinc-100 dark:border-zinc-800 rounded-md">
            <Upload className="w-3.5 h-3.5" />
            Registry Submission
          </div>
        </header>

        <div className="p-8 border border-zinc-100 dark:border-zinc-900 rounded-lg bg-white dark:bg-zinc-950 shadow-sm">
          <BookUploadForm />
        </div>
      </div>
    </main>
  );
}
