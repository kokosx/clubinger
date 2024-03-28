import {
  attendingUserProcedure,
  authenticatedProcedure,
  createTRPCRouter,
} from "@/server/api/trpc";
import {
  addClubSchema,
  favoriteClubSchema,
  joinClubSchema,
  leaveClubSchema,
} from "@/schemas/club";
import crypto from "node:crypto";
import { TRPCError } from "@trpc/server";
import { simpleSearchSchema } from "@/schemas/search";

export const clubRouter = createTRPCRouter({
  search: authenticatedProcedure
    .input(simpleSearchSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.db.club.findMany({
        where: {
          name: {
            contains: input.value,
          },
        },

        include: {
          participants: {
            where: {
              userId: ctx.user.id,
            },
            select: { clubId: true },
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },

        orderBy: {
          participants: {
            _count: "desc",
          },
        },
      });
    }),

  leaveClub: authenticatedProcedure
    .input(leaveClubSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.clubParticipant.deleteMany({
        where: {
          clubId: input.clubId,
          userId: ctx.user.id,
        },
      });
      return {};
    }),

  deleteClub: attendingUserProcedure
    .input(leaveClubSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.club.delete({
          where: {
            id: input.clubId,
          },
        });
        return {};
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
  joinClub: authenticatedProcedure
    .input(joinClubSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.clubParticipant.create({
        data: {
          userId: ctx.user.id,
          clubId: input.clubId,
        },
      });
      return {};
    }),
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
      //Create default chat room
      await ctx.db.chatRoom.create({
        data: {
          name: "General",
          clubId: club.id,
          createdBy: ctx.user.id,
          isGeneral: true,
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
  getRecommendedClubs: authenticatedProcedure.query(async ({ ctx }) => {
    const [bookGenres, musicGenres] = await Promise.all([
      ctx.db.usersLikedBookGenre.findMany({
        where: {
          userId: ctx.user.id,
        },
      }),
      ctx.db.usersLikedMusicGenre.findMany({
        where: {
          userId: ctx.user.id,
        },
      }),
    ]);

    return await ctx.db.club.findMany({
      include: {
        linkedBookGenres: {
          include: {
            bookGenre: true,
          },
        },
        linkedMusicGenres: {
          include: {
            musicGenre: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
      where: {
        participants: {
          none: {
            userId: ctx.user.id,
          },
        },
        linkedBookGenres: {
          some: {
            OR: bookGenres.map((v) => ({ bookGenreId: v.bookGenreId })),
          },
        },
        linkedMusicGenres: {
          some: {
            OR: musicGenres.map((v) => ({ musicGenreId: v.musicGenreId })),
          },
        },
      },
      orderBy: {
        participants: {
          _count: "desc",
        },
      },
    });
  }),
});
