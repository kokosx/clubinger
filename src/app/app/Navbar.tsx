"use client";

import { Session } from "lucia";
import Image from "next/image";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, buttonVariants } from "../../components/ui/button";
import { Club } from "@prisma/client";
import { CheckIcon, ChevronDownIcon, LogOutIcon, PlusIcon } from "lucide-react";
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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ClubAvatar from "@/components/ClubAvatar";
import { api } from "../../trpc/react";
import { toast } from "sonner";
import SuccessToastIcon from "../../components/SuccessToastIcon";

type Props = {
  session: Session;
  clubs: Club[];
};

const Navbar = ({ session, clubs }: Props) => {
  const [isNewClubVisible, setIsNewClubVisible] = useState(false);
  const params = useParams<{ clubId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const _logout = api.auth.logout.useMutation({
    onSuccess: () => {
      toast("Pomyślnie wylogowano", {
        icon: <SuccessToastIcon />,
      });
      router.push("/");
    },
  });

  const getCurrentClubName = () => {
    if (!params.clubId) {
      return "Ekran główny";
    }
    let foundClub: Club | null = null;
    for (let v of clubs) {
      if (v.id === Number(params.clubId)) {
        foundClub = v;
        break;
      }
    }

    if (!foundClub) {
      return "Ekran główny";
    }
    return foundClub.name;
  };

  useEffect(() => {
    setCurrentClubName(getCurrentClubName());
  }, [params, clubs, searchParams]);

  const [currentClubName, setCurrentClubName] = useState(getCurrentClubName());

  return (
    <nav className="sticky z-50 mb-2 flex gap-x-2">
      <Link href="/app">
        <h1 className="hidden text-2xl font-semibold md:block md:text-4xl">
          <span className="text-primary">K</span>ult
          <span className="text-primary">K</span>lub
        </h1>
        <Image
          src="/logo.png"
          alt="logo"
          className="block rounded-lg md:hidden"
          width={50}
          height={50}
        />
      </Link>
      <div className="flex items-center gap-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <p className="w-16 truncate text-start md:w-24">
                {currentClubName}
              </p>
              <ChevronDownIcon className="ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-72 overflow-y-scroll">
            <DropdownMenuLabel>Twoje kluby</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {clubs.map((v) => (
                <ListClubItem club={v} key={v.id} />
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <CreateClubDialog visible={isNewClubVisible}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <PlusIcon className="my-auto" />
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
                  <DropdownMenuItem onClick={() => setIsNewClubVisible(true)}>
                    Utwórz klub
                  </DropdownMenuItem>
                </DrawerTrigger>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CreateClubDialog>
      </div>

      <div className="ml-auto flex items-center gap-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="space-x-1" variant={"outline"}>
              <UserAvatar
                avatarUrl={session.user.avatarUrl}
                mediaType={session.user.avatarMediaType}
              />
              <p className="hidden md:block">{session.user.username}</p>
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Twoje konto</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link className="w-full" href={`/app/users/${session.user.id}`}>
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link className="w-full" href={`/app/myposts`}>
                  Moje posty
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link className="w-full" href={`/app/mycomments`}>
                  Moje komentarze
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link className="w-full" href={`/app/myclubs`}>
                  Moje kluby
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link className="w-full" href={`/app/saved`}>
                  Zapisane
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  className="flex w-full items-center gap-x-1"
                  onClick={() => _logout.mutate()}
                >
                  Wyloguj się
                  <LogOutIcon size={18} />
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;

type ListClubItemProps = {
  club: Club;
};

const ListClubItem = ({ club }: ListClubItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/app/club/${club.id}`} key={club.id}>
            <DropdownMenuItem className="cursor-pointer">
              <TooltipTrigger asChild>
                <div className="flex gap-x-2">
                  <ClubAvatar size={25} avatarUrl={club.avatarUrl} />
                  <p className="w-20 truncate">{club.name}</p>
                </div>
              </TooltipTrigger>
            </DropdownMenuItem>
          </Link>
        </TooltipTrigger>

        <TooltipContent>
          <p>{club.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
