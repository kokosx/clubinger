"use client";

import React, { MouseEvent, useState } from "react";
import { Button } from "./ui/button";
import { ArrowBigUp } from "lucide-react";
import { api } from "../trpc/react";
import { formatNumber } from "../lib/format";
import { useLike } from "../app/app/club/[clubId]/LikedPostsProvider";
import { useParams } from "next/navigation";

type Props = {
  initialLikeAmount: number;
  isInitiallyLiked: boolean;
  id: number;
  type: "comment" | "reply";
};

const CommentLikeButton = ({
  initialLikeAmount,
  isInitiallyLiked,
  id,
  type,
}: Props) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);

  const params: { clubId: string } = useParams();
  const clubId = Number(params.clubId);

  const handleError = () => {
    setIsDisabled(false);
    setIsLiked((p) => !p);
  };

  const handleSuccess = () => {
    setIsDisabled(false);
  };

  const _likeComment = api.comment.likeComment.useMutation({
    onSuccess: handleSuccess,
    onError: handleError,
  });
  const _unlikeComment = api.comment.unlikeComment.useMutation({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const _likeCommentReply = api.comment.likeCommentReply.useMutation({
    onSuccess: handleSuccess,
    onError: handleError,
  });
  const _unlikeCommentReply = api.comment.unlikeCommentReply.useMutation({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const changeLikeStatus = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    //If its comment handle comments
    if (type === "comment") {
      if (isLiked) {
        setIsDisabled(true);
        _unlikeComment.mutate({ id, clubId });
        setIsLiked(false);
        return;
      }
      setIsDisabled(true);
      _likeComment.mutate({ id, clubId });
      setIsLiked(true);
      return;
    }
    //else replies
    if (isLiked) {
      setIsDisabled(true);
      _unlikeCommentReply.mutate({ id, clubId });
      setIsLiked(false);
      return;
    }
    setIsDisabled(true);
    _likeCommentReply.mutate({ id, clubId });
    setIsLiked(true);
    return;
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

export default CommentLikeButton;
