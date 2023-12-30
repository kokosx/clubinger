import { createTRPCRouter, publicProcedure } from "../trpc";

export const genresRouter = createTRPCRouter({
  getAllGenres: publicProcedure.query(async ({ ctx }) => {
    const [musicGenres, bookGenres] = await Promise.all([
      ctx.db.musicGenre.findMany(),
      ctx.db.bookGenre.findMany(),
    ]);
    return { musicGenres, bookGenres };
  }),
});
