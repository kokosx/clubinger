import { z } from "zod";
import { schemaWithPagination } from ".";

export const MAX_DESCRIPTION_LENGTH = 3000;
export const DEFAULT_GET_USERS_POSTS_TAKE = 10;
const OVER_3MB_IN_CHARS = 4000000;

export const addPostSchema = z.object({
  title: z.string().min(5).max(30),
  description: z.string().max(MAX_DESCRIPTION_LENGTH).default(""),
  image: z.string().max(OVER_3MB_IN_CHARS).optional(),
  clubId: z.number(),
});

export const getUsersPostsSchema = schemaWithPagination(
  z.object({ userId: z.string() }),
  DEFAULT_GET_USERS_POSTS_TAKE,
);

export const getNewestPostsSchema = schemaWithPagination(
  z.object({
    clubId: z.number(),
  }),
);

export const likePostSchema = z.object({
  postId: z.number(),
  clubId: z.number(),
});

export const getPostSchema = z.object({
  clubId: z.number(),
  postId: z.number(),
});

export const savePostSchema = z.object({
  clubId: z.number(),
  postId: z.number(),
});
