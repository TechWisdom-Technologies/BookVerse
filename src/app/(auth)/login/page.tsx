import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;
  const redirectUrl = redirect ?? "/";

  return (
    <main className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-md place-items-center px-6 py-16">
      <LoginForm redirectUrl={redirectUrl} />
    </main>
  );
}
