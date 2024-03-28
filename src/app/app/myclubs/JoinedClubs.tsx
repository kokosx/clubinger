"use client";

import { ClubOutputs } from "@/server/api/root";
import JoinedClubCard from "./JoinedClubCard";
import { api } from "../../../trpc/react";
import { useOnScrollDown } from "../../../lib/hooks/useOnScrollDown";
import { useEffect } from "react";
import { toast } from "sonner";
import ErrorToastIcon from "../../../components/ErrorToastIcon";

type Props = {
  initialClubs: ClubOutputs["getJoinedClubs"]["items"];
  initialCursor: number | undefined;
};

const Clubs = ({ initialClubs, initialCursor }: Props) => {
  const _getJoinedClubs = api.club.getJoinedClubs.useInfiniteQuery(
    {},
    {
      enabled: false,
      initialData: {
        pages: [{ items: initialClubs, nextCursor: initialCursor }],
        pageParams: [],
      },
      initialCursor,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const refetchClubs = () => {
    if (initialCursor) {
      _getJoinedClubs.fetchNextPage();
    }
  };

  useOnScrollDown(refetchClubs);

  useEffect(() => {
    if (_getJoinedClubs.isError) {
      toast("Coś poszło nie tak", {
        icon: <ErrorToastIcon />,
      });
    }
  }, [_getJoinedClubs.isError]);

  const getRenderItems = () => {
    const toRender: ClubOutputs["getJoinedClubs"]["items"] = [];
    _getJoinedClubs.data?.pages.forEach((v) => {
      v.items.forEach((e) => toRender.push(e));
    });
    return toRender;
  };

  return (
    <>
      {getRenderItems().map((club) => (
        <JoinedClubCard club={club} key={club.id} />
      ))}
    </>
  );
};

export default Clubs;
