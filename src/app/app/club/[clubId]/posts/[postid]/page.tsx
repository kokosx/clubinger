import BackButton from "@/components/BackButton";
import { db } from "../../../../../../server/db";
import { getSession } from "../../../../../../lib/auth/utils";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import LikeButton from "../../../../../../components/LikeButton";
import CommentButton from "../../../../../../components/CommentButton";

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

  const sanitizedDescription = DOMPurify.sanitize(post.description);

  return (
    <div>
      <BackButton />
      <h2 className="text-3xl font-semibold">{post.title}</h2>
      <div
        className="tiptap"
        dangerouslySetInnerHTML={{
          __html: sanitizedDescription,
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
    </div>
  );
};

export default page;
