import React from "react";
import BackButton from "@/components/BackButton";
import { getSession } from "@/lib/auth/utils";
import UserEditForm from "./UserEditForm";
import { db } from "../../../server/db";

const page = async () => {
  const session = await getSession();

  const { description } = await db.user.findFirstOrThrow({
    where: {
      id: session!.user.id,
    },
    select: {
      description: true,
    },
  });

  return (
    <div className="flex flex-col gap-y-2">
      <span>
        <BackButton />
      </span>
      <h2 className="text-4xl font-bold">Witaj {session!.user.username}</h2>
      <UserEditForm description={description} user={session!.user} />
    </div>
  );
};

export default page;
