"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserAvatar from "@/components/UserAvatar";
import { useRouter } from "next/navigation";
import CommentButton from "@/components/CommentButton";
import LikeButton from "@/components/LikeButton";
import { PostOutputs } from "@/server/api/root";
import DOMPurify from "isomorphic-dompurify";
import PostActions from "../../../../components/PostActions";

type Props = {
  post: PostOutputs["getPost"];
};

const PostCard = ({ post }: Props) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/app/club/${post.clubId}/posts/${post.id}`)}
      className="hover:cursor-pointer"
    >
      <CardHeader className="py-1 pt-3">
        <div className="flex justify-between">
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
          <PostActions
            isInitiallySaved={post.saved.length > 0}
            postId={post.id}
          />
        </div>

        <CardTitle className="text-3xl">{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="m-0 ">
        <div
          className="tiptap  p-0"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.description),
          }}
        ></div>
        <div className="mt-2 flex items-center gap-x-2 ">
          <LikeButton
            clubId={post.clubId}
            isInitiallyLiked={post.likes.length > 0}
            initialLikeAmount={post._count.likes}
            postId={post.id}
          />
          <CommentButton commentAmount={post._count.comments} />
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
