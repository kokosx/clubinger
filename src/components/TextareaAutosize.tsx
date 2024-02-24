"use client";
import autosize from "autosize";
import { useEffect } from "react";

type Props = {
  handle?: string;
};

const TextareaAutosize = ({ handle }: Props) => {
  useEffect(() => {
    autosize(document.querySelector(handle ?? "textarea")!);
  }, []);
  return null;
};

export default TextareaAutosize;
