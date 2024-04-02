"use client";

import { PostOutputs } from "@/server/api/root";
import PostCard from "./PostCard";
import { api } from "@/trpc/react";
import { useEffect } from "react";
import { toast } from "sonner";
import ErrorToastIcon from "@/components/ErrorToastIcon";
import { useOnScrollDown } from "@/lib/hooks/useOnScrollDown";
import LoadingPostCard from "../../../../components/LoadingPostCard";

type Props = {
  initialPosts: PostOutputs["getNewestPosts"]["items"];
  clubId: number;
  initialCursor: number | undefined;
};

const Posts = ({ initialPosts, clubId, initialCursor }: Props) => {
  const _getNewestPosts = api.post.getNewestPosts.useInfiniteQuery(
    { clubId },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor,
      enabled: false,
      initialData: {
        pageParams: [],
        pages: [
          {
            items: initialPosts,
            nextCursor: initialCursor,
          },
        ],
      },
    },
  );

  useEffect(() => {
    if (_getNewestPosts.isError) {
      toast("Coś poszło nie tak", {
        icon: <ErrorToastIcon />,
      });
    }
  }, [_getNewestPosts.isError]);

  const refetchNewestPosts = () => {
    if (initialCursor) {
      _getNewestPosts.fetchNextPage();
    }
  };

  //FIXME: scrolling is not working after page reload
  useOnScrollDown(refetchNewestPosts);

  const renderFetchedPosts = () => {
    const posts: PostOutputs["getNewestPosts"]["items"] = [];
    _getNewestPosts.data?.pages.forEach((page, i) => {
      page.items.forEach((post) => {
        posts.push(post);
      });
    });
    return posts;
  };

  return (
    <div className="flex flex-col gap-y-2">
      {renderFetchedPosts().map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <LoadingPostCard loading={_getNewestPosts.isFetching} />
    </div>
  );
};

export default Posts;
