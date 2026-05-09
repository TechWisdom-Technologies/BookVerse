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
    <div className="flex items-center justify-center gap-3">
      {prevPage >= 1 ? (
        <Link
          href={getPageUrl(prevPage)}
          className="border border-zinc-100 p-2.5 hover:bg-zinc-50 dark:border-zinc-900 dark:hover:bg-zinc-900/50 transition-all rounded"
        >
          <ChevronLeft className="h-4 w-4 text-zinc-400" />
        </Link>
      ) : (
        <button
          disabled
          className="border border-zinc-50 p-2.5 opacity-30 dark:border-zinc-900 cursor-not-allowed rounded"
        >
          <ChevronLeft className="h-4 w-4 text-zinc-300" />
        </button>
      )}

      <div className="flex items-center gap-2">
        {start > 1 && (
          <>
            <Link
              href={getPageUrl(1)}
              className="px-4 py-2 text-[10px] font-bold border border-zinc-100 hover:bg-zinc-50 dark:border-zinc-900 dark:hover:bg-zinc-900/50 transition-all rounded"
            >
              01
            </Link>
            {start > 2 && <span className="px-2 text-[10px] font-bold text-zinc-300">...</span>}
          </>
        )}
        
        {visiblePages.map((page) => {
          const isActive = page === currentPage;

          return (
            <Link
              key={page}
              href={getPageUrl(page)}
              className={`px-4 py-2 text-[10px] font-bold transition-all border rounded ${
                isActive
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white shadow-sm"
                  : "border-zinc-100 hover:bg-zinc-50 dark:border-zinc-900 dark:hover:bg-zinc-900/50 text-zinc-400"
              }`}
            >
              {page.toString().padStart(2, '0')}
            </Link>
          );
        })}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-2 text-[10px] font-bold text-zinc-300">...</span>}
            <Link
              href={getPageUrl(totalPages)}
              className="px-4 py-2 text-[10px] font-bold border border-zinc-100 hover:bg-zinc-50 dark:border-zinc-900 dark:hover:bg-zinc-900/50 transition-all rounded"
            >
              {totalPages.toString().padStart(2, '0')}
            </Link>
          </>
        )}
      </div>

      {nextPage <= totalPages ? (
        <Link
          href={getPageUrl(nextPage)}
          className="border border-zinc-100 p-2.5 hover:bg-zinc-50 dark:border-zinc-900 dark:hover:bg-zinc-900/50 transition-all rounded"
        >
          <ChevronRight className="h-4 w-4 text-zinc-400" />
        </Link>
      ) : (
        <button
          disabled
          className="border border-zinc-50 p-2.5 opacity-30 dark:border-zinc-900 cursor-not-allowed rounded"
        >
          <ChevronRight className="h-4 w-4 text-zinc-300" />
        </button>
      )}
    </div>
  );
}
