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
      <main className="min-h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A] pt-16 pb-32">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">
              Publish Story.
            </h1>
          </header>
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 sm:p-12 shadow-xl shadow-zinc-200/20 dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-none relative overflow-hidden">
            <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
              Your account needs author access before you can publish stories.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A] pt-10 sm:pt-16 pb-20 sm:pb-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
        <header className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-3 sm:mb-4">
            Publish Story.
          </h1>
          <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 font-medium">
            Upload your manuscript, design a cover, and share your world.
          </p>
        </header>

        <div className="rounded-[2rem] sm:rounded-[2.5rem] bg-white/80 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 p-6 sm:p-10 md:p-12 shadow-xl shadow-zinc-200/20 dark:shadow-none">
          <BookUploadForm />
        </div>
      </div>
    </main>
  );
}
