"use client";

import { PostOutputs } from "@/server/api/root";
import PostCard from "./PostCard";
import { api } from "../../../../trpc/react";
import { useEffect } from "react";
import { toast } from "sonner";
import ErrorToastIcon from "../../../../components/ErrorToastIcon";
import { Card } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";

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

  const handleScroll = () => {
    const threshold = 0;

    const bottom =
      document.documentElement.offsetHeight -
        (document.documentElement.scrollTop + threshold) ===
      document.documentElement.clientHeight;

    if (bottom) {
      refetchNewestPosts();
    }
  };
  //FIXME: scrolling is not working after page reload
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
      {initialPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {renderFetchedPosts().map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {_getNewestPosts.isLoading ? (
        <Card className="flex  h-48 w-full items-center justify-center">
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        </Card>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Posts;
