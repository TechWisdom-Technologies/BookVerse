export default function EditProfilePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 sm:px-10">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Edit profile
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Protected by middleware (requires `firebase-token` cookie).
      </p>
    </main>
  );
}

