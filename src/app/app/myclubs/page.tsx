import React from "react";
import BackButton from "../../../components/BackButton";
import { db } from "../../../server/db";
import { getSession } from "../../../lib/auth/utils";
import { DEFAULT_GET_JOINED_CLUBS_TAKE } from "@/schemas/club";
import Clubs from "./JoinedClubs";

const page = async () => {
  const session = await getSession();

  const clubs = await db.club.findMany({
    where: {
      participants: {
        some: {
          userId: session!.user.id,
        },
      },
    },
    include: {
      participants: {
        select: {
          userType: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
    take: DEFAULT_GET_JOINED_CLUBS_TAKE + 1,
  });

  const nextCursor = clubs[DEFAULT_GET_JOINED_CLUBS_TAKE]?.id;
  if (nextCursor) {
    clubs.pop();
  }
  return (
    <div className="flex flex-col gap-y-2">
      <span>
        <BackButton />
      </span>
      <Clubs initialCursor={nextCursor} initialClubs={clubs} />
    </div>
  );
};

export default page;
