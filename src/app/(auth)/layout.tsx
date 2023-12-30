import type { PropsWithChildren, ReactNode } from "react";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/utils";
import Image from "next/image";

const AuthLayout = async ({ children }: PropsWithChildren) => {
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
              KultKlub
            </h2>

            <p className="mt-3 max-w-xl text-gray-300">
              Dołącz do klubów odpowiadających twoim zainteresowaniom
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-screen w-full max-w-md items-center px-6 lg:w-2/6">
        <div className="flex-1">
          <div className="flex w-full flex-col items-center justify-center gap-y-2">
            <Image
              src="/logo.png"
              alt="logo"
              height={100}
              width={100}
              className="rounded-lg"
            />
            <h2 className="text-4xl font-semibold">Witaj!</h2>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
