import { LucideProps, StarIcon } from "lucide-react";
import { MouseEvent, useState } from "react";
import { api } from "../trpc/react";

type Props = LucideProps & {
  clubId: number;
  isInitialFavorite: boolean;
};

const ClubStarButton = ({
  clubId,
  isInitialFavorite,
  className,
  ...props
}: Props) => {
  const [isFavorite, setIsFavorite] = useState(isInitialFavorite);
  const _makeFavorite = api.club.makeFavorite.useMutation();
  const _makeNotFavorite = api.club.makeNotFavorite.useMutation();

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isFavorite) {
      _makeNotFavorite.mutate({ clubId });
      setIsFavorite(false);
      return;
    }
    _makeFavorite.mutate({ clubId });
    setIsFavorite(true);
  };

  return (
    <button
      disabled={_makeFavorite.isLoading || _makeNotFavorite.isLoading}
      onClick={handleClick}
    >
      <StarIcon
        {...props}
        className={`cursor-pointer ${className} ${
          isFavorite && "fill-amber-500"
        }`}
      />
    </button>
  );
};

export default ClubStarButton;
