"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "../../../../trpc/react";
import { ReloadIcon } from "@radix-ui/react-icons";

type Props = {
  clubId: string;
};

const ChatLink = ({ clubId }: Props) => {
  const _getGeneral = api.chat.getGeneralId.useQuery({
    clubId: Number(clubId),
  });

  if (_getGeneral.isLoading) {
    return (
      <Card className="flex h-52 w-full items-center justify-center border-primary">
        <ReloadIcon className="h-12 w-12 animate-spin" />
      </Card>
    );
  }

  return (
    <Link href={`/app/club/${clubId}/chat/${_getGeneral.data?.id}`}>
      <Card className="h-52 w-full border-primary">
        <CardHeader>
          <CardTitle className="flex gap-x-2">
            Chcesz popisać? Wejdź na czat!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-4">
          <Skeleton className="block h-12 w-[35%] animate-none" />
          <Skeleton className="block h-12 w-[40%] animate-none self-end" />
        </CardContent>
      </Card>
    </Link>
  );
};

export default ChatLink;
