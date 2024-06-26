/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError, z } from "zod";

import { db } from "@/server/db";
import { cookies } from "next/headers";
import { auth } from "../../lib/auth/auth";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;
const middleware = t.middleware;

const isAuthenticated = middleware(async (opts) => {
  const sessionId = cookies().get("__session")?.value;
  if (!sessionId) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  const s = await auth.validateSession(sessionId);

  if (!s) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return opts.next({ ctx: { user: s.user } });
});

const authorizeClubAttendee = isAuthenticated.unstable_pipe(async (opts) => {
  const { clubId }: { clubId: number } = opts.rawInput as unknown as any;

  const validated = await z.number().safeParseAsync(clubId);
  if (!validated.success) {
    console.log(validated.error);
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Club id not provided",
    });
  }

  const a = await opts.ctx.db.clubParticipant.findFirst({
    where: {
      clubId: clubId,
      userId: opts.ctx.user.id,
    },
  });

  if (!a) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Club id is wrong" });
  }

  return opts.next({ ctx: { clubId: a.clubId } });
});

export const authenticatedProcedure = publicProcedure.use(isAuthenticated);
export const attendingUserProcedure = authenticatedProcedure.use(
  authorizeClubAttendee,
);

type SendPaginationProps<T> = {
  items: T &
    {
      id: number;
    }[];
  cursor?: number | null;
  limit: number;
};

export const sendPagination = <T>({
  items,
  cursor,
  limit,
}: SendPaginationProps<T>) => {
  let nextCursor: typeof cursor | undefined = undefined;
  if (items.length > limit) {
    const nextItem = items.pop();
    nextCursor = nextItem!.id;
  }
  return {
    items,
    nextCursor,
  };
};
