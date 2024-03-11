import Link from "next/link";
import { NewClubMessage } from "../lib/pusher/client";
import { Button, buttonVariants } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { cn } from "../lib/utils";
import UserAvatar from "./UserAvatar";

type Props = {
  userId: string;
  message: NewClubMessage;
};

const ChatBubble = ({ message, userId }: Props) => {
  const isCreator = userId === message.user.id;

  return (
    <div
      className={`h-full w-2/3 min-w-36 max-w-fit ${isCreator ? "self-end bg-secondary text-black" : "text-white"} rounded-lg bg-primary p-1  dark:text-black`}
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button
            variant={"link"}
            className={`p-0 text-lg font-semibold text-white ${isCreator && "text-black"}`}
          >
            @{message.user.username}
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="flex w-80 gap-x-1">
          <Link
            href={`/app/users/${message.user.id}`}
            className={`${cn(
              buttonVariants({
                variant: "link",
                className: "p-0 text-lg font-semibold ",
              }),
            )}`}
          >
            @{message.user.username}
          </Link>
          <UserAvatar
            avatarUrl={message.user.avatarUrl}
            mediaType={message.user.avatarMediaType}
          />
        </HoverCardContent>
      </HoverCard>

      <p>{message.message}</p>
    </div>
  );
};

export default ChatBubble;
