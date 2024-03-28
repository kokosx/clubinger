import { z } from "zod";
import { schemaWithPagination } from ".";

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

export const DEFAULT_GET_JOINED_CLUBS_TAKE = 1;

export const getJoinedClubsSchema = schemaWithPagination(
  z.object({}),
  DEFAULT_GET_JOINED_CLUBS_TAKE,
);

export const joinClubSchema = z.object({
  clubId: z.number(),
});

export const favoriteClubSchema = z.object({
  clubId: z.number(),
});

export const getGeneralIdSchema = z.object({
  clubId: z.number(),
});

export const leaveClubSchema = z.object({
  clubId: z.number(),
});

export const deleteClubSchema = z.object({
  clubId: z.number(),
});
