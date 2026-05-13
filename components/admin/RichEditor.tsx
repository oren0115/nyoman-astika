"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import {
  TextB,
  TextItalic,
  TextStrikethrough,
  ListBullets,
  ListNumbers,
  TextHTwo,
  TextHThree,
  Quotes,
  Code,
  LinkSimple,
  LinkBreak,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  TextAlignJustify,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "30px"] as const;

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
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      TextStyle,
      FontSize,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
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

  const ed = editor;

  function addLink() {
    const url = window.prompt("Enter URL");
    if (url) {
      ed.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }

  const textStyleAttrs = ed.getAttributes("textStyle");
  const currentFontSize =
    typeof textStyleAttrs.fontSize === "string" ? textStyleAttrs.fontSize : "";
  const fontSizeInPreset = FONT_SIZES.includes(
    currentFontSize as (typeof FONT_SIZES)[number],
  );

  const toolbarActions = [
    {
      icon: TextHTwo,
      label: "Heading 2",
      action: () => ed.chain().focus().toggleHeading({ level: 2 }).run(),
      active: ed.isActive("heading", { level: 2 }),
    },
    {
      icon: TextHThree,
      label: "Heading 3",
      action: () => ed.chain().focus().toggleHeading({ level: 3 }).run(),
      active: ed.isActive("heading", { level: 3 }),
    },
    {
      icon: TextB,
      label: "Bold",
      action: () => ed.chain().focus().toggleBold().run(),
      active: ed.isActive("bold"),
    },
    {
      icon: TextItalic,
      label: "Italic",
      action: () => ed.chain().focus().toggleItalic().run(),
      active: ed.isActive("italic"),
    },
    {
      icon: TextStrikethrough,
      label: "Strike",
      action: () => ed.chain().focus().toggleStrike().run(),
      active: ed.isActive("strike"),
    },
    {
      icon: ListBullets,
      label: "Bullet list",
      action: () => ed.chain().focus().toggleBulletList().run(),
      active: ed.isActive("bulletList"),
    },
    {
      icon: ListNumbers,
      label: "Ordered list",
      action: () => ed.chain().focus().toggleOrderedList().run(),
      active: ed.isActive("orderedList"),
    },
    {
      icon: Quotes,
      label: "Blockquote",
      action: () => ed.chain().focus().toggleBlockquote().run(),
      active: ed.isActive("blockquote"),
    },
    {
      icon: Code,
      label: "Code",
      action: () => ed.chain().focus().toggleCode().run(),
      active: ed.isActive("code"),
    },
    {
      icon: LinkSimple,
      label: "Add link",
      action: addLink,
      active: ed.isActive("link"),
    },
    {
      icon: LinkBreak,
      label: "Remove link",
      action: () => ed.chain().focus().unsetLink().run(),
      active: false,
    },
  ];

  const alignActions = [
    {
      icon: TextAlignLeft,
      label: "Align left",
      align: "left" as const,
    },
    {
      icon: TextAlignCenter,
      label: "Align center",
      align: "center" as const,
    },
    {
      icon: TextAlignRight,
      label: "Align right",
      align: "right" as const,
    },
    {
      icon: TextAlignJustify,
      label: "Justify",
      align: "justify" as const,
    },
  ];

  return (
    <div className={cn("rounded-none border border-border bg-background", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-1.5">
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

        <div className="flex items-center gap-1.5 px-1">
          <Label htmlFor="editor-font-size" className="sr-only">
            Ukuran font
          </Label>
          <select
            id="editor-font-size"
            className="h-7 max-w-[5.5rem] cursor-pointer rounded-none border border-border bg-background px-1.5 text-xs text-foreground"
            value={currentFontSize || ""}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) {
                ed.chain().focus().unsetFontSize().run();
              } else {
                ed.chain().focus().setFontSize(v).run();
              }
            }}
            title="Ukuran font"
          >
            <option value="">Size</option>
            {!fontSizeInPreset && currentFontSize ? (
              <option value={currentFontSize}>{currentFontSize}</option>
            ) : null}
            {FONT_SIZES.map((px) => (
              <option key={px} value={px}>
                {px}
              </option>
            ))}
          </select>
        </div>

        <Separator orientation="vertical" className="mx-1 h-4" />

        {alignActions.map(({ icon: Icon, label, align }) => (
          <Button
            key={align}
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => ed.chain().focus().setTextAlign(align).run()}
            className={cn(ed.isActive({ textAlign: align }) && "bg-muted text-foreground")}
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
          onClick={() => ed.chain().focus().undo().run()}
          disabled={!ed.can().undo()}
        >
          Undo
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={() => ed.chain().focus().redo().run()}
          disabled={!ed.can().redo()}
        >
          Redo
        </Button>
      </div>

      <EditorContent editor={ed} />
    </div>
  );
}
