"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import RichTextEditorMenubar from "./RichTextEditorMenubar";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import { Dispatch, SetStateAction, useEffect } from "react";

type Props = {
  setValue: Dispatch<SetStateAction<string>>;
};

const RichTextEditor = ({ setValue }: Props) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "prose min-h-[400px] border-2 p-2 rounded-md border-secondary dark:prose-invert prose-sm sm:prose outline-none lg:prose-lg xl:prose-2xl",
      },
    },
    extensions: [
      TextStyle,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
    ],
  });

  editor?.on("update", (e) => {
    setValue(e.editor.getHTML());
  });

  return (
    <div className="space-y-2">
      <RichTextEditorMenubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
