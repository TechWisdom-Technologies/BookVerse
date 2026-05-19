import { SignupForm } from "@/components/auth/SignupForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectUrl = redirect ?? "/";

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-[400px] z-10 relative">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex flex-col items-center gap-2 group">
            <img
              src="/bookverse.png"
              alt="BookVerse Logo"
              className="w-16 h-16 object-contain rounded-xl transition-transform group-hover:scale-105 duration-300"
            />
            <div className="flex flex-col items-center">
              <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                BookVerse
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                By TechWisdom Technologies
              </span>
            </div>
          </Link>
        </div>
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-3 h-3" />
          Back to Archives
        </Link>
        <SignupForm redirectUrl={redirectUrl} />
      </div>
    </main>
  );
}
