import BackButton from "@/components/BackButton";
import { db } from "../../../../../../server/db";
import { getSession } from "@/lib/auth/utils";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import LikeButton from "@/components/LikeButton";
import CommentButton from "@/components/CommentButton";
import { Suspense } from "react";
import AddComment from "./AddComment";
import Comment from "./Comment";
import NewCommentProvider from "./NewCommentProvider";
import Comments from "./Comments";
import { PostComment, PostCommentLike, PostCommentReply } from "@prisma/client";

type Props = {
  params: {
    postid: string;
    clubId: string;
  };
};

const page = async ({ params }: Props) => {
  const session = await getSession();

  const post = await db.post.findFirst({
    where: { id: Number(params.postid) },
    include: {
      user: {
        select: {
          username: true,
          id: true,
          avatarMediaType: true,
          avatarUrl: true,
        },
      },

      likes: { where: { userId: session!.user.id } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!post) notFound();

  return (
    <div>
      <BackButton />
      <h2 className="text-3xl font-semibold">{post.title}</h2>
      <div
        className="tiptap"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(post.description),
        }}
      ></div>
      <div className="flex gap-x-2">
        <LikeButton
          clubId={Number(params.clubId)}
          initialLikeAmount={post._count.likes}
          isInitiallyLiked={post.likes.length > 0}
          postId={Number(params.postid)}
        />
        <CommentButton commentAmount={post._count.comments} />
      </div>
      <div className="flex flex-col gap-y-2">
        <h3 className="mt-4 text-2xl font-medium">
          Komentarze {post._count.comments}
        </h3>
        <h4 className="text-xl">Dodaj komentarz</h4>
        <NewCommentProvider>
          <AddComment
            clubId={Number(params.clubId)}
            postId={Number(params.postid)}
          />

          {post._count.comments > -1 && (
            <Suspense fallback={<p>LOADING</p>}>
              <CommentsLoader
                userId={session!.user.id}
                postId={Number(params.postid)}
              />
            </Suspense>
          )}
        </NewCommentProvider>
      </div>
    </div>
  );
};

export default page;

export type DisplayComment = PostComment & {
  replies: PostCommentReply[];
  _count: {
    likes: number;
  };
  likes: PostCommentLike[];
};

type CommentsProps = {
  postId: number;
  userId: string;
};

const CommentsLoader = async ({ postId, userId }: CommentsProps) => {
  //TODO: Add scroll pagination
  const comments = await db.postComment.findMany({
    where: { postId },
    include: {
      replies: true,

      _count: { select: { likes: true } },
      likes: {
        where: {
          userId,
        },
      },
    },

    orderBy: { createdAt: "desc" },
  });

  return <Comments comments={comments} />;
};
