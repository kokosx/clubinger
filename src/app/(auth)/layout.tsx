import type { ReactNode } from "react";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/utils";

type Props = {
  children: ReactNode;
};

const AuthLayout = async ({ children }: Props) => {
  const session = await getSession();

  if (session) redirect("/app");

  return (
    <div className="flex h-screen justify-center">
      <div
        className="hidden bg-cover lg:block lg:w-2/3"
        style={{ backgroundImage: "url(/people.jpg)" }}
      >
        <div className="flex h-full items-center bg-gray-900 bg-opacity-40 px-20">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Meraki UI
            </h2>

            <p className="mt-3 max-w-xl text-gray-300">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. In autem
              ipsa, nulla laboriosam dolores, repellendus perferendis libero
              suscipit nam temporibus molestiae
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-md items-center px-6 lg:w-2/6">
        <div className="flex-1">
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
