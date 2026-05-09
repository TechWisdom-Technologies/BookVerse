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
    <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
        <div className="group">
          <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 sm:mb-3 ml-2 block group-focus-within:text-brand transition-colors">
            Title
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="block w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-medium text-zinc-900 placeholder-zinc-400 transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
            placeholder="Book title"
          />
        </div>

        <div className="group">
          <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 sm:mb-3 ml-2 block group-focus-within:text-brand transition-colors">
            Author Name
          </label>
          <input
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            className="block w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-medium text-zinc-900 placeholder-zinc-400 transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900"
            placeholder="Author name"
          />
        </div>
      </div>

      <div className="group">
        <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 sm:mb-3 ml-2 block group-focus-within:text-brand transition-colors">
          Description
        </label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={5}
          className="block w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-medium text-zinc-900 placeholder-zinc-400 transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900 resize-none"
          placeholder="What is your story about?"
        />
      </div>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
        <div className="group">
          <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 sm:mb-3 ml-2 block group-focus-within:text-brand transition-colors">
            Genre
          </label>
          <select
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            className="block w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-medium text-zinc-900 transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900 appearance-none"
          >
            {genres.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="group">
          <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 sm:mb-3 ml-2 block group-focus-within:text-brand transition-colors">
            Language
          </label>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="block w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-medium text-zinc-900 transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900 appearance-none"
          >
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="group">
          <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 sm:mb-3 ml-2 block group-focus-within:text-brand transition-colors">
            File Type
          </label>
          <select
            value={fileType}
            onChange={(event) => setFileType(event.target.value as "PDF" | "EPUB")}
            className="block w-full rounded-2xl border-2 border-zinc-200 bg-zinc-50/50 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-medium text-zinc-900 transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:bg-zinc-900 appearance-none"
          >
            <option value="">Select after uploading</option>
            <option value="PDF">PDF</option>
            <option value="EPUB">EPUB</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 pt-2 sm:pt-4">
        <div className="space-y-4">
          <div className="bg-zinc-50 dark:bg-zinc-900/30 rounded-[2rem] sm:rounded-3xl p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <FileUpload
              label="Cover Image"
              accept="image/*"
              maxSizeMB={5}
              uploadKind="cover"
              helperText="Upload a beautiful cover to grab attention."
              onUploaded={(result) => setCover(result)}
            />
          </div>
          {cover?.url ? (
            <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none relative aspect-[2/3] w-32 sm:w-48 group">
              <img src={cover.url} alt="Cover preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                <span className="text-white font-bold text-xs sm:text-sm tracking-wide uppercase">Cover Ready</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="bg-zinc-50 dark:bg-zinc-900/30 rounded-[2rem] sm:rounded-3xl p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <FileUpload
              label="Manuscript"
              accept=".pdf,.epub,application/pdf,application/epub+zip"
              maxSizeMB={100}
              uploadKind="book"
              helperText="Upload your PDF or EPUB manuscript."
              onUploaded={(result) => {
                setBookFile(result);
                setFileType(inferFileType(result.file));
              }}
            />
          </div>
          {bookFile?.file ? (
            <div className="rounded-2xl border-2 border-green-500/20 bg-green-50 px-4 sm:px-6 py-3 sm:py-4 dark:border-green-500/20 dark:bg-green-500/10 flex items-center gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 font-bold shrink-0">
                ✓
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-green-800 dark:text-green-300">File Selected</p>
                <p className="text-xs font-medium text-green-600 dark:text-green-400 truncate">{bookFile.file.name}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 sm:pt-10 mt-8 sm:mt-10 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 max-w-sm text-center md:text-left">
          Make sure your cover and manuscript are uploaded before publishing.
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand px-10 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-black text-white transition-all hover:bg-orange-600 hover:shadow-xl hover:shadow-brand/20 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {submitting ? "Publishing..." : "Publish Story"}
        </button>
      </div>
    </form>
  );
}
