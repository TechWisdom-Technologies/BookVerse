import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <Search className="h-10 w-10 text-zinc-400" />
        </div>

        <h1 className="mt-6 text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          404
        </h1>

        <h2 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Page not found
        </h2>

        <p className="mt-4 text-zinc-600 dark:text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>

        <div className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">
          <p>Looking for something specific?</p>
          <Link
            href="/search"
            className="mt-2 inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400"
          >
            <Search className="h-3 w-3" />
            Try searching
          </Link>
        </div>
      </div>
    </main>
  );
}
