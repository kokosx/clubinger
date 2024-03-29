"use client";

import { PostOutputs } from "@/server/api/root";
import PostCard from "../../club/[clubId]/PostCard";
import { api } from "@/trpc/react";
import { useOnScrollDown } from "../../../../lib/hooks/useOnScrollDown";

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

  const getRenderItems = () => {
    const toRender: PostOutputs["getUsersPosts"]["items"] = [];
    _getUsersPosts.data?.pages.forEach((page) => {
      page.items.forEach((item) => {
        toRender.push(item);
      });
    });
    return toRender;
  };

  return (
    <>
      {getRenderItems().map((post) => (
        <PostCard post={post} />
      ))}
    </>
  );
};

export default UsersPosts;
