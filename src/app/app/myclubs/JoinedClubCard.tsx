"use client";

import { type ClubParticipantType, type Club } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import SuccessToastIcon from "@/components/SuccessToastIcon";
import { revalidatePathAction } from "@/actions/revalidatePathAction";
import ActionClubButton from "./ActionClubButton";
import ErrorToastIcon from "../../../components/ErrorToastIcon";

type Props = {
  club: Club & {
    participants: {
      userType: ClubParticipantType;
    }[];
  };
  addToDeleted: (id: number) => void;
};

const JoinedClubCard = ({ club, addToDeleted }: Props) => {
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const _leaveClub = api.club.leaveClub.useMutation({
    onSuccess() {
      toast("Pomyślnie udało się odejść z klubu", {
        icon: <SuccessToastIcon />,
      });
      revalidatePathAction("/app", "layout");
      setIsLeaveDialogOpen(false);
      addToDeleted(club.id);
    },
    onError() {
      toast("Coś poszło nie tak!", { icon: <ErrorToastIcon /> });
      setIsLeaveDialogOpen(false);
    },
  });

  const _deleteClub = api.club.deleteClub.useMutation({
    onSuccess() {
      toast("Pomyślnie usunięto klub", {
        icon: <SuccessToastIcon />,
      });
      revalidatePathAction("/app", "layout");
      setIsLeaveDialogOpen(false);
      addToDeleted(club.id);
    },
    onError() {
      toast("Coś poszło nie tak!", { icon: <ErrorToastIcon /> });
      setIsLeaveDialogOpen(false);
    },
  });

  const handleLeave = () => {
    _leaveClub.mutate({ clubId: club.id });
  };

  const handleDelete = () => {
    _deleteClub.mutate({ clubId: club.id });
  };

  const openDialog = () => setIsLeaveDialogOpen(true);
  const closeDialog = () => setIsLeaveDialogOpen(false);

  const getUserType = () => {
    switch (club.participants[0]!.userType) {
      case "ADMIN":
        return "Admin";
      case "MODERATOR":
        return "Moderator";
      default:
        return "Użytkownik";
    }
  };

  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle>{club.name}</CardTitle>
        <span>{getUserType()}</span>
      </CardHeader>
      <CardContent className="flex gap-x-2">
        {club.participants[0]?.userType === "ADMIN" ? (
          <ActionClubButton
            closeDialog={closeDialog}
            isLoading={_deleteClub.isLoading}
            isOpen={isLeaveDialogOpen}
            onAccept={handleDelete}
            openDialog={openDialog}
          >
            Usuń klub
          </ActionClubButton>
        ) : (
          <ActionClubButton
            closeDialog={closeDialog}
            isLoading={_leaveClub.isLoading}
            isOpen={isLeaveDialogOpen}
            onAccept={handleLeave}
            openDialog={openDialog}
          >
            Odejdź z klubu
          </ActionClubButton>
        )}

        <Link href={`/app/club/${club.id}`} className={cn(buttonVariants())}>
          Przejdź
        </Link>
      </CardContent>
    </Card>
  );
};

export default JoinedClubCard;
