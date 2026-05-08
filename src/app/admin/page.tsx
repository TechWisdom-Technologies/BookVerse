export default function AdminPage() {
  return (
    <main className="min-h-[60vh]">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Admin dashboard
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Protected by middleware (requires `firebase-token` + `user-role=ADMIN`).
      </p>
    </main>
  );
}

