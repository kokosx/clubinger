import {
  attendingUserProcedure,
  authenticatedProcedure,
  createTRPCRouter,
} from "@/server/api/trpc";
import { addClubSchema, favoriteClubSchema } from "@/schemas/club";
import crypto from "node:crypto";
import { TRPCError } from "@trpc/server";

export const clubRouter = createTRPCRouter({
  createClub: authenticatedProcedure
    .input(addClubSchema)
    .mutation(async ({ ctx, input }) => {
      const club = await ctx.db.club.create({
        data: {
          description: input.description,
          name: input.name,
          linkedBookGenres: {
            createMany: {
              data: input.bookGenresIds.map((v) => ({ bookGenreId: v })),
            },
          },
          linkedMusicGenres: {
            createMany: {
              data: input.musicGenresIds.map((v) => ({ musicGenreId: v })),
            },
          },
          createdBy: ctx.user.id,
          participants: {
            create: {
              userId: ctx.user.id,
              userType: "ADMIN",
            },
          },
          avatarMediaType: "DICEBEAR",
          avatarUrl: crypto.randomBytes(16).toString("hex"),
        },
      });

      return { club };
    }),
  makeFavorite: attendingUserProcedure
    .input(favoriteClubSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.favoriteClub.createMany({
          data: {
            clubId: input.clubId,
            userId: ctx.user.id,
          },
        });
        return {};
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
  makeNotFavorite: attendingUserProcedure
    .input(favoriteClubSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.favoriteClub.deleteMany({
          where: {
            clubId: input.clubId,
            userId: ctx.user.id,
          },
        });
        return {};
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
});
