"use client";

import { useRef, useState } from "react";

type UploadResult = {
  url: string;
  key: string;
  file: File;
};

interface FileUploadProps {
  label: string;
  accept: string;
  maxSizeMB?: number;
  maxSize?: number;
  uploadKind?: "cover" | "book";
  helperText?: string;
  onUploaded?: (result: UploadResult) => void;
  onUpload?: (url: string) => void;
}

function isAcceptedFile(file: File, accept: string) {
  const allowed = accept.split(",").map((item) => item.trim()).filter(Boolean);
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  return allowed.some((item) => {
    if (item === "image/*") return file.type.startsWith("image/");
    if (item === ".pdf") return extension === "pdf";
    if (item === ".epub") return extension === "epub";
    if (item === "application/pdf") return file.type === "application/pdf";
    if (item === "application/epub+zip") {
      return file.type === "application/epub+zip" || extension === "epub";
    }
    if (item.startsWith(".")) return extension === item.slice(1).toLowerCase();
    return file.type === item;
  });
}

export function FileUpload({
  label,
  accept,
  maxSizeMB,
  maxSize,
  uploadKind,
  helperText,
  onUploaded,
  onUpload,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function uploadFile(file: File) {
    if (!isAcceptedFile(file, accept)) {
      setError("Unsupported file type.");
      return;
    }

    const resolvedMaxSizeMB = maxSizeMB ?? (maxSize ? maxSize / 1024 / 1024 : 10);
    const maxSizeBytes = resolvedMaxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File must be smaller than ${resolvedMaxSizeMB} MB.`);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", uploadKind ?? "cover");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      setProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      setUploading(false);

      if (xhr.status < 200 || xhr.status >= 300) {
        const message =
          (() => {
            try {
              const payload = JSON.parse(xhr.responseText) as { error?: string };
              return payload.error || "Upload failed.";
            } catch {
              return "Upload failed.";
            }
          })();
        setError(message);
        return;
      }

      try {
        const payload = JSON.parse(xhr.responseText) as { url: string; key: string };
        onUploaded?.({ url: payload.url, key: payload.key, file });
        onUpload?.(payload.url);
        setProgress(100);
      } catch {
        setError("Upload completed but response could not be parsed.");
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setError("Network error while uploading.");
    };

    xhr.send(formData);
  }

  function handleSelectedFile(file: File | null) {
    if (!file) return;
    uploadFile(file);
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleSelectedFile(event.dataTransfer.files?.[0] ?? null);
        }}
        className={`rounded-2xl border border-dashed p-5 transition ${
          dragActive
            ? "border-zinc-900 bg-zinc-100 dark:border-zinc-50 dark:bg-zinc-900"
            : "border-zinc-300 bg-white dark:border-zinc-800 dark:bg-zinc-950"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</p>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              {helperText ?? `Accepts ${accept}. Max ${maxSizeMB ?? (maxSize ? maxSize / 1024 / 1024 : 10)} MB.`}
            </p>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              {fileName ?? "Drop a file here or click to browse"}
            </p>
          </div>
          <div className="text-right text-xs text-zinc-500 dark:text-zinc-400">
            {uploading ? `${progress}%` : "Ready"}
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
          <div
            className="h-full rounded-full bg-zinc-900 transition-all duration-200 dark:bg-zinc-50"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => handleSelectedFile(event.target.files?.[0] ?? null)}
      />

      {error ? <p className="text-xs text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  );
}
