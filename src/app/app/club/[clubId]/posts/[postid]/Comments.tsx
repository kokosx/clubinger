"use client";

import { PostComment, PostCommentLike, PostCommentReply } from "@prisma/client";
import Comment from "./Comment";
import { useContext } from "react";
import { NewCommentContext } from "./NewCommentProvider";
import { DisplayComment } from "./page";

type Props = {
  comments: DisplayComment[];
};

const Comments = ({ comments }: Props) => {
  const ctx = useContext(NewCommentContext);

  return (
    <div className="flex flex-col gap-y-2">
      {ctx.newComments.map((comment) => (
        <Comment
          key={comment.id}
          //@ts-expect-error FIXME: TEMPORARY
          comment={{ ...comment, _count: { likes: 0 }, likes: [], replies: [] }}
        />
      ))}
      {comments.map((comment) => (
        //@ts-expect-error FIXME: TEMPORARY
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default Comments;
