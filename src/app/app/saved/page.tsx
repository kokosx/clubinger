import { db } from "@/server/db";
import { getSession } from "../../../lib/auth/utils";
import BackButton from "@/components/BackButton";
import { DEFAULT_GET_SAVED_POSTS_TAKE } from "../../../schemas/post";
import SavedPosts from "./SavedPosts";

const page = async () => {
  const session = await getSession();
  const savedPosts = await db.savedPost.findMany({
    where: {
      savedBy: session!.user.id,
    },
    include: {
      post: {
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
          saved: { where: { savedBy: session!.user.id } },
          _count: { select: { likes: true, comments: true } },
        },
      },
    },
    take: DEFAULT_GET_SAVED_POSTS_TAKE + 1,
    orderBy: { id: "desc" },
  });

  let nextCursor = undefined;

  if (savedPosts[DEFAULT_GET_SAVED_POSTS_TAKE]) {
    savedPosts.pop();
    nextCursor = DEFAULT_GET_SAVED_POSTS_TAKE;
  }

  return (
    <div className="flex flex-col gap-y-2">
      <span>
        <BackButton />
      </span>

      <h2 className="text-3xl font-semibold">Twoje zapisane posty</h2>
      <SavedPosts
        posts={savedPosts.map((v) => v.post)}
        initialCursor={nextCursor}
      />
    </div>
  );
};

export default page;
