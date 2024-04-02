import { db } from "@/server/db";
import { getSession } from "../../../lib/auth/utils";
import BackButton from "@/components/BackButton";
import { DEFAULT_GET_MY_POSTS_TAKE } from "@/schemas/post";
import MyPosts from "./MyPosts";

const page = async () => {
  const session = await getSession();
  const posts = await db.post.findMany({
    where: {
      createdBy: session!.user.id,
    },
    include: {
      likes: { where: { userId: session!.user.id } },
      _count: { select: { likes: true, comments: true } },
      saved: true,
      user: {
        select: {
          username: true,
          id: true,
          avatarMediaType: true,
          avatarUrl: true,
        },
      },
    },
    take: DEFAULT_GET_MY_POSTS_TAKE + 1,
    orderBy: { id: "desc" },
  });

  let initialCursor = undefined;

  if (posts[DEFAULT_GET_MY_POSTS_TAKE]) {
    initialCursor = posts[DEFAULT_GET_MY_POSTS_TAKE].id;
    posts.pop();
  }

  return (
    <div className="flex flex-col gap-y-2">
      <span>
        <BackButton />
      </span>

      <h2 className="text-3xl font-semibold">Twoje posty</h2>
      <MyPosts posts={posts} initialCursor={initialCursor} />
    </div>
  );
};

export default page;
