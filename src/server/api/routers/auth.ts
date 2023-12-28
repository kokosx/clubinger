import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { signupSchema, signinSchema } from "@/schemas/user";
import { auth } from "@/lib/auth/auth";
import crypto from "node:crypto";
import { LuciaError } from "lucia";
import { TRPCError } from "@trpc/server";
import * as context from "next/headers";

export const authRouter = createTRPCRouter({
  signup: publicProcedure.input(signupSchema).mutation(async ({ input }) => {
    try {
      // eslint-disable-next-line no-var
      var user = await auth.createUser({
        key: {
          providerId: "username",
          providerUserId: input.username.toLowerCase(),
          password: null,
        },
        attributes: {
          username: input.username,
          email: input.email.toLowerCase(),

          avatarMediaType: "DICEBEAR",
          avatarUrl: crypto.randomBytes(12).toString("hex"),
        },
      });
    } catch (e) {
      if (e instanceof LuciaError) {
        if (e.message == "AUTH_DUPLICATE_KEY_ID") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Nickname został już użyty",
          });
        }
      }
      console.log(e);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
    try {
      await auth.createKey({
        providerId: "email",
        providerUserId: input.email.toLowerCase(),
        userId: user.userId,
        password: input.password,
      });
    } catch (e) {
      if (e instanceof LuciaError) {
        if (e.message == "AUTH_DUPLICATE_KEY_ID") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email został już użyty",
          });
        }
      }
    }

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest("POST", context);

    authRequest.setSession(session);

    return { success: true };
  }),
  signin: publicProcedure.input(signinSchema).mutation(async ({ input }) => {
    try {
      const key = await auth.useKey(
        "email",
        input.email.toLowerCase(),
        input.password,
      );
      const session = await auth.createSession({
        userId: key.userId,
        attributes: {},
      });
      const authRequest = auth.handleRequest("POST", context);
      authRequest.setSession(session);
    } catch (e) {
      if (
        e instanceof LuciaError &&
        (e.message === "AUTH_INVALID_KEY_ID" ||
          e.message === "AUTH_INVALID_PASSWORD")
      ) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }

    return { success: true };
  }),
});
