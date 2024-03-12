import { ReactNode } from "react";
import BackButton from "@/components/BackButton";
import { getSession } from "@/lib/auth/utils";
import { db } from "@/server/db";
import { Separator } from "@/components/ui/separator";
import Rooms from "./Rooms";
import CreateNewChatRoom from "./CreateRoom";

type Props = {
  params: {
    clubId: string;
    roomId: string | null;
  };
  children: ReactNode;
};

const layout = async ({ params, children }: Props) => {
  const session = await getSession();

  const [rooms, participant] = await Promise.all([
    db.chatRoom.findMany({
      where: {
        clubId: Number(params.clubId),
      },
      orderBy: {
        id: "asc",
      },
    }),
    db.clubParticipant.findFirst({
      where: {
        userId: session!.user.id,
      },
    }),
  ]);
  return (
    <div className="flex h-full min-h-full flex-col gap-y-2">
      <span>
        <BackButton />
      </span>

      <div className="flex h-[calc(100vh-140px)] gap-x-2 ">
        <div className="flex w-1/6 flex-col gap-y-2">
          <Rooms
            clubId={params.clubId}
            rooms={rooms}
            initialRoom={Number(params.roomId)}
          />
          <CreateNewChatRoom isSuperuser={participant!.userType !== "USER"} />
        </div>
        <Separator orientation="vertical" className="h-full" />
        <div className="mt-auto w-2/3">{children}</div>
      </div>
    </div>
  );
};

export default layout;
