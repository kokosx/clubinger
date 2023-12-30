import Image from "next/image";
import Link from "next/link";
import { type PropsWithChildren } from "react";
import { getSession } from "../../lib/auth/utils";
import { redirect } from "next/navigation";
import UserAvatar from "../../components/UserAvatar";

type Props = PropsWithChildren & {};

const layout = async ({ children }: Props) => {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  return (
    <div className="container mx-auto p-2">
      <nav className="flex">
        <Link href="/app">
          <h1 className="hidden text-2xl font-semibold md:block md:text-4xl">
            KultKlub
          </h1>
          <Image
            src="/logo.png"
            alt="logo"
            className="block rounded-lg md:hidden"
            width={50}
            height={50}
          />
        </Link>
        <div className="ml-auto flex items-center gap-x-2">
          <UserAvatar
            avatarUrl={session.user.avatarUrl}
            mediaType={session.user.avatarMediaType}
          />
          <p>{session.user.username}</p>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default layout;
