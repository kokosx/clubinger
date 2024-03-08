import { ReactNode, type PropsWithChildren } from "react";
import LikedPostsProvider from "./LikedPostsProvider";
import { db } from "../../../../server/db";
import { getSession } from "../../../../lib/auth/utils";
import { redirect } from "next/navigation";

type Props = {
  params: {
    clubId: string;
  };
  children: ReactNode;
};

const layout = async ({ children, params }: Props) => {
  const session = await getSession();

  //Authorization
  const attends = await db.clubParticipant.findFirst({
    where: {
      clubId: Number(params.clubId),
      userId: session!.user.id,
    },
  });
  console.log(attends);
  if (!attends) redirect("/app");

  return <LikedPostsProvider>{children}</LikedPostsProvider>;
};

export default layout;
