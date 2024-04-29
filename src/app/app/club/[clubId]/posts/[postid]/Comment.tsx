"use client";

import { PostComment, PostCommentLike, PostCommentReply } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import UserAvatar from "@/components/UserAvatar";
import CommentLikeButton from "@/components/CommentLikeButton";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import AddReply from "./AddReply";
import { useParams } from "next/navigation";
import Reply from "./Reply";
import { ArrowDown, ArrowUp } from "lucide-react";
import { User } from "lucia";

type Props = {
  comment: PostComment & {
    replies: PostCommentReply[];
    _count: {
      likes: number;
    };
    likes: PostCommentLike[];
    user: User;
  };
  user: User;
};

const Comment = ({ comment, user }: Props) => {
  const [isAnswerOpen, setIsAnswerOpen] = useState(false);
  const [newReplies, setNewReplies] = useState<PostCommentReply[]>([]);
  const [repliesShown, setRepliesShown] = useState(false);

  const addNewReply = (newReply: PostCommentReply) => {
    console.log(newReply);
    setNewReplies((p) => [newReply, ...p]);
    setIsAnswerOpen(false);
  };

  const { clubId }: { clubId: string } = useParams();
  return (
    <div className="flex flex-col gap-y-2">
      <div>
        <Card key={comment.id} className="min-h-28 w-full md:max-w-[60%]">
          <CardHeader className="block  w-full justify-center gap-x-2">
            <CardDescription className="flex items-center gap-x-2">
              <span>{comment.user.username}</span>
              <UserAvatar
                avatarUrl={comment.user.avatarUrl}
                mediaType={"DICEBEAR"}
              />
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-2">
            <p>{comment.message}</p>
            <div className="flex gap-x-1">
              <CommentLikeButton
                type="comment"
                initialLikeAmount={comment._count.likes}
                isInitiallyLiked={comment.likes.length > 0}
                id={comment.id}
              />
              <Button
                onClick={() => setIsAnswerOpen((p) => !p)}
                variant={"outline"}
              >
                Odpowiedz
              </Button>
              <Button
                onClick={() => setRepliesShown((p) => !p)}
                variant={repliesShown ? "outline" : "secondary"}
              >
                {repliesShown ? <ArrowUp /> : <ArrowDown />}

                <span>
                  {comment.replies.length + newReplies.length} odpowiedzi
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="ml-8 flex flex-col gap-y-2">
        {isAnswerOpen && (
          <AddReply
            addNewReply={addNewReply}
            clubId={Number(clubId)}
            commentId={comment.id}
          />
        )}

        {repliesShown &&
          //@ts-expect-error FIXME: TEMPORARY
          newReplies.map((r) => <Reply key={r.id} reply={{ data: r }} />)}
        {repliesShown &&
          //@ts-expect-error FIXME: TEMPORARY
          comment.replies.map((r) => <Reply key={r.id} reply={{ data: r }} />)}
      </div>
    </div>
  );
};

export default Comment;
