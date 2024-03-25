import React from "react";
import BackButton from "../../../components/BackButton";
import { db } from "../../../server/db";
import { getSession } from "../../../lib/auth/utils";
import JoinedClubCard from "./JoinedClubCard";

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
  });

  return (
    <div className="flex flex-col gap-y-2">
      <span>
        <BackButton />
      </span>
      {clubs.map((club) => (
        <JoinedClubCard club={club} key={club.id} />
      ))}
    </div>
  );
};

export default page;
