"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Maximize,
  Minus,
  Plus,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";

interface PdfReaderProps {
  fileUrl: string;
}

const BROKEN_URL = "https://pub-666ffca9921d4b79b6738f62abc3af39.r2.dev/sample-book.pdf";
const FALLBACK_URL = "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";

export function PdfReader({ fileUrl: initialFileUrl }: PdfReaderProps) {
  const fileUrl = initialFileUrl === BROKEN_URL ? FALLBACK_URL : initialFileUrl;
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState(1.25);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use the local worker file that matches the downgraded version (3.11.174)
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    
    console.log("Using PDF.js Version:", pdfjsLib.version);

    let cancelled = false;
    setLoading(true);
    setError(null);
    setPdf(null);
    setPageNum(1);
    setPageCount(0);
    
    const loadingTask = pdfjsLib.getDocument({
      url: fileUrl,
      cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
      cMapPacked: true,
      disableRange: true,
      disableStream: true,
    });

    loadingTask.promise
      .then((document) => {
        if (cancelled) {
          document.destroy();
          return;
        }
        setPdf(document);
        setPageCount(document.numPages);
        setLoading(false);
      })
      .catch((err: any) => {
        if (cancelled) return;
        console.error("PDF Load Error:", err);
        setError(`Unable to load this PDF: ${err.message || "Unknown error"}`);
        setLoading(false);
      });

    return () => {
      cancelled = true;
      loadingTask.destroy();
    };
  }, [fileUrl]);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    let cancelled = false;
    console.log(`Preparing to render page ${pageNum}...`);
    
    const renderPage = async () => {
      try {
        if (cancelled || !pdf || !canvasRef.current) return;
        setRendering(true);
        const page = await pdf.getPage(pageNum);
        if (cancelled || !canvasRef.current) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d", { alpha: false });
        
        if (!context) throw new Error("Canvas context failed");

        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(outputScale, 0, 0, outputScale, 0, 0);
        context.fillStyle = "white";
        context.fillRect(0, 0, viewport.width, viewport.height);

        const renderTask = page.render({
          canvas,
          canvasContext: context,
          viewport,
        });
        renderTaskRef.current = renderTask;
        
        await renderTask.promise;
        if (!cancelled) console.log(`Page ${pageNum} success`);
      } catch (err: any) {
        if (err?.name === "RenderingCancelledException" || cancelled) return;
        console.error(`Page ${pageNum} error:`, err);
        setError(`Rendering error: ${err.message}`);
      } finally {
        if (!cancelled) setRendering(false);
      }
    };

    // Use a small delay to ensure canvas is mounted and DOM is stable
    const timeoutId = setTimeout(renderPage, 50);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      renderTaskRef.current?.cancel();
    };
  }, [pageNum, pdf, scale]);

  const canGoBack = pageNum > 1;
  const canGoForward = pageCount > 0 && pageNum < pageCount;

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPageNum((page) => Math.max(1, page - 1))}
            disabled={!canGoBack || loading}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <input
            type="number"
            min="1"
            max={pageCount || 1}
            value={pageNum}
            onChange={(event) => {
              const nextPage = Number.parseInt(event.target.value, 10) || 1;
              setPageNum(Math.min(pageCount || 1, Math.max(1, nextPage)));
            }}
            className="h-9 w-16 rounded-lg border border-zinc-200 bg-white px-2 text-center text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            of {pageCount || "-"}
          </span>
          <button
            type="button"
            onClick={() => setPageNum((page) => Math.min(pageCount, page + 1))}
            disabled={!canGoForward || loading}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((value) => Math.max(0.75, value - 0.25))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
            title="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-14 text-center text-sm text-zinc-700 dark:text-zinc-300">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setScale((value) => Math.min(3, value + 0.25))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
            title="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => document.documentElement.requestFullscreen?.()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
            title="Fullscreen"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative min-h-[480px] overflow-auto rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
        {(loading || rendering) && (
          <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-zinc-600 shadow-sm dark:bg-zinc-950 dark:text-zinc-300">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {loading ? "Loading" : "Rendering"}
          </div>
        )}

        {error ? (
          <div className="flex min-h-[480px] items-center justify-center text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : (
          <canvas key={pageNum} ref={canvasRef} className="mx-auto bg-white shadow-sm" />
        )}
      </div>
    </div>
  );
}
