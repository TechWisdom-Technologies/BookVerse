import { LoginForm } from "@/components/auth/LoginForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectUrl = redirect ?? "/";

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-6 relative">
      <div className="w-full max-w-[400px] z-10 relative">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-3 h-3" />
          Back to Archives
        </Link>
        <LoginForm redirectUrl={redirectUrl} />
      </div>
    </main>
  );
}
