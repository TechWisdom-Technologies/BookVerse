"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { ExtractTextFeature } from "./ExtractTextFeature";
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
  Type,
  Terminal,
  Activity
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
        placeholder: "Start writing your story...",
      }),
      Underline,
    ],
    content: initialContent || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-zinc dark:prose-invert max-w-none min-h-[600px] focus:outline-none px-12 py-16 text-[15px] leading-relaxed font-serif selection:bg-zinc-100 dark:selection:bg-zinc-800",
      },
    },
    onUpdate: () => {
      setSaveStatus("unsaved");
    },
  });

  useEffect(() => {
    if (initialContent) {
      lastSavedContentRef.current = JSON.stringify(initialContent);
    }
  }, [initialContent]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const handleSave = useCallback(async () => {
    if (!editor) return;
    const json = editor.getJSON();
    const jsonString = JSON.stringify(json);
    if (jsonString === lastSavedContentRef.current) {
      setSaveStatus("saved");
      return;
    }
    setSaveStatus("saving");
    try {
      await onSave(json);
      lastSavedContentRef.current = jsonString;
      if (isMountedRef.current) { setSaveStatus("saved"); }
    } catch (error) {
      console.error("Save Error:", error);
      if (isMountedRef.current) { setSaveStatus("error"); }
    }
  }, [editor, onSave]);

  useEffect(() => {
    if (saveStatus !== "unsaved") return;
    autoSaveTimerRef.current = setTimeout(() => { handleSave(); }, 30000);
    return () => { if (autoSaveTimerRef.current) { clearTimeout(autoSaveTimerRef.current); } };
  }, [saveStatus, handleSave]);

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

  useEffect(() => {
    if (editor && initialContent !== undefined) {
      editor.commands.setContent(initialContent || "");
      lastSavedContentRef.current = JSON.stringify(initialContent);
      setSaveStatus("idle");
    }
  }, [chapterId, editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (url && editor) { editor.chain().focus().setImage({ src: url }).run(); }
  }, [editor]);

  if (!editor) return (
    <div className="flex items-center justify-center py-40">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
    </div>
  );

  return (
    <div className="flex flex-col border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden min-h-[800px]">
      
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-zinc-50 dark:border-zinc-900 px-4 py-3 bg-zinc-50/50 dark:bg-zinc-900/10">
        <div className="flex items-center gap-1 px-2 border-r border-zinc-100 dark:border-zinc-800">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
            <Bold className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
            <Italic className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
            <UnderlineIcon className="w-3.5 h-3.5" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-zinc-100 dark:border-zinc-800">
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
            <Heading1 className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
            <Heading2 className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
            <Heading3 className="w-3.5 h-3.5" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-zinc-100 dark:border-zinc-800">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
            <List className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List">
            <ListOrdered className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">
            <Quote className="w-3.5 h-3.5" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-1 px-2 border-r border-zinc-100 dark:border-zinc-800">
          <ToolbarButton onClick={addImage} title="Add Image">
            <ImageIcon className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Line Break">
            <Minus className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ExtractTextFeature onExtracted={(text) => editor.chain().focus().insertContent(text).run()} />
        </div>

        <div className="flex items-center gap-1 px-2">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
            <Undo className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
            <Redo className="w-3.5 h-3.5" />
          </ToolbarButton>
        </div>

        {/* Save Status */}
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded">
            <SaveIndicator status={saveStatus} />
          </div>
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="px-6 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center gap-2"
          >
            {saveStatus === "saving" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            Save
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto bg-zinc-50/5 dark:bg-zinc-950/5">
        <EditorContent editor={editor} />
      </div>

      {/* Footer */}
      <div className="px-6 py-2 border-t border-zinc-50 dark:border-zinc-900 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-zinc-300">
          Ready to write
        </div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">
          Auto-save active
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({ onClick, active, disabled, title, children }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded transition-all ${
        active
          ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm"
          : "text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
      } ${disabled ? "opacity-20 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  switch (status) {
    case "saving":
      return <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Saving...</span>;
    case "saved":
      return <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Saved</span>;
    case "unsaved":
      return <span className="text-[9px] font-bold uppercase tracking-widest text-amber-500">Unsaved</span>;
    case "error":
      return <span className="text-[9px] font-bold uppercase tracking-widest text-rose-500">Error</span>;
    default:
      return <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">Ready</span>;
  }
}
