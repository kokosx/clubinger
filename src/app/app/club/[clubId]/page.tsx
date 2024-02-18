import { db } from "../../../../server/db";
import AddPostCard from "./AddPostCard";
import PostCard from "./PostCard";

type Props = {
  params: {
    clubId: string;
  };
};

const page = async ({ params }: Props) => {
  const posts = await db.post.findMany({
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
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto  flex w-full flex-col gap-y-2 md:w-[65%] lg:w-[55%] xl:w-[45%]">
      <AddPostCard clubId={params.clubId} />

      {posts.map((post) => (
        <PostCard post={post} />
      ))}
    </div>
  );
};

export default page;
