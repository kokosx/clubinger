import { createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { genresRouter } from "./routers/genres";
import { userRouter } from "./routers/user";
import { clubRouter } from "./routers/club";
import { postRouter } from "./routers/post";
import { createCallerFactory, inferRouterOutputs } from "@trpc/server";
import { commentRouter } from "./routers/comment";
import { chatRouter } from "./routers/chat";
import { db } from "../db";
import { createContext } from "../../trpc/server";

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
  comment: commentRouter,
  chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type PostOutputs = RouterOutputs["post"];

const createCaller = createCallerFactory();
export const serverCaller = createCaller(appRouter)(await createContext());
