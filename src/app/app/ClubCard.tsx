"use client";

import { Club } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import ClubAvatar from "../../components/ClubAvatar";

type Props = {
  club: Club;
};

const ClubCard = ({ club }: Props) => {
  return (
    <Card className="w-[300px] md:w-[600px]">
      <CardHeader>
        <div className="flex w-full items-center gap-x-1">
          <CardTitle>{club.name}</CardTitle>
          <ClubAvatar size={40} avatarUrl={club.avatarUrl} />
        </div>
      </CardHeader>
      <CardContent>
        <p>{club.description}</p>
      </CardContent>
    </Card>
  );
};

export default ClubCard;
