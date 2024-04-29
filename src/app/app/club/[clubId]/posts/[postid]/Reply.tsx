import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RouterOutputs } from "../../../../../../server/api/root";

type Props = {
  reply: RouterOutputs["comment"]["createReply"];
};

const Reply = ({ reply }: Props) => {
  return (
    <Card className=" w-full border-secondary-foreground">
      <CardHeader>{reply.data.user.username}</CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <p>{reply.data.message}</p>
      </CardContent>
    </Card>
  );
};

export default Reply;
