"use client";

import { PostOutputs } from "@/server/api/root";
import PostCard from "../../club/[clubId]/PostCard";
import { api } from "@/trpc/react";
import { useOnScrollDown } from "@/lib/hooks/useOnScrollDown";
import LoadingPostCard from "@/components/LoadingPostCard";
import { useEffect } from "react";
import { toast } from "sonner";
import ErrorToastIcon from "@/components/ErrorToastIcon";

type Props = {
  initialPosts: PostOutputs["getUsersPosts"]["items"];
  initialCursor?: number;
  userId: string;
};

const UsersPosts = ({ initialPosts, userId, initialCursor }: Props) => {
  const _getUsersPosts = api.post.getUsersPosts.useInfiniteQuery(
    { userId },
    {
      enabled: false,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: {
        pages: [{ items: initialPosts, nextCursor: initialCursor }],
        pageParams: [],
      },
      initialCursor,
    },
  );

  const refetchPosts = () => {
    if (initialCursor) {
      _getUsersPosts.fetchNextPage();
    }
  };

  useOnScrollDown(refetchPosts);

  useEffect(() => {
    if (_getUsersPosts.isError) {
      toast("Wystąpił błąd", {
        icon: <ErrorToastIcon />,
      });
    }
  }, [_getUsersPosts.isError]);

  return (
    <>
      {_getUsersPosts.data?.pages.map((page) =>
        page.items.map((post) => <PostCard key={post.id} post={post} />),
      )}
      <LoadingPostCard loading={_getUsersPosts.isFetching} />
    </>
  );
};

export default UsersPosts;
