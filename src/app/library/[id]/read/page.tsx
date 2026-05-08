import { prisma } from "@/lib/prisma";
import { BookReader } from "@/components/books/BookReader";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface ReaderPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { id } = await params;

  try {
    const book = await prisma.book.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        fileUrl: true,
        fileType: true,
      },
    });

    if (!book) {
      notFound();
    }

    return (
      <BookReader
        bookId={book.id}
        title={book.title}
        fileUrl={book.fileUrl}
        fileType={book.fileType}
      />
    );
  } catch (error) {
    console.error("ReaderPage error:", error);
    notFound();
  }
}

