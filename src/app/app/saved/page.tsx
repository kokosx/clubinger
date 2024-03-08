import { db } from "@/server/db";
import { getSession } from "../../../lib/auth/utils";
import PostCard from "../club/[clubId]/PostCard";
import BackButton from "../../../components/BackButton";

const page = async () => {
  const session = await getSession();
  const savedPosts = await db.post.findMany({
    where: {
      saved: {
        some: {
          savedBy: session!.user.id,
        },
      },
    },
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
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="flex flex-col gap-y-2">
      <span>
        <BackButton />
      </span>

      <h2 className="text-3xl font-semibold">Twoje zapisane posty</h2>
      {savedPosts.map((post) => (
        <PostCard post={post} />
      ))}
    </div>
  );
};

export default page;
