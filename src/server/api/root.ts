import { createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { genresRouter } from "./routers/genres";
import { userRouter } from "./routers/user";
import { clubRouter } from "./routers/club";
import { postRouter } from "./routers/post";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  genre: genresRouter,
  user: userRouter,
  club: clubRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
