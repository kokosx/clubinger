"use client";

import React, { MouseEvent, useState } from "react";
import { Button } from "./ui/button";
import { ArrowBigUp } from "lucide-react";
import { api } from "../trpc/react";
import { formatNumber } from "../lib/format";

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
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [isDisabled, setIsDisabled] = useState(false);

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
      setIsLiked(false);

      return;
    }
    setIsDisabled(true);
    _likePost.mutate({ postId, clubId });

    setIsLiked(true);
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
      <span>{formatNumber(getLikeAmount())}</span>
    </Button>
  );
};

export default LikeButton;
