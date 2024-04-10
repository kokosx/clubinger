import { Editor, useCurrentEditor } from "@tiptap/react";
import type { Level } from "@tiptap/extension-heading";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  ListIcon,
  QuoteIcon,
  SeparatorHorizontalIcon,
  StrikethroughIcon,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button, buttonVariants } from "./ui/button";

type HeadingAttributes = {
  level: Level;
};

const RichTextEditorMenubar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }
  //   const btnClassName = (node: string, attr?: HeadingAttributes) =>
  //     `btn btn-sm ${editor.isActive(node, attr) ? "btn-primary" : ""}`;

  const btnClassName = (node: string, attr?: HeadingAttributes) =>
    cn(
      buttonVariants({
        variant: editor.isActive(node, attr) ? "secondary" : "outline",
        size: "icon",
      }),
    );

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={btnClassName("bold")}
      >
        <BoldIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={btnClassName("italic")}
      >
        <ItalicIcon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={btnClassName("strike")}
      >
        <StrikethroughIcon />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClassName("heading", { level: 1 })}
      >
        <Heading1Icon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClassName("heading", { level: 2 })}
      >
        <Heading2Icon />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={btnClassName("heading", { level: 3 })}
      >
        <Heading3Icon />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={btnClassName("codeBlock")}
      >
        <CodeIcon />
      </button>

      <Button
        type="button"
        variant={"secondary"}
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <ArrowLeftIcon />
      </Button>
      <Button
        type="button"
        variant={"secondary"}
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <ArrowRightIcon />
      </Button>
    </div>
  );
};

export default RichTextEditorMenubar;
