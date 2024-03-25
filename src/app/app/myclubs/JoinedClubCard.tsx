"use client";

import { type ClubParticipantType, type Club } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import SuccessToastIcon from "@/components/SuccessToastIcon";
import { revalidatePathAction } from "@/actions/revalidatePathAction";
import { LoadingButton } from "@/components/LoadingButton";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

type Props = {
  club: Club & {
    participants: {
      userType: ClubParticipantType;
    }[];
  };
};

const JoinedClubCard = ({ club }: Props) => {
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const _leaveClub = api.club.leaveClub.useMutation({
    onSuccess() {
      toast("Pomyślnie udało się odejść z klubu", {
        icon: <SuccessToastIcon />,
      });
      revalidatePathAction("/", "layout");
      setIsLeaveDialogOpen(false);
    },
  });

  const handleLeave = () => {
    _leaveClub.mutate({ clubId: club.id });
  };

  const getUserType = () => {
    console.log(club.participants[0]);
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
        <AlertDialog open={isLeaveDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              onClick={() => setIsLeaveDialogOpen(true)}
              variant={"destructive"}
            >
              Odejdź z klubu
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Czy jesteś pewien?</AlertDialogTitle>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsLeaveDialogOpen(false)}>
                Anuluj
              </AlertDialogCancel>

              <LoadingButton
                loading={_leaveClub.isLoading}
                onClick={handleLeave}
                variant={"destructive"}
              >
                Odejdź
              </LoadingButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Link href={`/app/club/${club.id}`} className={cn(buttonVariants())}>
          Przejdź
        </Link>
      </CardContent>
    </Card>
  );
};

export default JoinedClubCard;
