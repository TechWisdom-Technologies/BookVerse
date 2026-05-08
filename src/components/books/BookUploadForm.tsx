"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { bookSchema } from "@/lib/validators";
import { FileUpload } from "@/components/shared/FileUpload";

const genres = [
  "Adventure",
  "Biography",
  "Business",
  "Classics",
  "Fantasy",
  "Fiction",
  "History",
  "Horror",
  "Mystery",
  "Non-Fiction",
  "Poetry",
  "Romance",
  "Science Fiction",
  "Self-Help",
  "Thriller",
];

const languages = [
  "English",
  "Bangla",
  "Hindi",
  "Arabic",
  "French",
  "Spanish",
  "Portuguese",
  "German",
];

type UploadedFileState = {
  url: string;
  key: string;
  file: File;
};

export function BookUploadForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState(genres[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [cover, setCover] = useState<UploadedFileState | null>(null);
  const [bookFile, setBookFile] = useState<UploadedFileState | null>(null);
  const [fileType, setFileType] = useState<"PDF" | "EPUB" | "">("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(title && authorName && genre && language && cover?.url && bookFile?.url && fileType && !submitting);
  }, [authorName, bookFile?.url, cover?.url, fileType, genre, language, submitting, title]);

  function inferFileType(file: File) {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension === "epub" || file.type === "application/epub+zip") return "EPUB" as const;
    return "PDF" as const;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!cover || !bookFile) {
      toast.error("Upload both the cover image and book file first.");
      return;
    }

    const payload = {
      title,
      authorName,
      coverUrl: cover.url,
      fileUrl: bookFile.url,
      fileType: fileType || inferFileType(bookFile.file),
      genre,
      language,
      description: description || null,
    };

    const validated = bookSchema.safeParse(payload);
    if (!validated.success) {
      toast.error(validated.error.issues[0]?.message ?? "Check the form fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(validated.data),
      });

      const result = (await response.json()) as { book?: { id: string }; error?: string };

      if (!response.ok || !result.book) {
        throw new Error(result.error || "Failed to create book.");
      }

      toast.success("Book uploaded successfully.");
      router.push(`/library/${result.book.id}`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600"
            placeholder="Book title"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Author Name</span>
          <input
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600"
            placeholder="Author name"
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Description</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={5}
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600"
          placeholder="Optional description"
        />
      </label>

      <div className="grid gap-6 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Genre</span>
          <select
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600"
          >
            {genres.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Language</span>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600"
          >
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">File Type</span>
          <select
            value={fileType}
            onChange={(event) => setFileType(event.target.value as "PDF" | "EPUB")}
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600"
          >
            <option value="">Select after uploading</option>
            <option value="PDF">PDF</option>
            <option value="EPUB">EPUB</option>
          </select>
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <FileUpload
            label="Cover Image"
            accept="image/*"
            maxSizeMB={5}
            uploadKind="cover"
            helperText="Upload a cover image to R2."
            onUploaded={(result) => setCover(result)}
          />
          {cover?.url ? (
            <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <img src={cover.url} alt="Cover preview" className="aspect-[2/3] w-full object-cover" />
            </div>
          ) : null}
        </div>

        <div className="space-y-3">
          <FileUpload
            label="Book File"
            accept=".pdf,.epub,application/pdf,application/epub+zip"
            maxSizeMB={100}
            uploadKind="book"
            helperText="Upload a PDF or EPUB to R2."
            onUploaded={(result) => {
              setBookFile(result);
              setFileType(inferFileType(result.file));
            }}
          />
          {bookFile?.file ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              Selected file: {bookFile.file.name}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Cover and book files are uploaded first, then the book record is created.
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          {submitting ? "Publishing..." : "Create Book"}
        </button>
      </div>
    </form>
  );
}
