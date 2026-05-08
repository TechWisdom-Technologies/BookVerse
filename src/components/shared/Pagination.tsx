"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const searchParams = useSearchParams();
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  };

  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const visiblePages = [];
  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }

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
        {start > 1 && (
          <>
            <Link
              href={getPageUrl(1)}
              className="rounded-lg px-3 py-1 text-sm border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              1
            </Link>
            {start > 2 && <span className="px-1 text-zinc-400">...</span>}
          </>
        )}
        
        {visiblePages.map((page) => {
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

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-zinc-400">...</span>}
            <Link
              href={getPageUrl(totalPages)}
              className="rounded-lg px-3 py-1 text-sm border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              {totalPages}
            </Link>
          </>
        )}
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
