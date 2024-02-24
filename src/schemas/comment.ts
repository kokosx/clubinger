import { z } from "zod";

export const message = z.string().min(5).max(2000);

export const createCommentSchema = z.object({
  clubId: z.number(),
  postId: z.number(),
  message,
});
