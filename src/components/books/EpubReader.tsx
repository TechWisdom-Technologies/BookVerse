"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import type { Rendition } from "epubjs";
import type { IReactReaderStyle } from "react-reader";
import { BookOpen, Minus, Plus } from "lucide-react";

const ReactReader = dynamic(
  () => import("react-reader").then((module) => module.ReactReader),
  { ssr: false }
);

interface EpubReaderProps {
  fileUrl: string;
}

type ReaderTheme = "light" | "dark" | "sepia";

const themeStyles: Record<ReaderTheme, { background: string; text: string }> = {
  light: { background: "#ffffff", text: "#18181b" },
  dark: { background: "#09090b", text: "#f4f4f5" },
  sepia: { background: "#f4ecd8", text: "#3f2f20" },
};

export function EpubReader({ fileUrl }: EpubReaderProps) {
  const [location, setLocation] = useState<string | number | null>(null);
  const [theme, setTheme] = useState<ReaderTheme>("light");
  const [fontSize, setFontSize] = useState(16);
  const [rendition, setRendition] = useState<Rendition | null>(null);

  const applyTheme = useCallback(
    (nextRendition: Rendition, nextTheme: ReaderTheme, nextFontSize: number) => {
      const selectedTheme = themeStyles[nextTheme];
      nextRendition.themes.register("bookverse", {
        body: {
          background: `${selectedTheme.background} !important`,
          color: `${selectedTheme.text} !important`,
          "font-size": `${nextFontSize}px !important`,
          "line-height": "1.75 !important",
        },
        p: {
          "line-height": "1.75 !important",
        },
      });
      nextRendition.themes.select("bookverse");
    },
    []
  );

  const readerStyles = useMemo<IReactReaderStyle>(
    () => ({
      container: {
        height: "100%",
        overflow: "hidden",
        position: "relative",
      },
      readerArea: {
        backgroundColor: themeStyles[theme].background,
        height: "100%",
        position: "relative",
        transition: "background-color 160ms ease",
        width: "100%",
        zIndex: 1,
      },
      containerExpanded: {
        transform: "translateX(256px)",
      },
      titleArea: {
        color: themeStyles[theme].text,
        fontSize: 13,
        left: 48,
        opacity: 0.7,
        position: "absolute",
        right: 48,
        textAlign: "center",
        top: 18,
      },
      reader: {
        bottom: 24,
        left: 48,
        position: "absolute",
        right: 48,
        top: 52,
      },
      swipeWrapper: {
        bottom: 0,
        left: 0,
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 200,
      },
      prev: { left: 4 },
      next: { right: 4 },
      arrow: {
        appearance: "none",
        background: "none",
        border: "none",
        color: themeStyles[theme].text,
        cursor: "pointer",
        fontSize: 52,
        fontWeight: "normal",
        marginTop: -32,
        opacity: 0.35,
        outline: "none",
        padding: "0 10px",
        position: "absolute",
        top: "50%",
      },
      arrowHover: {
        color: themeStyles[theme].text,
      },
      tocBackground: {
        bottom: 0,
        left: 256,
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 1,
      },
      toc: {},
      tocArea: {
        background: theme === "dark" ? "#18181b" : "#f4f4f5",
        bottom: 0,
        left: 0,
        overflowY: "auto",
        padding: "10px 0",
        position: "absolute",
        top: 0,
        width: 256,
        zIndex: 0,
      },
      tocAreaButton: {
        appearance: "none",
        background: "none",
        border: "none",
        borderBottom: "1px solid rgba(113, 113, 122, 0.25)",
        boxSizing: "border-box",
        color: theme === "dark" ? "#e4e4e7" : "#3f3f46",
        cursor: "pointer",
        display: "block",
        fontFamily: "sans-serif",
        fontSize: ".9em",
        outline: "none",
        padding: ".9em 1em",
        textAlign: "left",
        width: "100%",
      },
      tocButton: {
        background: "none",
        border: "none",
        cursor: "pointer",
        height: 32,
        left: 10,
        outline: "none",
        position: "absolute",
        top: 10,
        width: 32,
      },
      tocButtonExpanded: {
        background: theme === "dark" ? "#27272a" : "#f4f4f5",
      },
      tocButtonBar: {
        background: themeStyles[theme].text,
        height: 2,
        left: "50%",
        margin: "-1px -30%",
        position: "absolute",
        top: "50%",
        transition: "all .5s ease",
        width: "60%",
      },
      tocButtonBarTop: { top: "35%" },
      tocButtonBottom: { top: "66%" },
      loadingView: {
        color: themeStyles[theme].text,
        left: "10%",
        marginTop: "-.5em",
        opacity: 0.6,
        position: "absolute",
        right: "10%",
        textAlign: "center",
        top: "50%",
      },
      errorView: {
        color: "#dc2626",
        left: "10%",
        marginTop: "-.5em",
        position: "absolute",
        right: "10%",
        textAlign: "center",
        top: "50%",
      },
    }),
    [theme]
  );

  const updateTheme = (nextTheme: ReaderTheme) => {
    setTheme(nextTheme);
    if (rendition) applyTheme(rendition, nextTheme, fontSize);
  };

  const updateFontSize = (nextFontSize: number) => {
    setFontSize(nextFontSize);
    if (rendition) applyTheme(rendition, theme, nextFontSize);
  };

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
          {(["light", "dark", "sepia"] as ReaderTheme[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => updateTheme(item)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition ${
                theme === item
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateFontSize(Math.max(12, fontSize - 2))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
            title="Decrease font size"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-14 text-center text-sm text-zinc-700 dark:text-zinc-300">
            {fontSize}px
          </span>
          <button
            type="button"
            onClick={() => updateFontSize(Math.min(28, fontSize + 2))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
            title="Increase font size"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="h-[70vh] min-h-[560px] overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <ReactReader
          url={fileUrl}
          title=""
          location={location}
          locationChanged={(nextLocation: string) => setLocation(nextLocation)}
          getRendition={(nextRendition: Rendition) => {
            setRendition(nextRendition);
            applyTheme(nextRendition, theme, fontSize);
          }}
          loadingView={
            <div className="flex h-full items-center justify-center gap-2 text-sm text-zinc-500">
              <BookOpen className="h-4 w-4" />
              Loading book
            </div>
          }
          errorView={
            <div className="flex h-full items-center justify-center text-sm text-red-600">
              Unable to load this EPUB.
            </div>
          }
          readerStyles={readerStyles}
          swipeable
        />
      </div>
    </div>
  );
}
