"use client";

import { type Dispatch, type SetStateAction, useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { convertToSnakeCase, toCapitalizedWords } from "@/lib/format";
import { BookGenre } from "@prisma/client";

type Props = {
  genres: BookGenre[];
  chosenGenres: string[];
  setChosenGenres?: Dispatch<SetStateAction<string[]>>;
};

export default function GenreInput({
  genres,
  chosenGenres,
  setChosenGenres,
}: Props) {
  const [open, setOpen] = useState(false);

  const addToChosen = (name: string) => {
    const add = !isSelected(name);

    if (!setChosenGenres) {
      return;
    }
    if (add) {
      setChosenGenres((prev) => [...prev, convertToSnakeCase(name)]);
    } else {
      setChosenGenres((prev) => [
        ...prev.filter((v) => v !== convertToSnakeCase(name)),
      ]);
    }
  };

  const isSelected = (name: string) => {
    return chosenGenres.includes(convertToSnakeCase(name));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          Dodaj
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <div
            onWheel={(e) => {
              e.stopPropagation();
            }}
            className="scroll pointer-events-auto h-72 overflow-y-scroll will-change-scroll"
          >
            <CommandInput placeholder="Wyszukaj" className="h-9" />
            <CommandEmpty>Nie znaleziono</CommandEmpty>

            <CommandGroup className="" onScroll={(e) => e.stopPropagation()}>
              {genres.map((v) => (
                <CommandItem
                  key={v.id}
                  value={v.name}
                  onSelect={(val) => addToChosen(val)}
                >
                  {toCapitalizedWords(v.name)}
                  <CheckIcon
                    className={`mr-2 h-4 w-4 ${
                      isSelected(v.name) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
