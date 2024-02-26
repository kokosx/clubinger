import { z } from "zod";

const clubNameSchema = z.string().min(3).max(20);
const clubNameDescription = z.string().default("");

export const addClubSchema = z.object({
  name: clubNameSchema,
  description: clubNameDescription,
  musicGenresIds: z.number().array().max(5),
  bookGenresIds: z.number().array().max(5),
});

export const addClubFormSchema = z.object({
  name: z.string().min(3).max(20),
  description: clubNameDescription,
});

export const favoriteClubSchema = z.object({
  clubId: z.number(),
});
