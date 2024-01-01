"use client";

import { Session } from "lucia";
import Image from "next/image";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Club } from "@prisma/client";
import { CheckIcon, PlusIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CreateClubDialog from "./CreateClubDialog";
import { DrawerTrigger } from "../../components/ui/drawer";

type Props = {
  session: Session;
  clubs: Club[];
};

const Navbar = ({ session, clubs }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<null | number>(null);

  const [newClubOpen, setNewClubOpen] = useState(false);

  return (
    <nav className="flex gap-x-2">
      <Link href="/app">
        <h1 className="hidden text-2xl font-semibold md:block md:text-4xl">
          KultKlub
        </h1>
        <Image
          src="/logo.png"
          alt="logo"
          className="block rounded-lg md:hidden"
          width={50}
          height={50}
        />
      </Link>
      <div className="my-auto">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value
                ? clubs.find((club) => club.id === value)?.name
                : "Select framework..."}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Wyszukaj klub..." className="h-9" />
              <CommandEmpty>Nie znaleziono.</CommandEmpty>

              <CommandGroup>
                {clubs.map((club) => (
                  <CommandItem
                    key={club.id}
                    value={String(club.id)}
                    onSelect={(currentValue) => {
                      setValue(
                        currentValue === String(value)
                          ? null
                          : Number(currentValue),
                      );
                      setOpen(false);
                    }}
                  >
                    {club.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === club.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <CreateClubDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <PlusIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Działania</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href="/app/discover">
                  <DropdownMenuItem>Odkryj kluby</DropdownMenuItem>
                </Link>
                <DrawerTrigger asChild>
                  <DropdownMenuItem onClick={() => setNewClubOpen(true)}>
                    Utwórz klub
                  </DropdownMenuItem>
                </DrawerTrigger>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CreateClubDialog>
      </div>

      <div className="ml-auto flex items-center gap-x-2">
        <UserAvatar
          avatarUrl={session.user.avatarUrl}
          mediaType={session.user.avatarMediaType}
        />
        <p>{session.user.username}</p>
      </div>
    </nav>
  );
};

export default Navbar;
