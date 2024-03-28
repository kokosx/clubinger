import { z } from "zod";

export const MAX_DESCRIPTION_LENGTH = 3000;
const OVER_3MB_IN_CHARS = 4000000;

export const addPostSchema = z.object({
  title: z.string().min(5).max(30),
  description: z.string().max(MAX_DESCRIPTION_LENGTH).default(""),
  image: z.string().max(OVER_3MB_IN_CHARS).optional(),
  clubId: z.number(),
});

export const getNewestPostsSchema = z.object({
  clubId: z.number(),
  cursor: z.number().nullish(),
  limit: z.number().default(5),
});

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
