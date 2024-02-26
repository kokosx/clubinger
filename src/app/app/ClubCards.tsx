"use client";

import { Club } from "@prisma/client";
import ClubCard from "./ClubCard";

type Props = {
  clubs: Club[];
  areFavorite?: boolean;
};

const ClubCards = ({ clubs, areFavorite = false }: Props) => {
  return (
    <div className="flex flex-col items-center gap-y-2">
      {clubs.map((club) => (
        <ClubCard isFavorite={areFavorite} club={club} key={club.id} />
      ))}
    </div>
  );
};

export default ClubCards;
