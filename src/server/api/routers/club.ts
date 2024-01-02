import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { addClubSchema } from "@/schemas/club";
import crypto from "node:crypto";

export const clubRouter = createTRPCRouter({
  createClub: authenticatedProcedure
    .input(addClubSchema)
    .mutation(async ({ ctx, input }) => {
      const club = await ctx.db.club.create({
        data: {
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
            },
          },
          avatarMediaType: "DICEBEAR",
          avatarUrl: crypto.randomBytes(16).toString("hex"),
        },
      });

      return { club };
    }),
});
