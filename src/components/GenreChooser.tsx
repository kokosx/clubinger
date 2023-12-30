import { type Dispatch, type SetStateAction } from "react";
import GenreInput from "./GenreInput";
import { type MusicGenre } from "@prisma/client";
import { GenreTag, GenreTags } from "@/components/GenreTags";
import { toCapitalizedWords } from "@/lib/format";

type Props = {
  title: string;
  chosenGenres: string[];
  maxLength: 5;
  setChosenGenres: Dispatch<SetStateAction<string[]>>;
  allGenres: MusicGenre[];
};

const GenreChooser = ({
  title,
  chosenGenres,
  maxLength = 5,
  setChosenGenres,
  allGenres,
}: Props) => {
  return (
    <div className="space-y-1.5">
      <h3 className="text-lg">{title}</h3>
      <p>
        {chosenGenres.length}/{maxLength}
      </p>
      <GenreInput
        chosenGenres={chosenGenres}
        setChosenGenres={
          chosenGenres.length > maxLength - 1 ? undefined : setChosenGenres
        }
        genres={allGenres}
      />
      <GenreTags>
        {chosenGenres.map((name) => (
          <GenreTag
            key={name}
            withDelete={() =>
              setChosenGenres((prev) => prev.filter((oid) => oid !== name))
            }
          >
            {toCapitalizedWords(name)}
          </GenreTag>
        ))}
      </GenreTags>
    </div>
  );
};

export default GenreChooser;
