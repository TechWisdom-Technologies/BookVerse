"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {prevPage >= 1 ? (
        <Link
          href={getPageUrl(prevPage)}
          className="rounded-lg border border-zinc-200 p-2 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <button
          disabled
          className="rounded-lg border border-zinc-200 p-2 opacity-50 dark:border-zinc-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;

          return (
            <Link
              key={page}
              href={getPageUrl(page)}
              className={`rounded-lg px-3 py-1 text-sm ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950"
                  : "border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {nextPage <= totalPages ? (
        <Link
          href={getPageUrl(nextPage)}
          className="rounded-lg border border-zinc-200 p-2 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <button
          disabled
          className="rounded-lg border border-zinc-200 p-2 opacity-50 dark:border-zinc-800"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
