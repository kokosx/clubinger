"use client";

import { RouterOutputs } from "@/trpc/shared";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import SuccessToastIcon from "@/components/SuccessToastIcon";
import { useState } from "react";
import ErrorToastIcon from "../../../components/ErrorToastIcon";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { revalidatePathAction } from "@/actions/revalidatePathAction";

type Props = {
  club: RouterOutputs["club"]["getRecommendedClubs"][0];
};

const RecommendedClubCard = ({ club }: Props) => {
  const [didJoin, setDidJoin] = useState(false);

  const _joinClub = api.club.joinClub.useMutation({
    async onSuccess() {
      toast("Dołączono pomyślnie!", { icon: <SuccessToastIcon /> });
      setDidJoin(true);
      revalidatePathAction("/app", "layout");
    },
    onError() {
      toast("Wystąpił błąd", { icon: <ErrorToastIcon /> });
    },
  });

  const joinClub = () => {
    _joinClub.mutate({ clubId: club.id });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{club.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="max-w-full break-words  ">{club.description}</p>
      </CardContent>
      <CardFooter>
        <span>{club._count.participants} członków</span>
        {didJoin ? (
          <Link
            className={cn(buttonVariants(), "ml-auto")}
            href={`/app/club/${club.id}`}
          >
            Przejdź
          </Link>
        ) : (
          <Button
            disabled={_joinClub.isLoading || didJoin}
            onClick={joinClub}
            className="ml-auto"
          >
            Dołącz
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default RecommendedClubCard;
