import { getPageSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export type AuthSession = {
  session: {
    user: {
      id: string;
      email?: string;
      username?: string;
    };
  } | null;
};
export const getSession = async (method: "GET" | "POST" = "GET") => {
  const session = await getPageSession(method);
  if (!session) return null;

  return session;
};

// export const getUser = async (method: "GET" | "POST" = "GET") => {
//   const session = await getPageSession(method);
//   if (!session) return null;

//   return { ...session.user };
// };

export const checkAuth = async (method: "GET" | "POST" = "GET") => {
  const session = await getPageSession(method);
  if (!session) redirect("/auth/signin");
  return session;
};
