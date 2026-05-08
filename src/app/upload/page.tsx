import { BookUploadForm } from "@/components/books/BookUploadForm";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UploadPage() {
  let role: string;

  try {
    const { dbUser } = await verifyToken();
    role = dbUser.role;
  } catch {
    redirect("/login?redirect=/upload");
  }

  if (role !== "AUTHOR" && role !== "ADMIN") {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12 sm:px-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Upload a book
        </h1>
        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Your account needs author access before you can upload books.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 sm:px-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Upload a book
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Add the book details, upload the cover and file, then publish it to the library.
        </p>
      </div>

      <BookUploadForm />
    </main>
  );
}
