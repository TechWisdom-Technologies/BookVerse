import { SignupForm } from "@/components/auth/SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectUrl = redirect ?? "/";

  return (
    <main className="min-h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A] flex flex-col items-center justify-center py-20 px-6 relative">
      <div className="absolute inset-0 bg-grid-zinc-900/[0.04] dark:bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
      <div className="w-full max-w-[480px] z-10 relative">
        <SignupForm redirectUrl={redirectUrl} />
      </div>
    </main>
  );
}
