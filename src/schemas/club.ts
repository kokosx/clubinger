import { z } from "zod";

export const addClubSchema = z.object({
  name: z.string().min(3).max(20),
  musicGenresIds: z.number().array().max(5),
  bookGenresIds: z.number().array().max(5),
});

export const addClubFormSchema = z.object({
  name: z.string().min(3).max(20),
});
