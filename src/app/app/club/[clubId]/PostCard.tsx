"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { type User, type Post } from "@prisma/client";
import Link from "next/link";
import UserAvatar from "../../../../components/UserAvatar";
import { useRouter } from "next/navigation";

type Props = {
  post: Post & {
    user: Omit<User, "email">;
  };
};

const PostCard = ({ post }: Props) => {
  const router = useRouter();
  return (
    <Card className="hover:cursor-pointer">
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
      <CardContent className="m-0">
        <div
          className="tiptap p-0"
          dangerouslySetInnerHTML={{ __html: post.description }}
        ></div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
