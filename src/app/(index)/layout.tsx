import { getSession } from "@/lib/auth/utils";
import { redirect } from "next/navigation";

//Any type because typescript throws an error with ReactNode
const layout = async ({ children }: { children: any }) => {
  const session = await getSession();
  if (session) redirect("/app");

  return children;
};

export default layout;
