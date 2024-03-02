"use client";

import { Club } from "@prisma/client";
import ClubCard from "./ClubCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Link from "next/link";

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
      <Link href={"/app/discover"}>
        <Card className="mx-auto w-[300px] border-primary md:w-[600px] ">
          <CardHeader>
            <div className="flex w-full items-center gap-x-1">
              <CardTitle>Odkryj nowe kluby</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p>Odkryj nowych ludzi i hobby</p>
          </CardContent>
        </Card>
      </Link>
    </>
  );
};

export default Clubs;
