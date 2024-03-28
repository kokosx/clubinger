import { getSession } from "@/lib/auth/utils";
import { PostOutputs } from "@/server/api/root";
import { db } from "@/server/db";
import AddPostCard from "./AddPostCard";
import ChatLink from "./ChatLink";
import Posts from "./Posts";
import { DEFAULT_PAGINATION_TAKE } from "@/schemas";

type Props = {
  params: {
    clubId: string;
  };
};

type GetPostResult = PostOutputs["getNewestPosts"]["items"][0];

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
      saved: { where: { savedBy: session!.user.id } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { id: "desc" },
    //Takes one more post to get the next cursor
    take: DEFAULT_PAGINATION_TAKE + 1,
  });

  const nextCursor = posts[5]?.id;
  if (nextCursor) {
    posts.pop();
  }

  return (
    <div className="mx-auto mb-20 flex w-full flex-col gap-y-2 md:w-[65%] lg:w-[55%] xl:w-[45%]">
      <div className="flex w-full gap-x-2">
        <ChatLink clubId={params.clubId} />
        {/* <Link
          className="h-52 w-full"
          href={`/app/club/${params.clubId}/videochat`}
        >
          <Card className=" h-52 w-full  rounded-md border-primary">
            <CardHeader>
              <CardTitle>Chat video</CardTitle>
            </CardHeader>
          </Card>
        </Link> */}
      </div>

      <AddPostCard clubId={params.clubId} />

      <Posts
        initialCursor={nextCursor}
        clubId={Number(params.clubId)}
        initialPosts={posts}
      />
    </div>
  );
};

export default page;
