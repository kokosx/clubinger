import { getSession } from "../../lib/auth/utils";
import { db } from "../../server/db";
import ClubCards from "./ClubCards";
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
    },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="flex flex-col gap-y-2">
      {clubsJoinedRecently.length === 0 ? (
        <p>Dołącz gdzies</p>
      ) : (
        <>
          <h2 className="text-2xl font-semibold">
            Odwiedź swoje ulubione miejsca
          </h2>
          <ClubCards
            areFavorite={true}
            clubs={favoriteClubs.map((v) => v.club)}
          />

          {favoriteClubs.length === 0}
          {/* TODO: Add everytihng into one component that displays clubs dynamically */}
          <h2 className="text-2xl font-semibold">Ostatnio dołączone</h2>
          <ClubCards clubs={clubsJoinedRecently.map((v) => v.club)} />
        </>
      )}

      {isNewUser && <NewUser />}
    </div>
  );
};

export default page;
