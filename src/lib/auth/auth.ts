import { lucia } from "lucia";
import { prisma } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { env } from "../../env";
import { nextjs_future } from "lucia/middleware";
import * as context from "next/headers";
import { cache } from "react";

const client = new PrismaClient();

// default values
const auth = lucia({
  adapter: prisma(client, {
    user: "user", // model User {}
    key: "key", // model Key {}
    session: "session", // model Session {}
  }),
  env: env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  sessionCookie: { expires: false },
  getUserAttributes: (data) => {
    return data;
  },
});

export type Auth = typeof auth;

export const getPageSession = cache((method: "GET" | "POST" = "GET") => {
  const authRequest = auth.handleRequest(method, context);
  return authRequest.validate();
});
