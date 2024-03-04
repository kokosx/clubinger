import { notFound } from "next/navigation";
import { getSession } from "../../../../lib/auth/utils";
import { db } from "../../../../server/db";
import UserAvatar from "../../../../components/UserAvatar";
import { Card, CardHeader, CardTitle } from "../../../../components/ui/card";
import PostCard from "../../club/[clubId]/PostCard";
import { LockIcon } from "lucide-react";
import { Separator } from "../../../../components/ui/separator";

type Props = {
  params: {
    userId: string;
  };
};

const page = async ({ params }: Props) => {
  const session = await getSession();

  //TODO: Add pagination
  const user = await db.user.findFirst({
    where: {
      id: params.userId,
    },
    include: {
      createdPosts: {
        where: {
          club: {
            participants: {
              some: {
                userId: session!.user.id,
              },
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
          _count: { select: { likes: true, comments: true } },
        },
      },
    },
  });
  if (!user) notFound();
  return (
    <div className="flex flex-col gap-x-4 gap-y-2 lg:flex-row">
      <div className="relative w-full lg:w-1/3">
        <UserAvatar
          avatarUrl={user.avatarUrl}
          mediaType={user.avatarMediaType}
          size={100}
          className="absolute ml-8 mt-0 rounded-full border-2 border-primary bg-background p-2"
        />
        <Card className="mt-12">
          <CardHeader className="mt-8">
            <CardTitle>{user.username}</CardTitle>
            <p>{user.description}</p>
          </CardHeader>
        </Card>
      </div>
      <div className="flex w-full flex-col gap-y-2">
        <div className="flex items-center justify-center gap-x-1">
          <Separator className="w-0 md:w-24" />
          <div className="flex min-w-fit flex-wrap justify-center gap-x-1 text-center">
            <span className="text-muted-foreground">
              Widzisz tylko posty z klubów, do których obydwoje należycie
            </span>

            <LockIcon className="text-muted-foreground" />
          </div>
          <Separator className="w-0 md:w-24" />
        </div>
        {user.createdPosts.map((post) => (
          <PostCard post={post} />
        ))}
      </div>
    </div>
  );
};

export default page;
