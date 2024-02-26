import { getSession } from "../../../../lib/auth/utils";
import { PostOutputs } from "../../../../server/api/root";
import { db } from "../../../../server/db";
import AddPostCard from "./AddPostCard";
import PostCard from "./PostCard";
import ChatLink from "./ChatLink";

type Props = {
  params: {
    clubId: string;
  };
};

type GetPostResult = PostOutputs["getPost"];

const page = async ({ params }: Props) => {
  const session = await getSession();

  const posts: GetPostResult[] = await db.post.findMany({
    where: { clubId: Number(params.clubId) },
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

  return (
    <div className="mx-auto mb-20 flex w-full flex-col gap-y-2 md:w-[65%] lg:w-[55%] xl:w-[45%]">
      <ChatLink clubId={params.clubId} />
      <AddPostCard clubId={params.clubId} />

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default page;
