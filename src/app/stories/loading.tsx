// Loading skeleton for stories page

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Filters skeleton */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="h-10 w-32 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-10 w-32 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Stories grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="aspect-[2/3] w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    </main>
  );
}
