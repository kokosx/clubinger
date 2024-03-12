import ChatBox from "./ChatBox";

import { db } from "@/server/db";
import { getSession } from "@/lib/auth/utils";

type Props = {
  params: {
    clubId: string;
    roomId: string | null;
  };
};

const page = async ({ params }: Props) => {
  const session = await getSession();

  const messages = await db.chatMessage.findMany({
    where: {
      roomId: Number(params.roomId),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    select: {
      id: true,
      message: true,
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          avatarMediaType: true,
        },
      },
    },
  });

  return (
    <ChatBox
      initialMessages={messages}
      roomId={Number(params.roomId)}
      user={session!.user}
      clubId={Number(params.clubId)}
    />
  );
};

export default page;
