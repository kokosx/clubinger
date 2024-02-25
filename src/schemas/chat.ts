import { z } from "zod";

export const chatMessageSchema = z.string().min(1);

export const sendClubMessageSchema = z.object({
  clubId: z.number(),
  message: chatMessageSchema,
});
