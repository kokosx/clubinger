"use client";

import { Club } from "@prisma/client";
import ClubCard from "./ClubCard";

type Props = {
  clubs: Club[];
};

const ClubCards = ({ clubs }: Props) => {
  return (
    <div className="flex flex-col items-center gap-y-2">
      {clubs.map((club) => (
        <ClubCard club={club} key={club.id} />
      ))}
    </div>
  );
};

export default ClubCards;
