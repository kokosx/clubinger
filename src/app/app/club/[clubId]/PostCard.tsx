"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { type User, type Post, PostLike } from "@prisma/client";
import UserAvatar from "../../../../components/UserAvatar";
import { useRouter } from "next/navigation";
import CommentButton from "../../../../components/CommentButton";
import Link from "next/link";
import LikeButton from "../../../../components/LikeButton";

type Props = {
  post: Post & {
    user: Omit<User, "email">;
    likes: PostLike[];
  } & {
    _count: {
      likes: number;
    };
  };
  clubId: number;
};

const PostCard = ({ post, clubId }: Props) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/app/club/${clubId}/posts/${post.id}`)}
      className="hover:cursor-pointer"
    >
      <CardHeader className="py-1 pt-3">
        <CardDescription>
          Utworzone przez{" "}
          <button
            className="text-primary underline"
            onMouseEnter={() => {
              router.prefetch(`/app/users/${post.user.id}`);
            }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/app/users/${post.user.id}`);
            }}
          >
            {post.user.username}
            <UserAvatar
              className="inline"
              avatarUrl={post.user.avatarUrl}
              mediaType={post.user.avatarMediaType}
            />
          </button>
        </CardDescription>
        <CardTitle className=" text-3xl">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="m-0 ">
        <div
          className="tiptap p-0"
          dangerouslySetInnerHTML={{ __html: post.description }}
        ></div>
        <div className="mt-2 flex items-center gap-x-2 ">
          <LikeButton
            clubId={clubId}
            isInitiallyLiked={post.likes.length > 0}
            initialLikeAmount={post._count.likes}
            postId={post.id}
          />
          <CommentButton commentAmount={0} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
