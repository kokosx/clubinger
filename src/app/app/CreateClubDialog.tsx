import { useState, ReactNode, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import GenreChooser from "@/components/GenreChooser";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Loading from "@/components/Loading";
import InputField from "@/components/InputField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/InputError";
import { useForm } from "react-hook-form";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addClubFormSchema } from "@/schemas/club";
import { convertToSnakeCase } from "@/lib/format";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingButton } from "@/components/LoadingButton";
import { toast } from "sonner";
import { Textarea } from "../../components/ui/textarea";

type Props = {
  children: ReactNode;
  visible: boolean;
};

const CreateClubDialog = ({ children, visible }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<typeof addClubFormSchema._output>({
    resolver: zodResolver(addClubFormSchema),
  });
  const router = useRouter();
  const genres = api.genre.getAllGenres.useQuery(undefined, { enabled: false });
  const [error, setError] = useState<false | string>(false);

  useEffect(() => {
    if (visible) genres.refetch();
  }, [visible]);

  const createClub = api.club.createClub.useMutation({
    onError(error) {
      setError("Wystąpił nieznany błąd " + error.data?.code);
    },
    onSuccess({ club }) {
      toast("Utworzono klub!");
      //@ts-expect-error Close the drawer after navigation
      document.querySelector("#drawer-close")!.click();
      router.push(`/app/club/${club.id}?justCreated=true`);
    },
  });

  const [chosenBookGenres, setChosenBookGenres] = useState<string[]>([]);
  const [chosenMusicGenres, setChosenMusicGenres] = useState<string[]>([]);

  const onSubmit = handleSubmit(({ name, description }) => {
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

    createClub.mutate({
      name,
      description,
      bookGenresIds: chosenBookGenresIds,
      musicGenresIds: chosenMusicGenresIds,
    });
  });

  return (
    <Drawer
      onOpenChange={() => {
        reset();
        setChosenBookGenres([]);
        setChosenMusicGenres([]);
      }}
    >
      {children}
      <DrawerContent>
        <div className="my-8px mx-auto w-full  max-w-sm overflow-y-scroll">
          <DrawerHeader>
            <DrawerTitle>Utwórz nowy klub</DrawerTitle>
            <DrawerDescription>Spraw by był ciekawy! 🎉️🎉️ </DrawerDescription>
          </DrawerHeader>

          <div className="px-4">
            <InputField>
              <Label className="text-xl">Nazwa klubu</Label>
              <Input {...register("name")} />
              <InputError error={errors.name?.message} />
            </InputField>
            <InputField>
              <Label className="text-xl">Opis</Label>
              <Textarea {...register("description")} />
              <InputError error={errors.name?.message} />
            </InputField>
            {genres.isLoading ? (
              <div className="flex w-full items-center justify-center">
                <Loading className="h-12 w-12" />
              </div>
            ) : (
              <>
                <GenreChooser
                  allGenres={genres.data!.musicGenres}
                  chosenGenres={chosenMusicGenres}
                  maxLength={5}
                  setChosenGenres={setChosenMusicGenres}
                  title="Gatunki muzyki 🎶️"
                />
                <GenreChooser
                  allGenres={genres.data!.bookGenres}
                  chosenGenres={chosenBookGenres}
                  maxLength={5}
                  setChosenGenres={setChosenBookGenres}
                  title="Gatunki książek 📘️"
                />
              </>
            )}
          </div>
          <InputError error={error} />

          <DrawerFooter>
            <LoadingButton loading={createClub.isLoading} onClick={onSubmit}>
              Utwórz
            </LoadingButton>
            <DrawerClose
              id="drawer-close"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Zamknij
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateClubDialog;
