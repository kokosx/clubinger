import ChatBox from "./ChatBox";

import { db } from "@/server/db";
import { getSession } from "@/lib/auth/utils";
import { NewClubMessage } from "@/lib/pusher/client";
import { DEFAULT_GET_CHAT_MESSAGES_TAKE } from "../../../../../../schemas/chat";

type Props = {
  params: {
    clubId: string;
    roomId: string | null;
  };
};

const page = async ({ params }: Props) => {
  const session = await getSession();

  const messages: NewClubMessage[] = await db.chatMessage.findMany({
    where: {
      roomId: Number(params.roomId),
    },
    orderBy: {
      id: "desc",
    },
    take: DEFAULT_GET_CHAT_MESSAGES_TAKE + 1,
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

  const initialCursor = messages[DEFAULT_GET_CHAT_MESSAGES_TAKE]?.id;
  if (initialCursor) {
    messages.pop();
  }

  return (
    <ChatBox
      initialCursor={initialCursor}
      initialMessages={messages}
      roomId={Number(params.roomId)}
      user={session!.user}
      clubId={Number(params.clubId)}
    />
  );
};

export default page;
