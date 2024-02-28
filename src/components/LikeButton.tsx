"use client";

import React, { MouseEvent, useState } from "react";
import { Button } from "./ui/button";
import { ArrowBigUp } from "lucide-react";
import { api } from "../trpc/react";
import { formatNumber } from "../lib/format";
import { useLike } from "../app/app/club/[clubId]/LikedPostsProvider";

type Props = {
  initialLikeAmount: number;
  isInitiallyLiked: boolean;
  postId: number;
  clubId: number;
};

const LikeButton = ({
  initialLikeAmount,
  isInitiallyLiked,
  postId,
  clubId,
}: Props) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const { addLike, deleteLike, isLiked, likeCount } = useLike(
    postId,
    isInitiallyLiked,
    initialLikeAmount,
  );

  const _likePost = api.post.likePost.useMutation({
    onMutate: () => {
      setIsDisabled(false);
    },
  });
  const _unlikePost = api.post.unlikePost.useMutation({
    onMutate: () => {
      setIsDisabled(false);
    },
  });

  const changeLikeStatus = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isLiked) {
      setIsDisabled(true);
      _unlikePost.mutate({ postId, clubId });
      deleteLike();

      return;
    }
    setIsDisabled(true);
    _likePost.mutate({ postId, clubId });
    addLike();
  };

  const getLikeAmount = () => {
    if (isLiked && isInitiallyLiked) {
      return initialLikeAmount;
    }
    if (!isLiked && isInitiallyLiked) {
      return initialLikeAmount - 1;
    }
    if (!isInitiallyLiked && !isLiked) {
      return initialLikeAmount;
    }
    return initialLikeAmount + 1;
  };

  return (
    <Button
      onClick={changeLikeStatus}
      disabled={isDisabled}
      variant={isLiked ? "default" : "outline"}
      className="w-16"
    >
      <ArrowBigUp />
      <span>{formatNumber(likeCount)}</span>
    </Button>
  );
};

export default LikeButton;
