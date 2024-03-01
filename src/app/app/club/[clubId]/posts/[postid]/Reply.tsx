import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PostCommentReply } from "@prisma/client";

type Props = {
  reply: PostCommentReply;
};

const Reply = ({ reply }: Props) => {
  return (
    <Card className=" w-full border-secondary-foreground">
      <CardHeader>{reply.createdBy}</CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <p>{reply.message}</p>
      </CardContent>
    </Card>
  );
};

export default Reply;
