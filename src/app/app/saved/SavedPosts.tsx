"use client";

import { PostOutputs } from "@/server/api/root";
import { api } from "@/trpc/react";
import PostCard from "../club/[clubId]/PostCard";
import LoadingPostCard from "@/components/LoadingPostCard";
import { useOnScrollDown } from "@/lib/hooks/useOnScrollDown";

type Props = {
  posts: PostOutputs["getSavedPosts"]["items"];
  initialCursor?: number;
};

const SavedPosts = ({ initialCursor, posts }: Props) => {
  const _getSavedPosts = api.post.getSavedPosts.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: {
        pages: [
          {
            nextCursor: posts.length + 1,
            items: posts,
          },
        ],
        pageParams: [],
      },
    },
  );

  const fetchNextPage = () => {
    if (initialCursor) {
      _getSavedPosts.fetchNextPage();
    }
  };

  useOnScrollDown(fetchNextPage);

  return (
    <>
      {_getSavedPosts.data?.pages.map((page) => (
        <>
          {page.items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </>
      ))}
      <LoadingPostCard loading={_getSavedPosts.isFetching} />
    </>
  );
};

export default SavedPosts;
