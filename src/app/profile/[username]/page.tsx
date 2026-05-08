export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        @{username}
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Phase 0 placeholder. Public profile will be rendered from Prisma in Phase 1.
      </p>
    </main>
  );
}

