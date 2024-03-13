import BackButton from "../../../components/BackButton";
import { getSession } from "../../../lib/auth/utils";
import { db } from "../../../server/db";
import PostCard from "../club/[clubId]/PostCard";
import RecommendedClubCard from "./RecommendedClubCard";

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
          participants:true
        }
      }
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
      </div>
    </div>
  );
};

export default page;
