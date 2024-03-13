"use client";

import { Club } from "@prisma/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import ClubAvatar from "../../components/ClubAvatar";
import ClubStarButton from "../../components/ClubStarButton";
import Link from "next/link";

type Props = {
  club: Club;
  isFavorite: boolean;
};

const ClubCard = ({ club, isFavorite = false }: Props) => {
  return (
    <Link href={`/app/club/${club.id}`} prefetch={false}>
      <Card className="w-[300px] md:w-[600px]">
        <CardHeader>
          <div className="flex w-full items-center gap-x-1">
            <CardTitle>{club.name}</CardTitle>
            <ClubAvatar size={40} avatarUrl={club.avatarUrl} />
            <div className="ml-auto">
              <ClubStarButton clubId={club.id} isInitialFavorite={isFavorite} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-wrap break-words">{club.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ClubCard;
