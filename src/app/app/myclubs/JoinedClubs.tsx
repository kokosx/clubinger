"use client";

import { ClubOutputs } from "@/server/api/root";
import JoinedClubCard from "./JoinedClubCard";
import { api } from "../../../trpc/react";
import { useOnScrollDown } from "../../../lib/hooks/useOnScrollDown";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ErrorToastIcon from "../../../components/ErrorToastIcon";

type Props = {
  initialClubs: ClubOutputs["getJoinedClubs"]["items"];
  initialCursor: number | undefined;
};

const Clubs = ({ initialClubs, initialCursor }: Props) => {
  const [deleted, setDeleted] = useState<number[]>([]);

  const _getJoinedClubs = api.club.getJoinedClubs.useInfiniteQuery(
    {},
    {
      enabled: false,
      initialCursor,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const refetchClubs = () => {
    if (initialCursor) {
      _getJoinedClubs.fetchNextPage();
    }
  };

  const addToDeleted = (id: number) => {
    setDeleted((prev) => [...prev, id]);
  };

  const isDeleted = (id: number) => deleted.includes(id);

  useOnScrollDown(refetchClubs);

  useEffect(() => {
    if (_getJoinedClubs.isError) {
      toast("Coś poszło nie tak", {
        icon: <ErrorToastIcon />,
      });
    }
  }, [_getJoinedClubs.isError]);

  return (
    <>
      {initialClubs.map((club) => (
        <JoinedClubCard addToDeleted={addToDeleted} club={club} key={club.id} />
      ))}
      {_getJoinedClubs.data?.pages.map((page) =>
        page.items.map((club) =>
          isDeleted(club.id) ? null : (
            <JoinedClubCard
              addToDeleted={addToDeleted}
              club={club}
              key={club.id}
            />
          ),
        ),
      )}
    </>
  );
};

export default Clubs;
