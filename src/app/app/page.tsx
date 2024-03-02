import { getSession } from "../../lib/auth/utils";
import { db } from "../../server/db";
import Clubs from "./Clubs";
import NewUser from "./NewUser";

type Props = {
  searchParams: {
    newuser?: string;
  };
};

const page = async ({ searchParams }: Props) => {
  const isNewUser = searchParams?.newuser === "true";

  const session = await getSession();

  const favoriteClubs = await db.clubParticipant.findMany({
    include: {
      club: true,
    },
    where: {
      userId: session!.user.id,
      club: {
        favoriteOf: {
          some: {
            userId: session!.user.id,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const clubsJoinedRecently = await db.clubParticipant.findMany({
    include: {
      club: true,
    },
    where: {
      userId: session!.user.id,
      NOT: {
        club: {
          favoriteOf: {
            some: {
              userId: session!.user.id,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="flex flex-col gap-y-2">
      {clubsJoinedRecently.length === 0 && favoriteClubs.length === 0 ? (
        <p>Dołącz gdzies</p>
      ) : (
        <Clubs
          favoriteClubs={favoriteClubs.map((v) => v.club)}
          lastJoinedClubs={clubsJoinedRecently.map((v) => v.club)}
        />
      )}

      {isNewUser && <NewUser />}
    </div>
  );
};

export default page;
