import { z } from "zod";

export const sendClubMessageSchema = z.object({
  clubId: z.number(),
  message: z.string().min(1),
});
