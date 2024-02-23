import React from "react";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";
import { formatNumber } from "../lib/format";

type Props = {
  commentAmount: number;
};

const CommentButton = ({ commentAmount }: Props) => {
  return (
    <Button variant={"outline"} className="flex items-center gap-x-2 ">
      <MessageSquare />
      <span>{formatNumber(commentAmount)}</span>
    </Button>
  );
};

export default CommentButton;
