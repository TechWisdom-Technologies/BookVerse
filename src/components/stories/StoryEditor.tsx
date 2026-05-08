"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  ImageIcon,
  Minus,
  Undo,
  Redo,
  Save,
  Loader2,
  Check,
} from "lucide-react";

interface StoryEditorProps {
  chapterId: string;
  storyId: string;
  initialContent: unknown;
  onSave: (content: unknown) => Promise<void>;
}

type SaveStatus = "idle" | "saving" | "saved" | "unsaved" | "error";

export default function StoryEditor({
  chapterId,
  storyId,
  initialContent,
  onSave,
}: StoryEditorProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContentRef = useRef<string>("");
  const isMountedRef = useRef(true);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: "Start writing your chapter...",
      }),
      Underline,
    ],
    content: initialContent || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-zinc dark:prose-invert max-w-none min-h-[400px] focus:outline-none px-4 py-3 text-[15px] leading-relaxed",
      },
    },
    onUpdate: () => {
      setSaveStatus("unsaved");
    },
  });

  // Store initial content fingerprint
  useEffect(() => {
    if (initialContent) {
      lastSavedContentRef.current = JSON.stringify(initialContent);
    }
  }, [initialContent]);

  // Cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Save function
  const handleSave = useCallback(async () => {
    if (!editor) return;

    const json = editor.getJSON();
    const jsonString = JSON.stringify(json);

    // Skip if content hasn't changed
    if (jsonString === lastSavedContentRef.current) {
      setSaveStatus("saved");
      return;
    }

    setSaveStatus("saving");
    try {
      await onSave(json);
      lastSavedContentRef.current = jsonString;
      if (isMountedRef.current) {
        setSaveStatus("saved");
      }
    } catch (error) {
      console.error("Failed to save chapter:", error);
      if (isMountedRef.current) {
        setSaveStatus("error");
      }
    }
  }, [editor, onSave]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (saveStatus !== "unsaved") return;

    autoSaveTimerRef.current = setTimeout(() => {
      handleSave();
    }, 30000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [saveStatus, handleSave]);

  // Ctrl+S / Cmd+S keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  // Reset editor content when chapter changes
  useEffect(() => {
    if (editor && initialContent !== undefined) {
      editor.commands.setContent(initialContent || "");
      lastSavedContentRef.current = JSON.stringify(initialContent);
      setSaveStatus("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId, editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-200 px-2 py-1.5 dark:border-zinc-800">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={addImage} title="Insert Image">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>

        {/* Save button + status */}
        <div className="ml-auto flex items-center gap-2">
          <SaveIndicator status={saveStatus} />
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            title="Save (Ctrl+S)"
          >
            {saveStatus === "saving" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="min-h-[500px] [&_.ProseMirror]:min-h-[500px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-zinc-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:dark:text-zinc-600 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
      />
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded-md p-1.5 transition-colors ${
        active
          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return (
    <div className="mx-1 h-5 w-px bg-zinc-200 dark:bg-zinc-700" />
  );
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  switch (status) {
    case "saving":
      return (
        <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
          <Loader2 className="h-3 w-3 animate-spin" />
          Saving…
        </span>
      );
    case "saved":
      return (
        <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
          <Check className="h-3 w-3" />
          Saved
        </span>
      );
    case "unsaved":
      return (
        <span className="text-xs text-amber-600 dark:text-amber-400">
          Unsaved changes
        </span>
      );
    case "error":
      return (
        <span className="text-xs text-red-600 dark:text-red-400">
          Save failed
        </span>
      );
    default:
      return null;
  }
}
