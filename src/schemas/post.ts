import { z } from "zod";

export const MAX_DESCRIPTION_LENGTH = 3000;

export const addPostSchema = z.object({
  title: z.string().min(5).max(30),
  description: z.string().max(MAX_DESCRIPTION_LENGTH).default(""),
  clubId: z.number(),
});

export const likePostSchema = z.object({
  postId: z.number(),
  clubId: z.number(),
});

export const getPostSchema = z.object({
  clubId: z.number(),
  postId: z.number(),
});
