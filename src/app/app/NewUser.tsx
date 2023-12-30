"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../components/ui/drawer";
import { api } from "@/trpc/react";
import GenreChooser from "@/components/GenreChooser";
import { toast } from "sonner";
import { convertToSnakeCase } from "../../lib/format";

const NewUser = () => {
  const [chosenMusicGenres, setChosenMusicGenres] = useState<string[]>([]);
  const [chosenBookGenres, setChosenBookGenres] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const genres = api.genre.getAllGenres.useQuery();
  const replacePreferences = api.user.replacePreferences.useMutation({
    onError: () => {
      toast("Nie udało się zapisać");
    },
  });

  const handleSubmit = () => {
    const chosenMusicGenresIds = genres
      .data!.musicGenres.filter((v) =>
        chosenMusicGenres.includes(convertToSnakeCase(v.name)),
      )
      .map((v) => v.id);
    const chosenBookGenresIds = genres
      .data!.bookGenres.filter((v) =>
        chosenBookGenres.includes(convertToSnakeCase(v.name)),
      )
      .map((v) => v.id);
    replacePreferences.mutate({
      bookGenresIds: chosenBookGenresIds,
      musicGenresIds: chosenMusicGenresIds,
    });
    setDrawerOpen(false);
  };

  const onCloseDrawer = () => {
    window.history.pushState({}, "", "/app");
  };

  return (
    <Drawer open={drawerOpen} onClose={onCloseDrawer}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Dodaj swoje preferencje</DrawerTitle>
            <DrawerDescription>
              Na ich podstawie będą polecane tobie kluby
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4">
            {genres.isLoading ? (
              <>Loading</>
            ) : (
              <>
                <GenreChooser
                  allGenres={genres.data!.musicGenres}
                  chosenGenres={chosenMusicGenres}
                  maxLength={5}
                  setChosenGenres={setChosenMusicGenres}
                  title="Gatunki muzyki"
                />
                <GenreChooser
                  allGenres={genres.data!.bookGenres}
                  chosenGenres={chosenBookGenres}
                  maxLength={5}
                  setChosenGenres={setChosenBookGenres}
                  title="Gatunki książek"
                />
              </>
            )}
          </div>

          <DrawerFooter>
            <Button onClick={handleSubmit}>Zapisz</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NewUser;
