import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { z } from "zod";
import { updateProfileSchema } from "../../../schemas/user";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  replacePreferences: authenticatedProcedure
    .input(
      z.object({
        musicGenresIds: z.number().array(),
        bookGenresIds: z.number().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await Promise.all([
        ctx.db.usersLikedMusicGenre.deleteMany({
          where: { userId: ctx.user.id },
        }),
        ctx.db.usersLikedBookGenre.deleteMany({
          where: { userId: ctx.user.id },
        }),
      ]);

      await ctx.db.user.update({
        where: { id: ctx.user.id },
        data: {
          likedBookGenres: {
            createMany: {
              data: input.bookGenresIds.map((v) => ({ bookGenreId: v })),
            },
          },
          likedMusicGenres: {
            createMany: {
              data: input.musicGenresIds.map((v) => ({ musicGenreId: v })),
            },
          },
        },
      });
      return { success: true };
    }),
  updateProfile: authenticatedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.user.update({
          where: {
            id: ctx.user.id,
          },
          data: {
            description: input.newDescription,
            avatarUrl: input.newAvatarUrl,
          },
        });
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
});
