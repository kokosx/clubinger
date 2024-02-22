import React from "react";
import { Button } from "./ui/button";
import { MessageSquare } from "lucide-react";

type Props = {
  commentAmount: number;
};

const CommentButton = ({ commentAmount }: Props) => {
  return (
    <Button variant={"outline"} className="flex items-center gap-x-2 ">
      <MessageSquare />
      <span>{commentAmount}</span>
    </Button>
  );
};

export default CommentButton;
