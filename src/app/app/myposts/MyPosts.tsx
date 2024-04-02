"use client";

import LoadingPostCard from "../../../components/LoadingPostCard";
import { useOnScrollDown } from "../../../lib/hooks/useOnScrollDown";
import { PostOutputs } from "../../../server/api/root";
import { api } from "../../../trpc/react";
import PostCard from "../club/[clubId]/PostCard";

type Props = {
  posts: PostOutputs["getMyPosts"]["items"];
  initialCursor?: number;
};

const MyPosts = ({ initialCursor, posts }: Props) => {
  const _getMyPosts = api.post.getMyPosts.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor,
      initialData: {
        pageParams: [],
        pages: [{ items: posts, nextCursor: initialCursor }],
      },
    },
  );

  const getNextPage = () => {
    if (initialCursor) {
      _getMyPosts.fetchNextPage();
    }
  };

  useOnScrollDown(getNextPage);

  return (
    <>
      {_getMyPosts.data?.pages.map((page) => (
        <>
          {page.items.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </>
      ))}
      <LoadingPostCard loading={_getMyPosts.isFetching} />
    </>
  );
};

export default MyPosts;
