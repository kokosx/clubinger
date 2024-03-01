import { z } from "zod";

export const commentMessage = z.string().min(5).max(2000);

export const createCommentSchema = z.object({
  clubId: z.number(),
  parentId: z.number(),
  message: commentMessage,
});

export const likeComment = z.object({
  id: z.number(),
  clubId: z.number(),
});
