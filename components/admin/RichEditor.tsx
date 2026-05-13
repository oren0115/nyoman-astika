"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  TextB,
  TextItalic,
  TextStrikethrough,
  ListBullets,
  ListNumbers,
  TextHOne,
  TextHTwo,
  Quotes,
  Code,
  LinkSimple,
  LinkBreak,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichEditor({
  value,
  onChange,
  placeholder = "Write something…",
  className,
}: RichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] w-full px-3 py-2 text-sm text-foreground focus:outline-none [&>p]:mb-2 [&>h2]:mb-2 [&>h2]:text-base [&>h2]:font-semibold [&>h3]:mb-2 [&>h3]:text-sm [&>h3]:font-semibold [&>ul]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4 [&>blockquote]:border-l-2 [&>blockquote]:border-primary [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:text-muted-foreground [&>pre]:rounded-none [&>pre]:bg-muted [&>pre]:p-3 [&>pre]:text-xs [&>code]:bg-muted [&>code]:px-1 [&>code]:text-xs",
      },
    },
  });

  if (!editor) {
    return (
      <div
        className={cn(
          "rounded-none border border-border bg-muted/30 px-3 py-8 text-center text-xs text-muted-foreground",
          className,
        )}
        aria-busy
      >
        Memuat editor…
      </div>
    );
  }

  function addLink() {
    const url = window.prompt("Enter URL");
    if (url) {
      editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }

  const toolbarActions = [
    {
      icon: TextHOne,
      label: "H2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: TextHTwo,
      label: "H3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: TextB,
      label: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
    },
    {
      icon: TextItalic,
      label: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
    },
    {
      icon: TextStrikethrough,
      label: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
    },
    {
      icon: ListBullets,
      label: "Bullet list",
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
    },
    {
      icon: ListNumbers,
      label: "Ordered list",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
    },
    {
      icon: Quotes,
      label: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
    },
    {
      icon: Code,
      label: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      active: editor.isActive("code"),
    },
    {
      icon: LinkSimple,
      label: "Add link",
      action: addLink,
      active: editor.isActive("link"),
    },
    {
      icon: LinkBreak,
      label: "Remove link",
      action: () => editor.chain().focus().unsetLink().run(),
      active: false,
    },
  ];

  return (
    <div className={cn("rounded-none border border-border bg-background", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-1.5">
        {toolbarActions.map(({ icon: Icon, label, action, active }, i) => (
          <Button
            key={i}
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={action}
            className={cn(active && "bg-muted text-foreground")}
            aria-label={label}
            title={label}
          >
            <Icon />
          </Button>
        ))}
        <Separator orientation="vertical" className="mx-1 h-4" />
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          Undo
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          Redo
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
