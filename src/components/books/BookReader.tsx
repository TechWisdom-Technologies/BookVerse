"use client";

import dynamic from "next/dynamic";
import { FileType } from "@prisma/client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const PdfReader = dynamic(() => import("./PdfReader").then((mod) => mod.PdfReader), {
  ssr: false,
});

const EpubReader = dynamic(() => import("./EpubReader").then((mod) => mod.EpubReader), {
  ssr: false,
});

interface BookReaderProps {
  fileUrl: string;
  fileType: FileType;
  title: string;
  bookId: string;
}

export function BookReader({ fileUrl, fileType, title, bookId }: BookReaderProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 sm:px-10">
          <Link
            href={`/library/${bookId}`}
            className="flex items-center gap-2 text-sm font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Book
          </Link>
          <h1 className="line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>
          <div />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 py-8 sm:px-10">
        {fileType === "PDF" ? (
          <PdfReader fileUrl={fileUrl} />
        ) : (
          <EpubReader fileUrl={fileUrl} />
        )}
      </div>
    </div>
  );
}
