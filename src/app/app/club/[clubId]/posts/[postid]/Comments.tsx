import { PostComment, PostCommentReply } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../../../../../../components/ui/card";
import UserAvatar from "../../../../../../components/UserAvatar";

type Props = {
  comments: (PostComment & { replies: PostCommentReply[] })[];
};

const Comments = ({ comments }: Props) => {
  return (
    <div className="flex flex-col gap-y-2 ">
      {comments.map((comment) => (
        <Card className="min-h-28 w-full md:max-w-[60%]">
          <CardHeader className="block  w-full justify-center gap-x-2">
            <CardDescription className="flex items-center gap-x-2">
              <span>{comment.createdBy}</span>
              <UserAvatar
                avatarUrl={comment.createdBy}
                mediaType={"DICEBEAR"}
              />
            </CardDescription>
          </CardHeader>
          <CardContent>{comment.message}</CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Comments;
