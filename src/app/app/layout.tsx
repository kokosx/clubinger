import { type PropsWithChildren } from "react";
import { getSession } from "../../lib/auth/utils";
import { redirect } from "next/navigation";
import Navbar from "./Navbar";
import { db } from "@/server/db";

export const revalidate = true;

type Props = PropsWithChildren & {};

const layout = async ({ children }: Props) => {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  //FIXME: Fix nested result so that it doesnt need to get mapped over
  const attendedClubs = await db.clubParticipant.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { club: true },
  });

  return (
    <div className="container relative mx-auto flex flex-col  p-2 ">
      <Navbar session={session} clubs={attendedClubs.map((v) => v.club)} />
      <main>{children}</main>
    </div>
  );
};

export default layout;
