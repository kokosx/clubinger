"use client";

import { Club } from "@prisma/client";
import ClubCard from "./ClubCard";
import DiscoverCard from "./DiscoverCard";

type Props = {
  lastJoinedClubs: Club[];
  favoriteClubs: Club[];
};

const Clubs = ({ favoriteClubs, lastJoinedClubs }: Props) => {
  return (
    <>
      <h2 className="text-2xl font-semibold">Odwiedź swoje ulubione miejsca</h2>
      <div className="flex flex-col items-center gap-y-2">
        {favoriteClubs.map((club) => (
          <ClubCard isFavorite={true} club={club} key={club.id} />
        ))}
      </div>
      <h2 className="text-2xl font-semibold">Ostatnio dołączone</h2>
      <div className="flex flex-col items-center gap-y-2">
        {lastJoinedClubs.map((club) => (
          <ClubCard isFavorite={false} club={club} key={club.id} />
        ))}
      </div>
      <>
        {favoriteClubs.length === 0}
        {/* TODO: Add everytihng into one component that displays clubs dynamically */}
      </>
      <DiscoverCard />
    </>
  );
};

export default Clubs;
