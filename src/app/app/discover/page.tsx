import BackButton from "../../../components/BackButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { getSession } from "../../../lib/auth/utils";
import { db } from "../../../server/db";
import RecommendedClubCard from "./DiscoveryClubCard";

const page = async () => {
  const session = await getSession();

  const [bookGenres, musicGenres] = await Promise.all([
    db.usersLikedBookGenre.findMany({
      where: {
        userId: session!.user.id,
      },
    }),
    db.usersLikedMusicGenre.findMany({
      where: {
        userId: session!.user.id,
      },
    }),
  ]);

  const recommended = await db.club.findMany({
    include: {
      linkedBookGenres: {
        include: {
          bookGenre: true,
        },
      },
      linkedMusicGenres: {
        include: {
          musicGenre: true,
        },
      },
      _count: {
        select: {
          participants: true,
        },
      },
    },
    where: {
      participants: {
        none: {
          userId: session!.user.id,
        },
      },
      linkedBookGenres: {
        some: {
          OR: bookGenres.map((v) => ({ bookGenreId: v.bookGenreId })),
        },
      },
      linkedMusicGenres: {
        some: {
          OR: musicGenres.map((v) => ({ musicGenreId: v.musicGenreId })),
        },
      },
    },
    orderBy: {
      participants: {
        _count: "desc",
      },
    },
  });

  return (
    <div className="flex flex-col gap-y-2">
      <span>
        <BackButton />
      </span>
      <div className="mx-auto mb-20 flex w-full flex-col gap-y-2 md:w-[65%] lg:w-[55%] xl:w-[45%]">
        {recommended.map((club) => (
          <RecommendedClubCard club={club} key={club.id} />
        ))}
        {recommended.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pusto tu!</CardTitle>
            </CardHeader>
            <CardContent>
              Niestety nie ma klubów odpowiadających twoim zainteresowaniom
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default page;
