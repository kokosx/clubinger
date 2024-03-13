import { Club } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { api } from "../../../trpc/react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import SuccessToastIcon from "@/components/SuccessToastIcon";
import ErrorToastIcon from "@/components/ErrorToastIcon";
import Link from "next/link";
import { Button, buttonVariants } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";
import { RouterOutputs } from "../../../trpc/shared";

type Props = {
  club: RouterOutputs["club"]["search"][0];
};

const ClubSearchCard = ({ club }: Props) => {
  const [didJoin, setDidJoin] = useState(club.participants.length > 0);

  const { clubId }: { clubId: string } = useParams();

  const _joinClub = api.club.joinClub.useMutation({
    async onSuccess() {
      toast("Dołączono pomyślnie!", { icon: <SuccessToastIcon /> });
      setDidJoin(true);
    },
    onError() {
      toast("Wystąpił błąd", { icon: <ErrorToastIcon /> });
    },
  });

  const joinClub = () => {
    _joinClub.mutate({ clubId: Number(clubId) });
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

export default ClubSearchCard;
